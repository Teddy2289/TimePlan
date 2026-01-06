// src/components/FloatingTimer.tsx
import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import workTimeService from '../../services/workTimeService';

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

    // Calculer la cible quotidienne - À CORRIGER
    useEffect(() => {
        // Utiliser la méthode du service ou calculer comme dans le backend
        setDailyTarget(workTimeService.getDailyTarget() * 3600);
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

    // Obtenir l'icône du statut - DÉJÀ CORRECT
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

    // Si c'est dimanche, ne pas afficher - À CORRIGER
    const isWorkDay = (): boolean => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        // Selon votre backend: Dimanche = 0 => pas de travail
        // Samedi = 6 => 4 heures
        // Lundi-Vendredi = 1-5 => 8 heures
        return dayOfWeek !== 0; // Dimanche: pas de travail
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

    return (
        <>
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
                            {/* Boutons - LOGIQUE CORRIGÉE */}
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
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Progression:</span>
                                            <span className="font-medium">
                                                {calculateProgress().toFixed(1)}%
                                            </span>
                                        </div>

                                        {/* Bouton de debug amélioré */}
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const status =
                                                        await workTimeService.getStatus();
                                                    console.log('Debug - État complet:', status);

                                                    const message = `
État backend:
- Journée active: ${status.has_active_day ? 'Oui' : 'Non'}
- Statut: ${status.current_status || 'Aucun'}
- Temps net: ${status.work_time?.net_seconds || 0}s (${
                                                        (status.work_time?.net_seconds || 0) / 3600
                                                    }h)
- Pause: ${status.work_time?.pause_seconds || 0}s (${
                                                        (status.work_time?.pause_seconds || 0) /
                                                        3600
                                                    }h)
- Total: ${status.work_time?.total_seconds || 0}s
- Date: ${status.today}
                          `.trim();

                                                    alert(message);
                                                } catch (error) {
                                                    console.error('Debug error:', error);
                                                    alert(
                                                        "Erreur lors de la récupération de l'état backend"
                                                    );
                                                }
                                            }}
                                            className="w-full mt-2 text-xs text-blue-500 underline text-left"
                                        >
                                            Vérifier état backend
                                        </button>
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
