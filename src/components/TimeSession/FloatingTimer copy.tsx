// src/components/FloatingTimer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useWorkTime } from '../../context/WorkTimeContext';
import {
    Play,
    Pause,
    StopCircle,
    Clock,
    Coffee,
    ChevronUp,
    ChevronDown,
    Target,
    CheckCircle,
    Bell,
    Sun,
} from 'lucide-react';
import workTimeService from '../../services/workTimeService';
import PauseReminderModal from './PauseReminderModal';
import DailyStartReminderModal from './DailyStartReminderModal';

const FloatingTimer: React.FC = () => {
    const {
        currentStatus,
        activeWorkTime,
        isLoading,
        elapsedTime,
        isTimerRunning,
        startDay,
        pauseWork,
        resumeWork,
        endDay,
    } = useWorkTime();

    const [isExpanded, setIsExpanded] = useState(false);
    const [dailyTarget, setDailyTarget] = useState(8 * 3600);

    // États pour le système de rappel de pause
    const [showPauseReminder, setShowPauseReminder] = useState(false);
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
    const [pauseDuration, setPauseDuration] = useState(0);
    const pauseReminderIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pauseCheckIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // États pour le système de rappel de démarrage
    const [showStartReminder, setShowStartReminder] = useState(false);
    const [lastReminderTime, setLastReminderTime] = useState<number | null>(null);
    const startReminderCheckRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Calculer la cible quotidienne
    useEffect(() => {
        setDailyTarget(workTimeService.getDailyTarget() * 3600);
    }, []);

    // ===== SYSTÈME DE RAPPEL POUR DÉMARRER LA JOURNÉE =====
    useEffect(() => {
        // Ne pas vérifier si l'utilisateur est déjà connecté ou a une journée active
        if (currentStatus?.has_active_day || !currentStatus) {
            return;
        }

        // Vérifier si c'est un jour de travail
        const today = new Date();
        const dayOfWeek = today.getDay();
        const currentHour = today.getHours();

        // Conditions pour afficher le rappel :
        // 1. C'est un jour de travail (pas dimanche)
        // 2. Il est entre 8h et 18h (heures de travail typiques)
        // 3. L'utilisateur n'a pas de journée active
        // 4. On n'a pas déjà montré un rappel récemment (dernières 30 minutes)
        if (dayOfWeek !== 0 && currentHour >= 8 && currentHour <= 18) {
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000;

            // Vérifier si on a déjà montré un rappel récemment
            if (!lastReminderTime || now - lastReminderTime > thirtyMinutes) {
                // Attendre quelques secondes après le chargement pour éviter de spammer
                const timer = setTimeout(() => {
                    setShowStartReminder(true);
                    setLastReminderTime(now);
                }, 10000); // 10 secondes après le chargement

                return () => clearTimeout(timer);
            }
        }
    }, [currentStatus?.has_active_day, currentStatus, lastReminderTime]);

    // Vérifier périodiquement si on doit montrer le rappel de démarrage
    useEffect(() => {
        startReminderCheckRef.current = setInterval(() => {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();

            // Conditions :
            // 1. Pas de journée active
            // 2. Jour de travail
            // 3. Heures de bureau
            // 4. Pas de rappel récent
            // 5. Afficher toutes les 2 heures (aux heures paires)
            if (
                !currentStatus?.has_active_day &&
                dayOfWeek !== 0 &&
                currentHour >= 8 &&
                currentHour <= 18 &&
                currentHour % 2 === 0 &&
                currentMinute < 5 && // Afficher pendant les 5 premières minutes des heures paires
                (!lastReminderTime || Date.now() - lastReminderTime > 60 * 60 * 1000) // Au moins 1 heure depuis le dernier rappel
            ) {
                setShowStartReminder(true);
                setLastReminderTime(Date.now());
            }
        }, 60000); // Vérifier toutes les minutes

        return () => {
            if (startReminderCheckRef.current) {
                clearInterval(startReminderCheckRef.current);
            }
        };
    }, [currentStatus?.has_active_day, lastReminderTime]);

    // ===== SYSTÈME DE RAPPEL POUR LES PAUSES =====
    useEffect(() => {
        if (currentStatus?.current_status === 'paused' && !pauseStartTime) {
            // L'utilisateur vient de passer en pause
            const now = Math.floor(Date.now() / 1000);
            setPauseStartTime(now);
            startPauseReminderSystem();
        } else if (currentStatus?.current_status !== 'paused' && pauseStartTime) {
            // L'utilisateur a repris le travail
            clearPauseReminderSystem();
            setPauseStartTime(null);
            setPauseDuration(0);
            setShowPauseReminder(false);
        }
    }, [currentStatus?.current_status]);

    // Système de vérification périodique pendant la pause
    const startPauseReminderSystem = () => {
        if (pauseReminderIntervalRef.current) {
            clearInterval(pauseReminderIntervalRef.current);
        }

        pauseReminderIntervalRef.current = setInterval(() => {
            if (pauseStartTime) {
                const now = Math.floor(Date.now() / 1000);
                const duration = now - pauseStartTime;
                setPauseDuration(duration);

                // Afficher le rappel après 1 minute (60 secondes)
                if (duration >= 60 && !showPauseReminder) {
                    setShowPauseReminder(true);
                    startRepeatedPauseReminders();
                }
            }
        }, 1000);
    };

    // Rappels répétés toutes les minutes pour les pauses
    const startRepeatedPauseReminders = () => {
        if (pauseCheckIntervalRef.current) {
            clearInterval(pauseCheckIntervalRef.current);
        }

        pauseCheckIntervalRef.current = setInterval(() => {
            if (currentStatus?.current_status === 'paused' && pauseStartTime) {
                const now = Math.floor(Date.now() / 1000);
                const duration = now - pauseStartTime;

                // Si la pause dure plus de 2 minutes, afficher à nouveau
                if (duration > 120) {
                    setShowPauseReminder(true);
                }
            }
        }, 60000);
    };

    // Nettoyer les intervalles des pauses
    const clearPauseReminderSystem = () => {
        if (pauseReminderIntervalRef.current) {
            clearInterval(pauseReminderIntervalRef.current);
            pauseReminderIntervalRef.current = null;
        }
        if (pauseCheckIntervalRef.current) {
            clearInterval(pauseCheckIntervalRef.current);
            pauseCheckIntervalRef.current = null;
        }
    };

    // Gérer la reprise depuis le modal
    const handleResumeFromReminder = () => {
        resumeWork();
        setShowPauseReminder(false);
    };

    // Gérer le démarrage depuis le modal
    const handleStartFromReminder = () => {
        startDay();
        setShowStartReminder(false);
    };

    // Nettoyage à la destruction du composant
    useEffect(() => {
        return () => {
            clearPauseReminderSystem();
            if (startReminderCheckRef.current) {
                clearInterval(startReminderCheckRef.current);
            }
        };
    }, []);

    // Formater le temps
    const formatTime = (seconds: number): string => {
        return workTimeService.formatTime(seconds);
    };

    // Calculer la progression
    const calculateProgress = (): number => {
        if (dailyTarget === 0) return 0;
        const progress = (elapsedTime / dailyTarget) * 100;
        return Math.min(100, Math.round(progress * 100) / 100);
    };

    // Obtenir l'icône du statut
    const getStatusIcon = (status: string | null) => {
        switch (status) {
            case 'in_progress':
                return <Play className="w-4 h-4" />;
            case 'paused':
                return <Pause className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    // Si c'est dimanche, ne pas afficher
    const isWorkDay = (): boolean => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        return dayOfWeek !== 0;
    };

    // Si la journée est terminée, ne pas afficher les boutons d'action
    const isDayCompleted = currentStatus?.current_status === 'completed';
    const canStartDay = !currentStatus?.has_active_day || isDayCompleted;
    const canPause = currentStatus?.current_status === 'in_progress';
    const canResume = currentStatus?.current_status === 'paused';
    const canEndDay =
        currentStatus?.current_status === 'in_progress' ||
        currentStatus?.current_status === 'paused';

    if (!isWorkDay()) {
        return null;
    }

    // Indicateur de rappel de démarrage (petite icône)
    const showStartIndicator =
        !currentStatus?.has_active_day && new Date().getHours() >= 8 && new Date().getHours() <= 18;

    return (
        <>
            {/* Modal de rappel pour démarrer la journée */}
            <DailyStartReminderModal
                isOpen={showStartReminder}
                onClose={() => setShowStartReminder(false)}
                onStartDay={handleStartFromReminder}
            />

            {/* Modal de rappel de pause */}
            <PauseReminderModal
                isOpen={showPauseReminder}
                onClose={() => setShowPauseReminder(false)}
                onResume={handleResumeFromReminder}
                pauseDuration={pauseDuration}
            />

            {/* Indicateur de rappel de démarrage */}
            {showStartIndicator && !currentStatus?.has_active_day && (
                <div className="fixed bottom-20 right-4 z-40 animate-pulse">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full p-3 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
                        onClick={() => setShowStartReminder(true)}
                        title="Démarrer votre journée ?"
                    >
                        <Sun className="w-6 h-6" />
                    </div>
                </div>
            )}

            {/* Indicateur de rappel de pause */}
            {currentStatus?.current_status === 'paused' && pauseDuration >= 60 && (
                <div className="fixed bottom-20 right-16 z-40">
                    <div
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full p-3 shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 animate-bounce"
                        onClick={() => setShowPauseReminder(true)}
                        title="Vous êtes toujours en pause"
                    >
                        <Bell className="w-6 h-6" />
                    </div>
                </div>
            )}

            {/* Timer principal */}
            <div className="fixed bottom-4 right-4 z-50">
                {/* Version compacte */}
                {!isExpanded && (
                    <div
                        className="bg-white rounded-xl shadow-xl border border-gray-200 p-3 cursor-pointer hover:shadow-2xl transition-all duration-300"
                        onClick={() => setIsExpanded(true)}
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    currentStatus?.current_status === 'in_progress'
                                        ? 'bg-green-500'
                                        : currentStatus?.current_status === 'paused'
                                        ? 'bg-yellow-500'
                                        : currentStatus?.current_status === 'completed'
                                        ? 'bg-blue-500'
                                        : 'bg-gray-500'
                                }`}
                            ></div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">
                                    {formatTime(elapsedTime)}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {currentStatus?.current_status
                                        ? currentStatus.current_status === 'in_progress'
                                            ? 'En cours'
                                            : currentStatus.current_status === 'paused'
                                            ? 'En pause'
                                            : currentStatus.current_status === 'completed'
                                            ? 'Terminé'
                                            : 'Prêt'
                                        : 'Prêt'}
                                </div>
                            </div>
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                        </div>

                        {currentStatus?.current_status === 'in_progress' && (
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                                <div
                                    className="bg-green-500 h-1 rounded-full transition-all duration-300"
                                    style={{ width: `${calculateProgress()}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                )}

                {/* Version étendue */}
                {isExpanded && (
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 overflow-hidden">
                        <div className="bg-gradient-to-r from-[#31b6b8] to-[#259a9c] p-4 text-white">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5" />
                                    <h3 className="font-bold">Time Tracker</h3>
                                </div>
                                <button
                                    onClick={() => setIsExpanded(false)}
                                    className="text-white hover:text-gray-200"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-2 text-sm opacity-90">
                                {new Date().toLocaleDateString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                })}
                            </div>
                        </div>

                        <div className="p-4">
                            {/* Temps écoulé */}
                            <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {formatTime(elapsedTime)}
                                </div>
                                <div className="flex items-center justify-center text-sm text-gray-600">
                                    <Target className="w-4 h-4 mr-1" />
                                    <span>Objectif: {dailyTarget / 3600}h</span>
                                </div>
                            </div>

                            {/* Rappel pour démarrer si pas de journée active */}
                            {!currentStatus?.has_active_day && (
                                <div className="mb-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Sun className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-blue-800 font-medium">
                                                Journée non démarrée
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setShowStartReminder(true)}
                                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                                        >
                                            Démarrer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Indicateur de pause longue */}
                            {currentStatus?.current_status === 'paused' && pauseDuration >= 60 && (
                                <div className="mb-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Bell className="w-4 h-4 text-yellow-600" />
                                            <span className="text-sm text-yellow-800 font-medium">
                                                Pause: {formatTime(pauseDuration)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setShowPauseReminder(true)}
                                            className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                                        >
                                            Voir rappel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Progression */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Progression</span>
                                    <span>{calculateProgress().toFixed(1)}%</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            calculateProgress() >= 100
                                                ? 'bg-green-500'
                                                : 'bg-[#31b6b8]'
                                        }`}
                                        style={{ width: `${calculateProgress()}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Statut */}
                            <div className="mb-4">
                                <div
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                        currentStatus?.current_status === 'in_progress'
                                            ? 'bg-green-100 text-green-800'
                                            : currentStatus?.current_status === 'paused'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : currentStatus?.current_status === 'completed'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {getStatusIcon(currentStatus?.current_status || null)}
                                    <span className="ml-2 font-medium">
                                        {currentStatus?.current_status
                                            ? currentStatus.current_status === 'in_progress'
                                                ? 'En cours'
                                                : currentStatus.current_status === 'paused'
                                                ? 'En pause'
                                                : currentStatus.current_status === 'completed'
                                                ? 'Terminé'
                                                : 'Non démarré'
                                            : 'Non démarré'}
                                    </span>
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="grid grid-cols-2 gap-2">
                                {canStartDay && (
                                    <button
                                        onClick={startDay}
                                        disabled={isLoading}
                                        className="col-span-2 bg-gradient-to-r from-[#31b6b8] to-[#259a9c] text-white font-medium py-2.5 rounded-lg hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        {currentStatus?.current_status === 'completed'
                                            ? 'Démarrer nouvelle journée'
                                            : 'Démarrer la journée'}
                                    </button>
                                )}

                                {canPause && (
                                    <button
                                        onClick={pauseWork}
                                        disabled={isLoading}
                                        className="bg-yellow-500 text-white font-medium py-2.5 rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <Pause className="w-4 h-4 mr-2" />
                                        Pause
                                    </button>
                                )}

                                {canEndDay && (
                                    <button
                                        onClick={endDay}
                                        disabled={isLoading}
                                        className={`${
                                            canPause ? '' : 'col-span-2'
                                        } bg-red-500 text-white font-medium py-2.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center`}
                                    >
                                        <StopCircle className="w-4 h-4 mr-2" />
                                        Terminer
                                    </button>
                                )}

                                {canResume && (
                                    <button
                                        onClick={resumeWork}
                                        disabled={isLoading}
                                        className="col-span-2 bg-green-500 text-white font-medium py-2.5 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        Reprendre
                                    </button>
                                )}
                            </div>

                            {/* Détails */}
                            {activeWorkTime && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Temps travail:</span>
                                            <span className="font-medium">
                                                {(elapsedTime / 3600).toFixed(2)}h
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 flex items-center">
                                                <Coffee className="w-3 h-3 mr-1" />
                                                Pause:
                                            </span>
                                            <span className="font-medium">
                                                {activeWorkTime.pause_hours?.toFixed(2) || '0.00'}h
                                            </span>
                                        </div>
                                        {currentStatus?.current_status === 'paused' &&
                                            pauseStartTime && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">
                                                        Durée pause:
                                                    </span>
                                                    <span className="font-medium text-yellow-600">
                                                        {formatTime(pauseDuration)}
                                                    </span>
                                                </div>
                                            )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Progression:</span>
                                            <span className="font-medium">
                                                {calculateProgress().toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay mobile */}
            {isExpanded && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                    onClick={() => setIsExpanded(false)}
                />
            )}
        </>
    );
};

export default FloatingTimer;
