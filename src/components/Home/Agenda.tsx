import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import useUpcomingTasks from '../../hooks/useUpcomingTasks';

const Agenda: React.FC = () => {
    const { tasksByDay, criticalTasks, statistics, period, loading, error, refresh } =
        useUpcomingTasks({
            limit: 10,
            daysAhead: 7,
        });

    // Fonction pour formater la date sans date-fns (solution de secours)
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
            };
            return date.toLocaleDateString('fr-FR', options);
        } catch {
            return dateString;
        }
    };

    const formatDaysUntil = (daysUntil: number): string => {
        const roundedDays = Math.round(daysUntil);

        if (roundedDays < 0) {
            return 'En retard';
        }

        if (roundedDays === 0) {
            return "Aujourd'hui";
        }

        if (roundedDays === 1) {
            return 'Demain';
        }

        return `Dans ${roundedDays} jours`;
    };

    // Fonction pour obtenir la couleur de priorité
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    // Fonction pour obtenir l'icône de statut
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'done':
                return <CheckCircle size={14} className="text-green-500" />;
            case 'doing':
                return <TrendingUp size={14} className="text-blue-500" />;
            default:
                return <div className="w-3 h-3 border-2 border-gray-400 rounded-full"></div>;
        }
    };

    // Calculer les statistiques avec des valeurs par défaut
    const scheduledCount = statistics.by_schedule_type?.scheduled || 0;
    const highPriorityCount = statistics.by_priority.high || 0;
    const totalTasks = statistics.total || 0;

    if (loading) {
        return (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                    <div className="space-y-3">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
                <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Erreur de chargement</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <button
                        onClick={refresh}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
            {/* Header avec titre et stats */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Agenda</h2>
                <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">
                        {totalTasks} tâche{totalTasks !== 1 ? 's' : ''}
                    </span>
                    {criticalTasks.length > 0 && (
                        <span className="flex items-center text-red-600">
                            <AlertCircle size={16} className="mr-1" />
                            {criticalTasks.length} urgentes
                        </span>
                    )}
                </div>
            </div>

            {/* Date header */}
            <div className="flex items-center space-x-2 mb-4">
                <Calendar size={18} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-900">
                    {formatDate(period.start_date)} - {formatDate(period.end_date)}
                </span>
            </div>

            {/* Liste des tâches par jour */}
            <div className="space-y-4">
                {tasksByDay.length === 0 ? (
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                            Aucune tâche à venir pour cette période
                        </p>
                    </div>
                ) : (
                    tasksByDay.map((day) => (
                        <div key={day.date} className="border border-gray-200 rounded-lg p-4">
                            {/* Header du jour */}
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                            day.is_today
                                                ? 'bg-blue-100 text-blue-700'
                                                : day.is_tomorrow
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {new Date(day.date).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">
                                            {day.day_name.charAt(0).toUpperCase() +
                                                day.day_name.slice(1)}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {day.count} tâche{day.count > 1 ? 's' : ''}
                                            {day.high_priority_count > 0 && (
                                                <span className="ml-2 text-red-600">
                                                    • {day.high_priority_count} haute priorité
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                        day.days_until === 0
                                            ? 'bg-red-100 text-red-700'
                                            : day.days_until === 1
                                            ? 'bg-orange-100 text-orange-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {day.days_until === 0
                                        ? "Aujourd'hui"
                                        : day.days_until === 1
                                        ? 'Demain'
                                        : `${formatDaysUntil(day.days_until)} jours`}
                                </span>
                            </div>

                            {/* Liste des tâches du jour */}
                            <div className="space-y-2">
                                {day.tasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`flex items-start p-3 rounded-lg border ${
                                            task.urgency === 'overdue' || task.urgency === 'urgent'
                                                ? 'border-red-200 bg-red-50'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        {/* Checkbox/Status */}
                                        <div className="flex-shrink-0 mt-1 mr-3">
                                            {getStatusIcon(task.status)}
                                        </div>

                                        {/* Contenu de la tâche */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {task.title}
                                                </h4>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority === 'high'
                                                        ? 'Haute'
                                                        : task.priority === 'medium'
                                                        ? 'Moyenne'
                                                        : 'Basse'}
                                                </span>
                                            </div>

                                            <p className="text-xs text-gray-600 mt-1 truncate">
                                                {task.description || 'Pas de description'}
                                            </p>

                                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                                                {/* Projet */}
                                                {task.project && (
                                                    <span className="flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                                                        {task.project.name}
                                                    </span>
                                                )}

                                                {/* Date */}
                                                <span className="flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    {task.date_type === 'start_date'
                                                        ? 'Début'
                                                        : 'Échéance'}
                                                    :{' '}
                                                    {task.reference_date ||
                                                        task.start_date ||
                                                        task.due_date}
                                                </span>

                                                {/* Temps */}
                                                {task.estimated_time && (
                                                    <span className="flex items-center">
                                                        <Clock size={12} className="mr-1" />
                                                        {Math.round(task.estimated_time / 60)}h
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Statistiques rapides */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-lg font-semibold text-gray-900">{totalTasks}</div>
                        <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-red-600">
                            {highPriorityCount}
                        </div>
                        <div className="text-xs text-gray-500">Haute priorité</div>
                    </div>
                    <div>
                        <div className="text-lg font-semibold text-blue-600">{scheduledCount}</div>
                        <div className="text-xs text-gray-500">Planifiées</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Agenda;
