// src/context/DndContext.tsx - CORRIGÉ
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task, ViewType } from "../types";
import taskService from "../services/taskService";

interface DndContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: number, newStatus: Task["status"]) => void; // Changé string -> number
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isTaskViewOpen: boolean;
  setIsTaskViewOpen: (open: boolean) => void;
  handleTaskClick: (task: Task) => void;
  handleCloseTaskView: () => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  addTask: (title: string, status: Task["status"]) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  isCreateTaskModalOpen: boolean;
  setIsCreateTaskModalOpen: (open: boolean) => void;
  openCreateTaskModal: (status?: Task["status"]) => void;
  selectedTaskForDetails: Task | null;
  isTaskDetailsModalOpen: boolean;
  openTaskDetails: (task: Task) => void;
  closeTaskDetails: () => void;
}

const DndContext = createContext<DndContextType | undefined>(undefined);

interface DndProviderProps {
  children: React.ReactNode;
  initialTasks?: Task[];
}

const convertUiStatusToApiStatus = (uiStatus: string): Task["status"] => {
  switch (uiStatus) {
    case "en-attente":
      return "backlog";
    case "ouvert":
      return "todo";
    case "en-cours":
      return "doing";
    case "a-valider":
      return "doing"; // ou "todo" selon votre logique
    case "termine":
      return "done";
    default:
      return "backlog";
  }
};

// Fonction pour convertir les statuts API vers UI
const convertApiStatusToUiStatus = (apiStatus: string): string => {
  switch (apiStatus) {
    case "backlog":
      return "en-attente";
    case "todo":
      return "ouvert";
    case "doing":
      return "en-cours";
    case "done":
      return "termine";
    default:
      return "en-attente";
  }
};

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  initialTasks = [],
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("tableau");
  const [selectedTaskForDetails, setSelectedTaskForDetails] =
    useState<Task | null>(null);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [createTaskModalStatus, setCreateTaskModalStatus] = useState<
    Task["status"] | null
  >(null);

  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

const moveTask = async (taskId: number, newStatus: string) => {
  try {
    // Convertir le statut UI en statut API
    const apiStatus = convertUiStatusToApiStatus(newStatus);
    
    // Mettre à jour localement immédiatement pour un feedback visuel
    const updatedTasks = tasks.map((task) =>
      task.id === taskId
        ? { 
            ...task, 
            status: newStatus, // Garder le statut UI pour l'affichage
            updated_at: new Date().toISOString()
          }
        : task
    );

    setTasks(updatedTasks);

    // Mettre à jour via l'API
    await taskService.updateTaskStatus(taskId, apiStatus);
    
    console.log(`Tâque ${taskId} déplacée vers ${newStatus} (${apiStatus})`);
    
  } catch (error) {
    console.error(`Erreur lors du déplacement de la tâche ${taskId}:`, error);
    
    // Revenir à l'état précédent en cas d'erreur
    // Vous pourriez vouloir ajouter une logique de rollback ici
  }
};

  const updateTask = (taskId: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const addTask = (title: string, status: Task["status"] = "en-attente") => {
    const newTask: Task = {
      id: Date.now(), // Garder comme number
      title,
      description: "",
      status,
      priority: "normale",
      tags: [],
      subtasks: [],
      comments: 0,
      attachments: 0,
      assignee: undefined,
      project_id: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskViewOpen(true);
  };

  const handleCloseTaskView = () => {
    setIsTaskViewOpen(false);
    setSelectedTask(null);
  };

  const openCreateTaskModal = (status: Task["status"] = "en-attente") => {
    setCreateTaskModalStatus(status);
    setIsCreateTaskModalOpen(true);
  };

  // Dans votre DndContext
  const updateTaskInContext = (taskId: number, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );

    // Mettre à jour aussi la tâche sélectionnée
    if (selectedTask?.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTaskForDetails(task);
    setIsTaskDetailsModalOpen(true);
  };

  const closeTaskDetails = () => {
    setIsTaskDetailsModalOpen(false);
    setSelectedTaskForDetails(null);
  };

  const value = {
    tasks,
    setTasks,
    moveTask,
    updateTask,
    selectedTask,
    setSelectedTask,
    isTaskViewOpen,
    setIsTaskViewOpen,
    handleTaskClick,
    handleCloseTaskView,
    activeTask,
    setActiveTask,
    addTask,
    currentView,
    setCurrentView,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    openCreateTaskModal,
    updateTaskInContext,
    selectedTaskForDetails,
    isTaskDetailsModalOpen,
    openTaskDetails,
    closeTaskDetails,
  };

  return <DndContext.Provider value={value}>{children}</DndContext.Provider>;
};

export const useDnd = () => {
  const context = useContext(DndContext);
  if (context === undefined) {
    throw new Error("useDnd must be used within a DndProvider");
  }
  return context;
};
