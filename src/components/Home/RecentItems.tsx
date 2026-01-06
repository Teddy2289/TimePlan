// src/components/Home/RecentItems.tsx
import React from 'react';
import { useRecentTasks } from '../../hooks/useRecentTasks';
import { type RecentTask, type GroupedTaskDay } from '../../types';

const RecentItems: React.FC = () => {
    const { data, loading, error, refetch } = useRecentTasks({
        limit: 8,
        days: 7,
    });

    // Fonctions utilitaires
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'todo':
                return 'bg-yellow-100 text-yellow-800';
            case 'doing':
                return 'bg-blue-100 text-blue-800';
            case 'done':
                return 'bg-green-100 text-green-800';
            case 'backlog':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'todo':
                return 'À faire';
            case 'doing':
                return 'En cours';
            case 'done':
                return 'Terminé';
            case 'backlog':
                return 'Backlog';
            default:
                return status;
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Haute
                    </span>
                );
            case 'medium':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Moyenne
                    </span>
                );
            case 'low':
                return (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Basse
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatDayName = (day: GroupedTaskDay) => {
        if (day.is_today) return "Aujourd'hui";
        if (day.is_yesterday) return 'Hier';
        return day.day_name.charAt(0).toUpperCase() + day.day_name.slice(1);
    };

    // État de chargement
    if (loading) {
        return (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Récent</h2>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-12 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
            </section>
        );
    }

    // État d'erreur
    if (error) {
        return (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Récent</h2>
                <div className="text-center text-red-500 py-4">
                    <p>{error}</p>
                    <button
                        onClick={refetch}
                        className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </section>
        );
    }

    // Pas de données
    if (!data || data.tasks.length === 0) {
        return (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Récent</h2>
                <div className="text-center text-gray-500 py-8">
                    <svg
                        className="w-12 h-12 mx-auto mb-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    <p>Aucune tâche récente</p>
                    <button
                        onClick={refetch}
                        className="mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Actualiser
                    </button>
                </div>
            </section>
        );
    }

    // Affichage normal avec données
    const { tasks, grouped_tasks, total, period, user_role } = data;

    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Récent</h2>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                        {total} tâche{total > 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={refetch}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Actualiser"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Liste des tâches */}
            <ul className="space-y-3">
                {tasks.map((task: RecentTask) => (
                    <li
                        key={task.id}
                        className="flex flex-col p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                    >
                        {/* En-tête de la tâche */}
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-gray-900 text-sm font-medium truncate">
                                        {task.title}
                                    </h3>
                                    {getPriorityIcon(task.priority)}
                                </div>

                                {/* Métadonnées */}
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    {task.project && (
                                        <span className="flex items-center">
                                            <svg
                                                className="w-3 h-3 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                />
                                            </svg>
                                            {task.project.name}
                                        </span>
                                    )}

                                    {task.due_date && (
                                        <span
                                            className={`flex items-center ${
                                                task.is_overdue ? 'text-red-500' : ''
                                            }`}
                                        >
                                            <svg
                                                className="w-3 h-3 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {formatDate(task.due_date)}
                                            {task.is_overdue && (
                                                <span className="ml-1 px-1 py-0.5 text-xs bg-red-100 text-red-800 rounded">
                                                    En retard
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Statut et progression */}
                            <div className="flex flex-col items-end space-y-1">
                                <span
                                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                                        task.status
                                    )}`}
                                >
                                    {getStatusLabel(task.status)}
                                </span>

                                {task.progress > 0 && task.progress < 100 && (
                                    <div className="w-16">
                                        <div className="text-xs text-gray-500 text-right mb-1">
                                            {task.progress}%
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                            <div
                                                className="bg-primary h-1 rounded-full"
                                                style={{ width: `${task.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assigné et dernière mise à jour */}
                        {task.assigned_user && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                                <div className="flex items-center">
                                    {task.assigned_user.avatar ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_BASE_URL_MEDIA}/${
                                                task.assigned_user.avatar
                                            }`}
                                            alt={task.assigned_user.name}
                                            className="w-6 h-6 rounded-full mr-2"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs mr-2">
                                            {task.assigned_user.initials}
                                        </div>
                                    )}
                                    <span className="text-xs text-gray-600">
                                        {task.assigned_user.name}
                                    </span>
                                </div>

                                <span className="text-xs text-gray-400">
                                    {task.time_since_update}
                                </span>
                            </div>
                        )}

                        {/* Changements récents */}
                        {task.changes && task.changes.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                <div className="flex flex-wrap gap-1">
                                    {task.changes.map((change, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded"
                                        >
                                            {change}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Activité regroupée par jour */}
            {grouped_tasks && grouped_tasks.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Activité par jour</h3>
                    <div className="space-y-2">
                        {grouped_tasks.slice(0, 3).map((day: GroupedTaskDay) => (
                            <div
                                key={day.date}
                                className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-900">
                                        {formatDayName(day)}
                                    </span>
                                    {!day.is_today && !day.is_yesterday && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            {formatDate(day.date)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xs text-gray-500">
                                        {day.tasks_count} tâche{day.tasks_count > 1 ? 's' : ''}
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        ))}

                        {grouped_tasks.length > 3 && (
                            <div className="text-center">
                                <button className="text-xs text-primary hover:text-primary-dark">
                                    Voir les {grouped_tasks.length - 3} jours supplémentaires
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Informations sur la période */}
            <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                    <p>
                        Affichage des {period.days} derniers jours ({formatDate(period.start_date)}{' '}
                        - {formatDate(period.end_date)})
                    </p>
                    <p className="mt-1">
                        Rôle : {user_role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default RecentItems;
