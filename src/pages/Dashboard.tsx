import React, { useState, useCallback, useEffect } from 'react';
import DndContainer from '../components/tasks/DndContainer';
import { DndProvider } from '../context/DndContext';
import { useTasks } from '../hooks/useTasks';
import { type Task } from '../types';
import { Loader, AlertCircle, Search } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import DashboardStats from '../components/Dashboard/DashboardStats';

const Dashboard: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'board' | 'list' | 'calendar'>('board');
    const [searchQuery, setSearchQuery] = useState('');

    const { tasks, loading, error, updateTask, refetchTasks } = useTasks();

    // Filtrage des tâches basé sur la recherche
    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleTaskClick = useCallback((task: Task) => {
        setSelectedTask(task);
        setIsTaskViewOpen(true);
    }, []);

    const handleCloseTaskView = useCallback(() => {
        setIsTaskViewOpen(false);
        setSelectedTask(null);
    }, []);

    const handleTaskUpdate = useCallback(
        async (updatedTask: Task) => {
            try {
                await updateTask(updatedTask);
                setSelectedTask(updatedTask);
            } catch (error) {
                console.error('Erreur lors de la mise à jour de la tâche:', error);
            }
        },
        [updateTask]
    );

    // Rafraîchissement automatique des données
    useEffect(() => {
        const interval = setInterval(() => {
            refetchTasks();
        }, 30000);

        return () => clearInterval(interval);
    }, [refetchTasks]);

    // Gestion des raccourcis clavier
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector(
                    'input[type="search"]'
                ) as HTMLInputElement;
                searchInput?.focus();
            }
            if (e.key === 'Escape' && isTaskViewOpen) {
                handleCloseTaskView();
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isTaskViewOpen, handleCloseTaskView]);

    if (error) {
        return (
            <div className="flex-1 bg-gray-50 p-4 overflow-auto flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="mx-auto h-10 w-10 text-red-500" />
                    <h3 className="mt-3 text-base font-medium text-gray-900">
                        Erreur de chargement
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Impossible de charger les tâches. Veuillez réessayer.
                    </p>
                    <button
                        onClick={refetchTasks}
                        className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded border border-transparent text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <MainLayout>
            <DndProvider>
                <div className="flex-1 bg-gray-50 overflow-auto">
                    {/* En-tête compact */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">
                                    Tableau de bord
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {filteredTasks.length} tâche
                                    {filteredTasks.length !== 1 ? 's' : ''} • {tasks.length} total
                                </p>
                            </div>
                        </div>

                        {/* Barre de recherche et contrôles */}
                        <div className="flex items-center space-x-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher des tâches..."
                                    className="w-full pl-10 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                                    Ctrl+K
                                </div>
                            </div>

                            {/* Sélecteur de vue */}
                            <div className="flex items-center bg-gray-100 rounded-md p-0.5">
                                {(['board', 'list', 'calendar'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`px-2.5 py-1 text-xs font-medium rounded ${
                                            viewMode === mode
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {mode === 'board' && 'Tableau'}
                                        {mode === 'list' && 'Liste'}
                                        {mode === 'calendar' && 'Calendrier'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Statistiques compactes */}
                    <div className="px-4 pt-4">
                        <DashboardStats timeframe="month" />
                    </div>

                    {/* Contenu principal */}
                    <div className="p-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-48">
                                <Loader className="h-6 w-6 animate-spin text-blue-600" />
                                <span className="ml-2 text-sm text-gray-600">
                                    Chargement des tâches...
                                </span>
                            </div>
                        ) : filteredTasks.length === 0 ? (
                            <span></span>
                        ) : (
                            <DndContainer
                                tasks={filteredTasks}
                                onTaskClick={handleTaskClick}
                                viewMode={viewMode}
                            />
                        )}
                    </div>
                </div>
            </DndProvider>
        </MainLayout>
    );
};

export default Dashboard;
