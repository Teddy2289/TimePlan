import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useTasksList } from '../hooks/useTasksList';

export default function Projects() {
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const {
        data: tasksData,
        loading,
        error,
        params,
        updateParams,
        goToPage,
        clearFilters,
    } = useTasksList({
        per_page: 10, // Changer selon vos besoins
    });

    const handleSearch = () => {
        updateParams({
            search: searchTerm || undefined,
            status: statusFilter || undefined,
            priority: priorityFilter || undefined,
        });
    };

    const handleClearFilters = () => {
        setStatusFilter('');
        setPriorityFilter('');
        setSearchTerm('');
        clearFilters();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done':
                return 'bg-green-100 text-green-800';
            case 'doing':
                return 'bg-blue-100 text-blue-800';
            case 'todo':
                return 'bg-yellow-100 text-yellow-800';
            case 'backlog':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟡';
            case 'low':
                return '🟢';
            default:
                return '⚑';
        }
    };

    // Fonction pour formater la date
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    // Calculer le pourcentage de progression
    const calculateProgress = (task: any) => {
        if (task.status === 'done') return 100;
        return task.progress;
    };

    return (
        <MainLayout>
            <div className="p-6 space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
                    <p className="text-gray-600 mt-1">Gestion des projets</p>
                </div>

                {/* Filtres */}
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Barre de recherche */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Rechercher
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Rechercher une tâche..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>

                        {/* Filtre par statut */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Statut
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="backlog">Backlog</option>
                                <option value="todo">À faire</option>
                                <option value="doing">En cours</option>
                                <option value="done">Terminé</option>
                            </select>
                        </div>

                        {/* Filtre par priorité */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Priorité
                            </label>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                            >
                                <option value="">Toutes les priorités</option>
                                <option value="low">Basse</option>
                                <option value="medium">Moyenne</option>
                                <option value="high">Haute</option>
                            </select>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex items-end space-x-2">
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-[#ab2283] hover:bg-[#92216f] text-white text-xs rounded-lg shadow"
                            >
                                Appliquer les filtres
                            </button>
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-50"
                            >
                                Réinitialiser
                            </button>
                        </div>
                    </div>

                    {/* Statistiques */}
                    {tasksData && (
                        <div className="text-xs text-gray-600">
                            {tasksData.pagination.total} tâches trouvées
                        </div>
                    )}
                </div>

                {/* Tableau des tâches */}
                <div className="border border-gray-200 shadow-sm rounded-xl bg-white">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Liste des tâches et des projets
                        </h2>
                    </div>

                    {loading && (
                        <div className="p-8 text-center">
                            <div className="text-gray-500">Chargement des tâches...</div>
                        </div>
                    )}

                    {error && (
                        <div className="p-8 text-center">
                            <div className="text-red-500">Erreur: {error}</div>
                        </div>
                    )}

                    {!loading && !error && tasksData && (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tâche
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Statut
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Projet
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Assigné à
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Priorité
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Progression
                                            </th>
                                            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date d'échéance
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {tasksData.tasks.map((task) => (
                                            <tr
                                                key={task.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900 text-xs">
                                                            {task.title}
                                                        </span>
                                                        {task.description && (
                                                            <span className="text-gray-500 text-xs truncate max-w-xs">
                                                                {task.description}
                                                            </span>
                                                        )}
                                                        {task.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {task.tags.map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            task.status
                                                        )}`}
                                                    >
                                                        {task.status === 'backlog' && 'Backlog'}
                                                        {task.status === 'todo' && 'À faire'}
                                                        {task.status === 'doing' && 'En cours'}
                                                        {task.status === 'done' && 'Terminé'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs text-gray-900">
                                                        {task.project.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {task.project.team_name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center space-x-2">
                                                        {task.assigned_user.avatar ? (
                                                            <img
                                                                src={`${
                                                                    import.meta.env
                                                                        .VITE_API_BASE_URL_MEDIA
                                                                }/${task.assigned_user.avatar}`}
                                                                alt={task.assigned_user.name}
                                                                className="w-6 h-6 rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                                {task.assigned_user.initials}
                                                            </div>
                                                        )}
                                                        <span className="text-xs text-gray-900">
                                                            {task.assigned_user.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-lg">
                                                            {getPriorityIcon(task.priority)}
                                                        </span>
                                                        <span className="text-xs capitalize">
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-32">
                                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-blue-500 transition-all"
                                                                    style={{
                                                                        width: `${calculateProgress(
                                                                            task
                                                                        )}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-600">
                                                            {calculateProgress(task)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs">
                                                        {task.is_overdue ? (
                                                            <span className="text-red-600 font-medium">
                                                                En retard
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-900">
                                                                {formatDate(task.due_date)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {tasksData.pagination.last_page > 1 && (
                                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-xs text-gray-700">
                                        Affichage de{' '}
                                        <span className="font-medium">
                                            {tasksData.pagination.from}
                                        </span>{' '}
                                        à{' '}
                                        <span className="font-medium">
                                            {tasksData.pagination.to}
                                        </span>{' '}
                                        sur{' '}
                                        <span className="font-medium">
                                            {tasksData.pagination.total}
                                        </span>{' '}
                                        résultats
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => goToPage(params.page! - 1)}
                                            disabled={params.page === 1}
                                            className={`px-3 py-1 border rounded-lg text-xs ${
                                                params.page === 1
                                                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Précédent
                                        </button>
                                        <div className="flex items-center space-x-1">
                                            {Array.from(
                                                {
                                                    length: Math.min(
                                                        5,
                                                        tasksData.pagination.last_page
                                                    ),
                                                },
                                                (_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => goToPage(pageNum)}
                                                            className={`px-3 py-1 rounded-lg text-xs ${
                                                                params.page === pageNum
                                                                    ? 'bg-[#ab2283] text-white'
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                        <button
                                            onClick={() => goToPage(params.page! + 1)}
                                            disabled={
                                                params.page === tasksData.pagination.last_page
                                            }
                                            className={`px-3 py-1 border rounded-lg text-xs ${
                                                params.page === tasksData.pagination.last_page
                                                    ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            Suivant
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
