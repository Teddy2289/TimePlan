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
    User,
} from 'lucide-react';
import workTimeService from '../../services/workTimeService';
import PauseReminderModal from './PauseReminderModal';
import DailyStartReminderModal from './DailyStartReminderModal';
import { useAuth } from '../../context/AuthContext';

const FloatingTimer: React.FC = () => {
    const {
        currentStatus,
        activeWorkTime,
        isLoading,
        elapsedTime,
        startDay,
        pauseWork,
        resumeWork,
        endDay,
    } = useWorkTime();

    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [dailyTarget, setDailyTarget] = useState(8 * 3600);

    // États pour le système de rappel de pause
    const [showPauseReminder, setShowPauseReminder] = useState(false);
    const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);
    const [pauseDuration, setPauseDuration] = useState(0);
    const pauseReminderIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // États pour le système de rappel de démarrage
    const [showStartReminder, setShowStartReminder] = useState(false);
    const [lastReminderTime, setLastReminderTime] = useState<number | null>(null);

    // Calculer la cible quotidienne
    useEffect(() => {
        setDailyTarget(workTimeService.getDailyTarget() * 3600);
    }, []);

    // ===== SYSTÈME DE RAPPEL POUR DÉMARRER LA JOURNÉE =====
    useEffect(() => {
        if (isLoading || showStartReminder || currentStatus?.has_active_day) return;

        const today = new Date();
        const dayOfWeek = today.getDay();
        const currentHour = today.getHours();

        if (dayOfWeek !== 0 && currentHour >= 8 && currentHour <= 18) {
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000;

            if (!lastReminderTime || now - lastReminderTime > thirtyMinutes) {
                const timer = setTimeout(() => {
                    setShowStartReminder(true);
                    setLastReminderTime(now);
                }, 3000);

                return () => clearTimeout(timer);
            }
        }
    }, [currentStatus?.has_active_day, isLoading, showStartReminder, lastReminderTime]);

    // ===== SYSTÈME DE RAPPEL POUR LES PAUSES =====
    useEffect(() => {
        if (currentStatus?.current_status === 'paused' && !pauseStartTime) {
            const now = Math.floor(Date.now() / 1000);
            setPauseStartTime(now);
            setPauseDuration(0);
        } else if (currentStatus?.current_status !== 'paused' && pauseStartTime) {
            setPauseStartTime(null);
            setPauseDuration(0);
            setShowPauseReminder(false);
            if (pauseReminderIntervalRef.current) {
                clearInterval(pauseReminderIntervalRef.current);
            }
        }
    }, [currentStatus?.current_status]);

    // Mettre à jour la durée de pause
    useEffect(() => {
        if (currentStatus?.current_status === 'paused' && pauseStartTime) {
            const interval = setInterval(() => {
                const now = Math.floor(Date.now() / 1000);
                const duration = now - pauseStartTime;
                setPauseDuration(duration);

                if (duration >= 60 && !showPauseReminder) {
                    setShowPauseReminder(true);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentStatus?.current_status, pauseStartTime, showPauseReminder]);

    const handleResumeFromReminder = () => {
        resumeWork();
        setShowPauseReminder(false);
    };

    const handleStartFromReminder = () => {
        startDay();
        setShowStartReminder(false);
    };

    useEffect(() => {
        return () => {
            if (pauseReminderIntervalRef.current) {
                clearInterval(pauseReminderIntervalRef.current);
            }
        };
    }, []);

    const formatTime = (seconds: number): string => {
        return workTimeService.formatTime(seconds);
    };

    const calculateProgress = (): number => {
        if (dailyTarget === 0) return 0;
        const progress = (elapsedTime / dailyTarget) * 100;
        return Math.min(100, Math.round(progress * 100) / 100);
    };

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

    const isWorkDay = (): boolean => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        return dayOfWeek !== 0;
    };

    const isDayCompleted = currentStatus?.current_status === 'completed';
    const canStartDay = !currentStatus?.has_active_day || isDayCompleted;
    const canPause = currentStatus?.current_status === 'in_progress';
    const canResume = currentStatus?.current_status === 'paused';
    const canEndDay =
        currentStatus?.current_status === 'in_progress' ||
        currentStatus?.current_status === 'paused';

    const showStartIndicator =
        !currentStatus?.has_active_day &&
        new Date().getHours() >= 8 &&
        new Date().getHours() <= 18 &&
        !showStartReminder;

    if (!isWorkDay()) {
        return null;
    }

    // Obtenir les initiales de l'utilisateur
    const getUserInitials = () => {
        if (!user?.name) return 'U';
        return user.name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Obtenir la couleur du statut
    const getStatusColor = () => {
        switch (currentStatus?.current_status) {
            case 'in_progress':
                return {
                    bg: 'bg-gradient-to-r from-emerald-500 to-green-500',
                    ring: 'ring-emerald-500/20',
                    text: 'text-emerald-600',
                    light: 'bg-emerald-50',
                };
            case 'paused':
                return {
                    bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
                    ring: 'ring-amber-500/20',
                    text: 'text-amber-600',
                    light: 'bg-amber-50',
                };
            case 'completed':
                return {
                    bg: 'bg-gradient-to-r from-blue-500 to-indigo-500',
                    ring: 'ring-blue-500/20',
                    text: 'text-blue-600',
                    light: 'bg-blue-50',
                };
            default:
                return {
                    bg: 'bg-gradient-to-r from-slate-500 to-gray-500',
                    ring: 'ring-slate-500/20',
                    text: 'text-slate-600',
                    light: 'bg-slate-50',
                };
        }
    };

    const statusColor = getStatusColor();

    return (
        <>
            <DailyStartReminderModal
                isOpen={showStartReminder}
                onClose={() => setShowStartReminder(false)}
                onStartDay={handleStartFromReminder}
            />

            <PauseReminderModal
                isOpen={showPauseReminder}
                onClose={() => setShowPauseReminder(false)}
                onResume={handleResumeFromReminder}
                pauseDuration={pauseDuration}
            />

            {/* Indicateur de rappel de démarrage */}
            {showStartIndicator && (
                <div className="fixed bottom-24 right-6 z-40 animate-pulse hover:animate-none">
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowStartReminder(true)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                        <div
                            className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full p-4 shadow-2xl ring-2 ring-amber-500/30 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl"
                            style={{ marginBottom: '15px' }}
                        >
                            <Sun className="w-7 h-7" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-ping opacity-75"></div>
                    </div>
                </div>
            )}

            {/* Indicateur de rappel de pause */}
            {currentStatus?.current_status === 'paused' &&
                pauseDuration >= 60 &&
                !showPauseReminder && (
                    <div className="fixed bottom-24 right-20 z-40">
                        <div
                            className="relative group cursor-pointer animate-bounce hover:animate-none"
                            onClick={() => setShowPauseReminder(true)}
                            title="Vous êtes toujours en pause"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full p-3 shadow-xl ring-2 ring-amber-500/30 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                <Bell className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                )}

            {/* Timer principal */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Version compacte */}
                {!isExpanded && (
                    <div className="group cursor-pointer" onClick={() => setIsExpanded(true)}>
                        <div className="relative">
                            {/* Effet d'ombre portée */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-gray-700 rounded-2xl blur-md opacity-20 group-hover:opacity-30 transition-opacity"></div>

                            {/* Carte principale */}
                            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-3xl">
                                <div className="px-4 py-3">
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Avatar utilisateur */}
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`relative ${statusColor.bg} rounded-full p-2 ring-2 ${statusColor.ring}`}
                                            >
                                                {user?.avatar ? (
                                                    <img
                                                        src={`${
                                                            import.meta.env.VITE_API_BASE_URL_MEDIA
                                                        }/${user.avatar}`}
                                                        alt={user.name || 'User'}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                                        <span className="text-sm font-bold text-gray-800">
                                                            {getUserInitials()}
                                                        </span>
                                                    </div>
                                                )}
                                                {/* Point de statut */}
                                                <div
                                                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                                        currentStatus?.current_status ===
                                                        'in_progress'
                                                            ? 'bg-emerald-500'
                                                            : currentStatus?.current_status ===
                                                              'paused'
                                                            ? 'bg-amber-500'
                                                            : currentStatus?.current_status ===
                                                              'completed'
                                                            ? 'bg-blue-500'
                                                            : 'bg-gray-400'
                                                    }`}
                                                ></div>
                                            </div>

                                            {/* Informations utilisateur */}
                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                                                    {user?.name || 'Utilisateur'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {currentStatus?.current_status === 'in_progress'
                                                        ? 'En cours'
                                                        : currentStatus?.current_status === 'paused'
                                                        ? 'En pause'
                                                        : currentStatus?.current_status ===
                                                          'completed'
                                                        ? 'Terminé'
                                                        : 'Prêt'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Timer et statut */}
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-gray-900 tracking-tight">
                                                {formatTime(elapsedTime)}
                                            </div>
                                            <div className="flex items-center justify-end gap-1">
                                                <div className="text-xs font-medium text-gray-500">
                                                    {calculateProgress().toFixed(0)}%
                                                </div>
                                                <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    {currentStatus?.current_status === 'in_progress' && (
                                        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full transition-all duration-300"
                                                style={{ width: `${calculateProgress()}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Version étendue */}
                {isExpanded && (
                    <div className="relative">
                        {/* Overlay flou */}
                        <div
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                            onClick={() => setIsExpanded(false)}
                        />

                        {/* Carte étendue */}
                        <div className="relative bg-white rounded-2xl shadow-3xl border border-gray-200 w-96 overflow-hidden z-50 transform transition-all duration-300 animate-scale-in">
                            {/* Header avec gradient */}
                            <div
                                className={`${statusColor.bg} p-5 text-white relative overflow-hidden`}
                            >
                                {/* Effet de texture */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">Time Tracker</h3>
                                                <p className="text-sm opacity-90">
                                                    {new Date().toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsExpanded(false)}
                                            className="text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Timer principal */}
                                    <div className="text-center py-2">
                                        <div className="text-4xl font-bold mb-1 tracking-tighter">
                                            {formatTime(elapsedTime)}
                                        </div>
                                        <div className="flex items-center justify-center text-sm opacity-90 gap-1">
                                            <Target className="w-4 h-4" />
                                            <span>Objectif: {dailyTarget / 3600}h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5">
                                {/* Informations utilisateur */}
                                <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100">
                                    <div
                                        className={`relative ${statusColor.bg} rounded-full p-2 ring-2 ${statusColor.ring}`}
                                    >
                                        {user?.avatar ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL_MEDIA}/${
                                                    user.avatar
                                                }`}
                                                alt={user.name || 'User'}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                                <User className="w-6 h-6 text-gray-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 truncate">
                                            {user?.name || 'Utilisateur'}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user?.email || 'Non spécifié'}
                                        </div>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor.light} ${statusColor.text}`}
                                    >
                                        {currentStatus?.current_status === 'in_progress'
                                            ? '🟢 Actif'
                                            : currentStatus?.current_status === 'paused'
                                            ? '🟡 Pause'
                                            : currentStatus?.current_status === 'completed'
                                            ? '🔵 Terminé'
                                            : '⚪ Inactif'}
                                    </div>
                                </div>

                                {/* Progression */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Progression journalière</span>
                                        <span className="font-bold">
                                            {calculateProgress().toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${statusColor.bg}`}
                                            style={{ width: `${calculateProgress()}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {canStartDay && (
                                        <button
                                            onClick={startDay}
                                            disabled={isLoading}
                                            className="col-span-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                                        >
                                            <Play className="w-5 h-5" />
                                            <span>
                                                {currentStatus?.current_status === 'completed'
                                                    ? 'Nouvelle journée'
                                                    : 'Démarrer la journée'}
                                            </span>
                                        </button>
                                    )}

                                    {canPause && (
                                        <button
                                            onClick={pauseWork}
                                            disabled={isLoading}
                                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <Pause className="w-5 h-5" />
                                            Pause
                                        </button>
                                    )}

                                    {canEndDay && (
                                        <button
                                            onClick={endDay}
                                            disabled={isLoading}
                                            className={`${
                                                canPause ? '' : 'col-span-2'
                                            } bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                                        >
                                            <StopCircle className="w-5 h-5" />
                                            Terminer
                                        </button>
                                    )}

                                    {canResume && (
                                        <button
                                            onClick={resumeWork}
                                            disabled={isLoading}
                                            className="col-span-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <Play className="w-5 h-5" />
                                            Reprendre
                                        </button>
                                    )}
                                </div>

                                {/* Statistiques détaillées */}
                                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-100 p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Détails de la journée
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">
                                                Temps travaillé
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {(elapsedTime / 3600).toFixed(2)}h
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                <Coffee className="w-4 h-4" />
                                                Temps de pause
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {activeWorkTime?.pause_hours?.toFixed(2) || '0.00'}h
                                            </span>
                                        </div>
                                        {currentStatus?.current_status === 'paused' &&
                                            pauseStartTime && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">
                                                        Pause actuelle
                                                    </span>
                                                    <span className="font-semibold text-amber-600">
                                                        {formatTime(pauseDuration)}
                                                    </span>
                                                </div>
                                            )}
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-sm text-gray-600">
                                                Progression
                                            </span>
                                            <span className="font-bold text-emerald-600">
                                                {calculateProgress().toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Animation CSS pour scale-in */}
            <style jsx>{`
                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
};

export default FloatingTimer;
