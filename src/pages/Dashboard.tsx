import React, { useState, useCallback, useEffect } from "react";
import DndContainer from "../components/tasks/DndContainer";

import { DndProvider } from "../context/DndContext";
import { useTasks } from "../hooks/useTasks";
import { type Task } from "../types";
import { Loader, AlertCircle } from "lucide-react";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import DashboardStats from "../components/Dashboard/DashboardStats";
import MainLayout from "../components/layout/MainLayout";

const Dashboard: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"board" | "list" | "calendar">(
    "board"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const { tasks, loading, error, updateTask, refetchTasks } = useTasks();

  // Filtrage des tâches basé sur la recherche
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
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
        console.error("Erreur lors de la mise à jour de la tâche:", error);
      }
    },
    [updateTask]
  );

  const handleTaskCreate = useCallback(() => {
    // Ouvrir une vue de tâche vide pour création
    const newTask: Task = {
      id: `temp-${Date.now()}`,
      title: "",
      description: "",
      status: "en-attente",
      priority: "normale",
      dueDate: undefined,
      tags: [],
      assignee: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      subtasks: [],
      comments: 0,
      attachments: 0
    };
    setSelectedTask(newTask);
    setIsTaskViewOpen(true);
  }, []);

  // Rafraîchissement automatique des données
  useEffect(() => {
    const interval = setInterval(() => {
      refetchTasks();
    }, 30000); // Rafraîchissement toutes les 30 secondes

    return () => clearInterval(interval);
  }, [refetchTasks]);

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        // Focus sur la barre de recherche
        const searchInput = document.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement;
        searchInput?.focus();
      }
      if (e.key === "Escape" && isTaskViewOpen) {
        handleCloseTaskView();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isTaskViewOpen, handleCloseTaskView]);

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6 overflow-auto flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Erreur de chargement
          </h3>
          <p className="mt-2 text-xs text-gray-500">
            Impossible de charger les tâches. Veuillez réessayer.
          </p>
          <button
            onClick={refetchTasks}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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
          {/* En-tête du dashboard */}
          <DashboardHeader
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTaskCreate={handleTaskCreate}
            taskCount={filteredTasks.length}
          />

          {/* Statistiques rapides */}
          <DashboardStats tasks={filteredTasks} />

          {/* Contenu principal */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">
                  Chargement des tâches...
                </span>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "Aucune tâche trouvée" : "Aucune tâche"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? "Essayez de modifier vos termes de recherche."
                    : "Commencez par créer votre première tâche."}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleTaskCreate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Créer une tâche
                  </button>
                )}
              </div>
            ) : (
              <DndContainer
                tasks={filteredTasks}
                onTaskClick={handleTaskClick}
                viewMode={viewMode}
              />
            )}
          </div>

          {/* Modal de visualisation/édition de tâche */}
          
        </div>
      </DndProvider>
    </MainLayout>
  );
};

export default Dashboard;
