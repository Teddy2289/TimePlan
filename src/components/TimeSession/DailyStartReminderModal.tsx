import React, { useEffect, useState } from 'react';
import { Sun, Clock, Coffee, Calendar, Target, X, Play, Bell } from 'lucide-react';
import { useWorkTime } from '../../context/WorkTimeContext';

interface DailyStartReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartDay: () => void;
}

const DailyStartReminderModal: React.FC<DailyStartReminderModalProps> = ({
    isOpen,
    onClose,
    onStartDay,
}) => {
    const { currentStatus } = useWorkTime();
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Gérer le compte à rebours pour fermeture automatique
    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            setShowCountdown(true);
        }, 5000); // Afficher le compte à rebours après 5 secondes

        return () => clearTimeout(timer);
    }, [isOpen]);

    // Gérer le compte à rebours
    useEffect(() => {
        if (!showCountdown || !isOpen) return;

        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [showCountdown, isOpen, onClose]);

    // Obtenir l'heure actuelle
    const getCurrentHour = (): number => {
        return new Date().getHours();
    };

    // Message personnalisé selon l'heure
    const getGreetingMessage = (): string => {
        const hour = getCurrentHour();

        if (hour < 12) return 'Bonjour ! Prêt pour une nouvelle journée ?';
        if (hour < 14) return 'Bon midi ! Avez-vous démarré votre journée ?';
        if (hour < 18) return "Bon après-midi ! N'oubliez pas de démarrer votre journée.";
        return "Bonsoir ! Avez-vous suivi votre temps aujourd'hui ?";
    };

    // Conseils selon l'heure
    const getTimeTip = (): string => {
        const hour = getCurrentHour();

        if (hour < 10) return 'Le meilleur moment pour commencer votre journée !';
        if (hour < 12) return 'Il est encore temps de bien commencer votre journée.';
        if (hour < 15) return 'Le déjeuner approche, pensez à démarrer votre journée.';
        if (hour < 18) return 'La journée avance, assurez-vous de tracker votre temps.';
        return "Avant de terminer votre journée, n'oubliez pas de tracker votre temps.";
    };

    // Obtenir la durée recommandée selon le jour
    const getRecommendedDuration = (): string => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        if (dayOfWeek === 0) return "C'est dimanche, jour de repos !";
        if (dayOfWeek === 6) return 'Objectif du samedi : 4 heures';
        return 'Objectif quotidien : 8 heures';
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-blue-100">
                {/* Header avec gradient */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white relative overflow-hidden">
                    {/* Effet de vague */}
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/10 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Sun className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">Démarrez votre journée</h2>
                                    <p className="text-sm opacity-90">{getGreetingMessage()}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Colonne gauche - Informations */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Aujourd'hui</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date().toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <Target className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Objectif du jour</p>
                                    <p className="font-semibold text-gray-900">
                                        {getRecommendedDuration()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-600">Heure actuelle</p>
                                    <p className="font-semibold text-gray-900">
                                        {new Date().toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Colonne droite - Statistiques */}
                        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-4 border border-blue-200">
                            <h3 className="font-semibold text-gray-900 mb-3">
                                Pourquoi démarrer maintenant ?
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>Suivi précis de votre temps de travail</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>Calcul automatique des heures travaillées</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>Visualisation de votre progression quotidienne</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></div>
                                    <span>Rapports détaillés pour votre gestion de temps</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Conseil personnalisé */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                        <div className="flex items-center space-x-2 mb-2">
                            <Bell className="w-5 h-5 text-yellow-600" />
                            <h4 className="font-semibold text-yellow-800">Conseil du moment</h4>
                        </div>
                        <p className="text-yellow-700">{getTimeTip()}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={onStartDay}
                            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-3"
                        >
                            <Play className="w-6 h-6" />
                            <span className="text-lg">Démarrer ma journée maintenant</span>
                        </button>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                            >
                                Me le rappeler plus tard
                            </button>

                            {showCountdown && (
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <span>Ferme automatiquement dans</span>
                                    <div className="bg-gray-100 px-2 py-1 rounded font-mono font-bold">
                                        {countdown}s
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DailyStartReminderModal;
