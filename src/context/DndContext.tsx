import React, { createContext, useContext, useState } from "react";
import type { Task } from "../types";

interface DndContextType {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  moveTask: (taskId: string, newStatus: Task["status"]) => void;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  isTaskViewOpen: boolean;
  setIsTaskViewOpen: (open: boolean) => void;
  handleTaskClick: (task: Task) => void;
  handleCloseTaskView: () => void;
}

const DndContext = createContext<DndContextType | undefined>(undefined);

export const DndProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Régions en quêt",
      description: "",
      status: "en-attente",
      priority: "normale",
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Rapporter menu stagiaire",
      description: "",
      status: "en-cours",
      priority: "normale",
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Gestion des contacts : commercial et polie relation client",
      description: "",
      status: "en-cours",
      priority: "normale",
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "8",
      title: "Gestion des comptes stagiaires",
      description: "",
      status: "a-valider",
      priority: "urgente",
      dueDate: new Date("2024-03-05"),
      tags: [],
      subtasks: [{ id: "8-1", title: "Sous-tâche", completed: false }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "10",
      title: "Charte graphique",
      description: "",
      status: "termine",
      priority: "normale",
      dueDate: new Date("2024-01-11"),
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);

  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
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
    selectedTask,
    setSelectedTask,
    isTaskViewOpen,
    setIsTaskViewOpen,
    handleTaskClick,
    handleCloseTaskView,
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
