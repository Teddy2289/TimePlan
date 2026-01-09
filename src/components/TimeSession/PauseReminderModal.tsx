// src/components/PauseReminderModal.tsx
import React, { useEffect, useState } from 'react';
import { Clock, Coffee, Bell, X, Play } from 'lucide-react';
import { useWorkTime } from '../../context/WorkTimeContext';

interface PauseReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onResume: () => void;
    pauseDuration: number; // en secondes
}

const PauseReminderModal: React.FC<PauseReminderModalProps> = ({
    isOpen,
    onClose,
    onResume,
    pauseDuration,
}) => {
    const [timeSincePause, setTimeSincePause] = useState(pauseDuration);

    // Mettre à jour le temps écoulé
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setTimeSincePause((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        }
        return `${secs}s`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Bell className="w-8 h-8" />
                            <div>
                                <h2 className="text-xl font-bold">Rappel de pause</h2>
                                <p className="text-sm opacity-90">Vous êtes toujours en pause</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Coffee className="w-12 h-12 text-yellow-600" />
                            </div>
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                                {formatTime(timeSincePause)}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 text-center">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Votre pause dure depuis {formatTime(timeSincePause)}
                        </h3>
                        <p className="text-gray-600">
                            N'oubliez pas de reprendre votre travail lorsque vous êtes prêt.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                <span>
                                    Ce rappel réapparaîtra toutes les minutes jusqu'à ce que vous
                                    repreniez le travail.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                        >
                            Ignorer
                        </button>
                        <button
                            onClick={onResume}
                            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-md transition-all flex items-center justify-center"
                        >
                            <Play className="w-5 h-5 mr-2" />
                            Reprendre
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PauseReminderModal;
