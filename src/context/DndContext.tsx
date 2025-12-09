// src/context/DndContext.tsx - CORRIGÉ
import React, { createContext, useContext, useState, useEffect } from "react";
import type { Task, ViewType } from "../types";

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
  updateTask: (taskId: number, updates: Partial<Task>) => void; // Changé string -> number
}

const DndContext = createContext<DndContextType | undefined>(undefined);

interface DndProviderProps {
  children: React.ReactNode;
  initialTasks?: Task[];
}

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  initialTasks = [],
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("tableau");

  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks);
    }
  }, [initialTasks]);

  const moveTask = (taskId: number, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, updatedAt: new Date() }
          : task
      )
    );
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
