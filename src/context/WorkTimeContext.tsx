// src/context/WorkTimeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  useCallback,
} from "react";
import workTimeService from "../services/workTimeService";
import type { WorkTime, WorkTimeStatus } from "../types";

interface WorkTimeContextType {
  currentStatus: WorkTimeStatus | null;
  activeWorkTime: WorkTime | null;
  isLoading: boolean;
  error: string | null;
  elapsedTime: number;
  isTimerRunning: boolean;
  startDay: () => Promise<void>;
  pauseWork: () => Promise<void>;
  resumeWork: () => Promise<void>;
  endDay: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const SYNC_INTERVAL = 30000; // Synchroniser toutes les 30 secondes
const AUTO_SAVE_INTERVAL = 60000;

const WorkTimeContext = createContext<WorkTimeContextType | undefined>(
  undefined
);

export const useWorkTime = () => {
  const context = useContext(WorkTimeContext);
  if (!context) {
    throw new Error("useWorkTime must be used within a WorkTimeProvider");
  }
  return context;
};

interface WorkTimeProviderProps {
  children: ReactNode;
}

export const WorkTimeProvider: React.FC<WorkTimeProviderProps> = ({
  children,
}) => {
  const [currentStatus, setCurrentStatus] = useState<WorkTimeStatus | null>(
    null
  );
  const [activeWorkTime, setActiveWorkTime] = useState<WorkTime | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSyncRef = useRef<number>(Date.now());
  const syncWithBackend = useCallback(async () => {
    if (!activeWorkTime || !isTimerRunning) return;

    try {
      const now = Date.now();
      const timeSinceLastSync = now - lastSyncRef.current;

      // Se synchroniser seulement si plus de 30 secondes se sont écoulées
      if (timeSinceLastSync < SYNC_INTERVAL) return;

      const syncData = {
        work_time_id: activeWorkTime.id,
        elapsed_seconds: elapsedTime,
        is_running: isTimerRunning,
        last_sync_at: new Date().toISOString(),
      };

      await workTimeService.syncTime(syncData);
      lastSyncRef.current = now;

      console.log("Synchro réussie:", elapsedTime, "secondes");
    } catch (error) {
      console.error("Erreur synchro:", error);
      // Ne pas bloquer l'utilisateur en cas d'erreur
    }
  }, [activeWorkTime, elapsedTime, isTimerRunning]);

  // Fonction pour sauvegarder automatiquement
  const autoSave = useCallback(async () => {
    if (!activeWorkTime) return;

    try {
      const syncData = {
        work_time_id: activeWorkTime.id,
        elapsed_seconds: elapsedTime,
        is_running: isTimerRunning,
        last_sync_at: new Date().toISOString(),
      };

      await workTimeService.syncTime(syncData);
      console.log("Auto-sauvegarde réussie");
    } catch (error) {
      console.error("Erreur auto-sauvegarde:", error);
    }
  }, [activeWorkTime, elapsedTime, isTimerRunning]);
  // Références pour le timer
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baseTimeRef = useRef<number>(0);
  const timerStartRef = useRef<number>(0);
  const isMountedRef = useRef(true);

  // Clé pour le localStorage
  const STORAGE_KEY = "work_timer_state";

  // Sauvegarder l'état dans localStorage
  const saveTimerState = useCallback(
    (state: {
      baseTime: number;
      isRunning: boolean;
      savedAt: number;
      workTimeId?: number;
    }) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error("Erreur sauvegarde localStorage:", error);
      }
    },
    []
  );

  // Restaurer l'état depuis localStorage
  const restoreTimerState = useCallback((): {
    baseTime: number;
    isRunning: boolean;
    savedAt: number;
    workTimeId?: number;
  } | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const state = JSON.parse(saved);

      // Vérifier que l'état n'est pas trop vieux (max 24h)
      const now = Date.now();
      if (now - state.savedAt > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return state;
    } catch (error) {
      console.error("Erreur restauration localStorage:", error);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }, []);

  // Nettoyer localStorage
  const clearTimerState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Nettoyer l'intervalle
  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Démarrer le timer
  const startTimer = useCallback(
    (initialTime: number = 0) => {
      clearTimerInterval();

      baseTimeRef.current = initialTime;
      timerStartRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) return;

        const now = Date.now();
        const elapsedMs = now - timerStartRef.current;
        const totalSeconds = baseTimeRef.current + Math.floor(elapsedMs / 1000);

        setElapsedTime(totalSeconds);

        // Sauvegarder l'état en cours
        if (activeWorkTime) {
          saveTimerState({
            baseTime: totalSeconds,
            isRunning: true,
            savedAt: now,
            workTimeId: activeWorkTime.id,
          });
        }
      }, 1000);

      setIsTimerRunning(true);
    },
    [clearTimerInterval, activeWorkTime, saveTimerState]
  );

  useEffect(() => {
    if (activeWorkTime && isTimerRunning) {
      // Synchronisation périodique
      syncIntervalRef.current = setInterval(syncWithBackend, SYNC_INTERVAL);

      // Auto-sauvegarde périodique
      const autoSaveInterval = setInterval(autoSave, AUTO_SAVE_INTERVAL);

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
        }
        clearInterval(autoSaveInterval);
      };
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
      }
    };
  }, [activeWorkTime, isTimerRunning, syncWithBackend, autoSave]);
  useEffect(() => {
    return () => {
      if (activeWorkTime && isTimerRunning) {
        // Synchroniser une dernière fois
        syncWithBackend();
      }
    };
  }, [activeWorkTime, isTimerRunning, syncWithBackend]);
  // Arrêter le timer
  const stopTimer = useCallback(
    (finalTime?: number) => {
      clearTimerInterval();

      // Calculer le temps final
      if (timerStartRef.current > 0) {
        const elapsedMs = Date.now() - timerStartRef.current;
        baseTimeRef.current += Math.floor(elapsedMs / 1000);
        timerStartRef.current = 0;
      }

      if (finalTime !== undefined) {
        baseTimeRef.current = finalTime;
      }

      setElapsedTime(baseTimeRef.current);
      setIsTimerRunning(false);

      // Sauvegarder l'état arrêté
      if (activeWorkTime) {
        saveTimerState({
          baseTime: baseTimeRef.current,
          isRunning: false,
          savedAt: Date.now(),
          workTimeId: activeWorkTime.id,
        });
      }
    },
    [clearTimerInterval, activeWorkTime, saveTimerState]
  );

  // Initialisation
  useEffect(() => {
    isMountedRef.current = true;
    loadStatus();

    return () => {
      isMountedRef.current = false;
      clearTimerInterval();
    };
  }, [clearTimerInterval]);

  // Dans WorkTimeContext.tsx - Améliorer loadStatus
  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const status = await workTimeService.getStatus();
      setCurrentStatus(status);

      if (status.work_time) {
        setActiveWorkTime(status.work_time);

        // Toujours utiliser le temps du backend comme source de vérité
        const backendTime = status.work_time.net_seconds || 0;

        // Ne pas utiliser localStorage si on a un backend fiable
        baseTimeRef.current = backendTime;
        setElapsedTime(backendTime);

        // Gérer le timer selon le statut
        if (status.work_time.status === "in_progress") {
          startTimer(backendTime);
        } else {
          stopTimer(backendTime);
        }

        // Sauvegarder l'état actuel pour la résilience
        saveTimerState({
          baseTime: backendTime,
          isRunning: status.work_time.status === "in_progress",
          savedAt: Date.now(),
          workTimeId: status.work_time.id,
        });

        console.log("État chargé depuis backend:", backendTime, "secondes");
      } else {
        // Pas de journée en cours
        clearTimerState();
        baseTimeRef.current = 0;
        setElapsedTime(0);
        setIsTimerRunning(false);
        clearTimerInterval();
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement du statut");
      console.error("Erreur loadStatus:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Dans WorkTimeContext.tsx - Modifier la fonction startDay
  const startDay = async () => {
    try {
      setIsLoading(true);
      const response = await workTimeService.startDay();

      // Vérifier si la journée était déjà démarrée
      if (response.already_started) {
        // Si déjà démarrée, on met à jour l'état avec les données actuelles
        setActiveWorkTime(response.data);
        setCurrentStatus({
          has_active_day: true,
          current_status: "in_progress",
          today: new Date().toISOString().split("T")[0],
          day_name: new Date().toLocaleDateString("fr-FR", { weekday: "long" }),
          daily_target_hours: workTimeService.getDailyTarget(),
          work_time: response.data,
        });

        // Mettre à jour le timer avec le temps réel du backend
        const elapsedSeconds = response.data.net_seconds || 0;
        baseTimeRef.current = elapsedSeconds;
        setElapsedTime(elapsedSeconds);

        // Démarrer le timer si ce n'est pas déjà fait
        if (!isTimerRunning) {
          startTimer(elapsedSeconds);
        }

        console.log(
          "Journée déjà en cours, état récupéré:",
          elapsedSeconds,
          "secondes"
        );
      } else {
        // Nouvelle journée démarrée
        setActiveWorkTime(response.data);
        setCurrentStatus({
          has_active_day: true,
          current_status: "in_progress",
          today: new Date().toISOString().split("T")[0],
          day_name: new Date().toLocaleDateString("fr-FR", { weekday: "long" }),
          daily_target_hours: workTimeService.getDailyTarget(),
          work_time: response.data,
        });

        // Démarrer le timer à zéro
        baseTimeRef.current = 0;
        setElapsedTime(0);
        startTimer(0);
      }

      lastSyncRef.current = Date.now();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors du démarrage de la journée"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const pauseWork = async () => {
    try {
      // Arrêter le timer IMMÉDIATEMENT
      let currentTime = baseTimeRef.current;
      if (timerStartRef.current > 0) {
        const elapsedMs = Date.now() - timerStartRef.current;
        currentTime += Math.floor(elapsedMs / 1000);
      }

      stopTimer(currentTime);

      // Synchroniser avant la pause
      if (activeWorkTime) {
        await workTimeService.syncTime({
          work_time_id: activeWorkTime.id,
          elapsed_seconds: currentTime,
          is_running: false,
          last_sync_at: new Date().toISOString(),
        });
      }

      setIsLoading(true);
      const response = await workTimeService.pause();
      setActiveWorkTime(response.data);
      setCurrentStatus((prev) =>
        prev
          ? {
              ...prev,
              current_status: "paused",
              work_time: response.data,
            }
          : null
      );

      console.log("Paused at:", currentTime, "seconds");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la pause");
      startTimer(baseTimeRef.current);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resumeWork = async () => {
    try {
      setIsLoading(true);
      const response = await workTimeService.resume();
      setActiveWorkTime(response.data);
      setCurrentStatus((prev) =>
        prev
          ? {
              ...prev,
              current_status: "in_progress",
              work_time: response.data,
            }
          : null
      );

      // Redémarrer le timer avec le temps actuel
      startTimer(baseTimeRef.current);

      console.log("Resumed at:", baseTimeRef.current, "seconds");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la reprise");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const endDay = async () => {
    try {
      setIsLoading(true);

      // Synchroniser le temps final
      let finalTime = baseTimeRef.current;
      if (timerStartRef.current > 0) {
        const elapsedMs = Date.now() - timerStartRef.current;
        finalTime += Math.floor(elapsedMs / 1000);
      }

      stopTimer(finalTime);

      // Synchroniser avant de terminer
      if (activeWorkTime) {
        await workTimeService.syncTime({
          work_time_id: activeWorkTime.id,
          elapsed_seconds: finalTime,
          is_running: false,
          last_sync_at: new Date().toISOString(),
        });
      }

      const response = await workTimeService.endDay();
      setActiveWorkTime(response.data);
      setCurrentStatus((prev) =>
        prev
          ? {
              ...prev,
              current_status: "completed",
              work_time: response.data,
            }
          : null
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors de la fin de journée"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    await loadStatus();
  };

  const value: WorkTimeContextType = {
    currentStatus,
    activeWorkTime,
    isLoading,
    error,
    elapsedTime,
    isTimerRunning,
    startDay,
    pauseWork,
    resumeWork,
    endDay,
    refreshStatus,
  };

  return (
    <WorkTimeContext.Provider value={value}>
      {children}
    </WorkTimeContext.Provider>
  );
};
