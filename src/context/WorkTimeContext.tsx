// src/context/WorkTimeContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    type ReactNode,
    useCallback,
} from 'react';
import { useAuth } from './AuthContext'; // IMPORTANT: Ajoutez cet import
import workTimeService from '../services/workTimeService';
import type { WorkTime, WorkTimeStatus } from '../types';

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
    resetWorkTime: () => void; // Nouvelle fonction
}

const WorkTimeContext = createContext<WorkTimeContextType | undefined>(undefined);

export const useWorkTime = () => {
    const context = useContext(WorkTimeContext);
    if (!context) {
        throw new Error('useWorkTime must be used within a WorkTimeProvider');
    }
    return context;
};

interface WorkTimeProviderProps {
    children: ReactNode;
}

export const WorkTimeProvider: React.FC<WorkTimeProviderProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuth(); // Récupérez l'utilisateur actuel
    const [currentStatus, setCurrentStatus] = useState<WorkTimeStatus | null>(null);
    const [activeWorkTime, setActiveWorkTime] = useState<WorkTime | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Références pour le timer
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const baseTimeRef = useRef<number>(0);
    const timerStartRef = useRef<number>(0);
    const isMountedRef = useRef(true);
    const currentUserIdRef = useRef<number | null>(null);

    // Clé pour le localStorage avec ID utilisateur
    const getStorageKey = useCallback(() => {
        const userId = user?.id || 'anonymous';
        return `work_timer_state_${userId}`;
    }, [user?.id]);

    // Nettoyer complètement l'état
    const resetWorkTime = useCallback(() => {
        console.log('Resetting work time state');

        // Arrêter le timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Réinitialiser toutes les références
        baseTimeRef.current = 0;
        timerStartRef.current = 0;
        setIsTimerRunning(false);

        // Réinitialiser tous les états
        setCurrentStatus(null);
        setActiveWorkTime(null);
        setElapsedTime(0);
        setError(null);

        // Nettoyer le localStorage pour l'ancien utilisateur
        if (currentUserIdRef.current) {
            const oldKey = `work_timer_state_${currentUserIdRef.current}`;
            localStorage.removeItem(oldKey);
        }

        // Mettre à jour l'ID utilisateur actuel
        currentUserIdRef.current = user?.id || null;
    }, [user?.id]);

    // Réinitialiser lorsque l'utilisateur change
    useEffect(() => {
        if (!isMountedRef.current) return;

        const userId = user?.id || null;

        // Si l'utilisateur a changé, réinitialiser
        if (userId !== currentUserIdRef.current) {
            console.log('User changed, resetting work time:', {
                oldUser: currentUserIdRef.current,
                newUser: userId,
            });
            resetWorkTime();
        }

        // Mettre à jour la référence de l'utilisateur actuel
        currentUserIdRef.current = userId;
    }, [user?.id, resetWorkTime]);

    // Sauvegarder l'état dans localStorage
    const saveTimerState = useCallback(
        (state: { baseTime: number; isRunning: boolean; savedAt: number; workTimeId?: number }) => {
            if (!user?.id) return; // Ne pas sauvegarder si pas d'utilisateur

            try {
                localStorage.setItem(getStorageKey(), JSON.stringify(state));
            } catch (error) {
                console.error('Erreur sauvegarde localStorage:', error);
            }
        },
        [user?.id, getStorageKey]
    );

    // Restaurer l'état depuis localStorage
    const restoreTimerState = useCallback((): {
        baseTime: number;
        isRunning: boolean;
        savedAt: number;
        workTimeId?: number;
    } | null => {
        if (!user?.id) return null; // Ne pas restaurer si pas d'utilisateur

        try {
            const saved = localStorage.getItem(getStorageKey());
            if (!saved) return null;

            const state = JSON.parse(saved);

            // Vérifier que l'état n'est pas trop vieux (max 1h)
            const now = Date.now();
            if (now - state.savedAt > 60 * 60 * 1000) {
                localStorage.removeItem(getStorageKey());
                return null;
            }

            return state;
        } catch (error) {
            console.error('Erreur restauration localStorage:', error);
            localStorage.removeItem(getStorageKey());
            return null;
        }
    }, [user?.id, getStorageKey]);

    // Nettoyer localStorage
    const clearTimerState = useCallback(() => {
        if (user?.id) {
            localStorage.removeItem(getStorageKey());
        }
    }, [user?.id, getStorageKey]);

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
            if (activeWorkTime && user?.id) {
                saveTimerState({
                    baseTime: baseTimeRef.current,
                    isRunning: false,
                    savedAt: Date.now(),
                    workTimeId: activeWorkTime.id,
                });
            }
        },
        [clearTimerInterval, activeWorkTime, saveTimerState, user?.id]
    );

    // Initialisation
    useEffect(() => {
        isMountedRef.current = true;

        // Charger le statut seulement si authentifié
        if (isAuthenticated && user) {
            loadStatus();
        } else {
            // Si non authentifié, reset tout
            resetWorkTime();
        }

        return () => {
            isMountedRef.current = false;
            clearTimerInterval();
        };
    }, [isAuthenticated, user, clearTimerInterval, resetWorkTime]);

    // Charger le statut
    const loadStatus = async () => {
        if (!isAuthenticated || !user) {
            resetWorkTime();
            return;
        }

        try {
            setIsLoading(true);
            const status = await workTimeService.getStatus();
            setCurrentStatus(status);

            if (status.work_time) {
                setActiveWorkTime(status.work_time);

                // Utiliser le temps net du backend comme source de vérité
                const backendTime = status.work_time.net_seconds || 0;
                baseTimeRef.current = backendTime;
                setElapsedTime(backendTime);

                // Gérer le timer selon le statut
                if (status.work_time.status === 'in_progress') {
                    startTimer(backendTime);
                } else {
                    stopTimer(backendTime);
                }

                console.log('État chargé depuis backend:', {
                    userId: user?.id,
                    status: status.work_time.status,
                    time: backendTime,
                    isRunning: status.work_time.status === 'in_progress',
                });
            } else {
                // Pas de journée en cours
                resetWorkTime();
                clearTimerState();
            }
        } catch (err: any) {
            console.error('Erreur loadStatus:', err);

            // Si erreur 401 (non autorisé), reset
            if (err.response?.status === 401) {
                resetWorkTime();
            } else {
                setError(err.message || 'Erreur lors du chargement du statut');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Démarrer la journée
    const startDay = async () => {
        if (!isAuthenticated || !user) {
            throw new Error('Utilisateur non authentifié');
        }

        try {
            setIsLoading(true);
            const response = await workTimeService.startDay();

            // Mettre à jour l'état
            setActiveWorkTime(response.data);
            setCurrentStatus({
                has_active_day: true,
                current_status: 'in_progress',
                today: new Date().toISOString().split('T')[0],
                day_name: new Date().toLocaleDateString('fr-FR', { weekday: 'long' }),
                daily_target_hours: workTimeService.getDailyTarget(),
                work_time: response.data,
            });

            // Démarrer le timer avec le temps actuel du backend
            const elapsedSeconds = response.data.net_seconds || 0;
            baseTimeRef.current = elapsedSeconds;
            setElapsedTime(elapsedSeconds);
            startTimer(elapsedSeconds);

            console.log('Journée démarrée pour user', user.id, ':', elapsedSeconds, 'secondes');
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message || 'Erreur lors du démarrage de la journée';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Mettre en pause
    const pauseWork = async () => {
        if (!isAuthenticated || !user) {
            throw new Error('Utilisateur non authentifié');
        }

        try {
            setIsLoading(true);

            // Arrêter le timer IMMÉDIATEMENT
            let currentTime = baseTimeRef.current;
            if (timerStartRef.current > 0) {
                const elapsedMs = Date.now() - timerStartRef.current;
                currentTime += Math.floor(elapsedMs / 1000);
            }
            stopTimer(currentTime);

            const response = await workTimeService.pause();
            setActiveWorkTime(response.data);
            setCurrentStatus((prev) =>
                prev
                    ? {
                          ...prev,
                          current_status: 'paused',
                          work_time: response.data,
                      }
                    : null
            );

            console.log('Paused for user', user.id, 'at:', currentTime, 'seconds');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erreur lors de la pause';
            setError(errorMessage);

            // En cas d'erreur, redémarrer le timer
            startTimer(baseTimeRef.current);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Reprendre
    const resumeWork = async () => {
        if (!isAuthenticated || !user) {
            throw new Error('Utilisateur non authentifié');
        }

        try {
            setIsLoading(true);
            const response = await workTimeService.resume();
            setActiveWorkTime(response.data);
            setCurrentStatus((prev) =>
                prev
                    ? {
                          ...prev,
                          current_status: 'in_progress',
                          work_time: response.data,
                      }
                    : null
            );

            // Redémarrer le timer avec le temps actuel
            startTimer(baseTimeRef.current);

            console.log('Reprise pour user', user.id, 'à:', baseTimeRef.current, 'secondes');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erreur lors de la reprise';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Terminer la journée
    const endDay = async () => {
        if (!isAuthenticated || !user) {
            throw new Error('Utilisateur non authentifié');
        }

        try {
            setIsLoading(true);

            // Arrêter le timer et calculer le temps final
            let finalTime = baseTimeRef.current;
            if (timerStartRef.current > 0) {
                const elapsedMs = Date.now() - timerStartRef.current;
                finalTime += Math.floor(elapsedMs / 1000);
            }
            stopTimer(finalTime);

            const response = await workTimeService.endDay();
            setActiveWorkTime(response.data);
            setCurrentStatus((prev) =>
                prev
                    ? {
                          ...prev,
                          current_status: 'completed',
                          work_time: response.data,
                      }
                    : null
            );

            console.log('Journée terminée pour user', user.id, ':', finalTime, 'secondes');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Erreur lors de la fin de journée';

            // Si l'erreur est "Aucune journée en cours", on reset l'état local
            if (errorMessage.includes('Aucune journée en cours')) {
                console.log("Reset de l'état local - journée déjà terminée");
                resetWorkTime();
            }

            setError(errorMessage);
            throw new Error(errorMessage);
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
        resetWorkTime, // Exportez la fonction
    };

    return <WorkTimeContext.Provider value={value}>{children}</WorkTimeContext.Provider>;
};
