import { useState, useEffect } from "react";
import type { Task, StatusColumn, AppState } from "../types";

// Données initiales
const initialColumns: StatusColumn[] = [
  { id: "en-attente", title: "En attente", color: "bg-slate-500" },
  { id: "ouvert", title: "Ouvert", color: "bg-blue-500" },
  { id: "en-cours", title: "En cours", color: "bg-amber-500" },
  { id: "a-valider", title: "À valider", color: "bg-orange-500" },
  { id: "termine", title: "Terminer", color: "bg-emerald-500" },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Responsive menu stagaire",
    description: "📌",
    status: "a-valider",
    priority: "normale",
    tags: ["responsive", "menu"],
    subtasks: [],
    comments: 0,
    attachments: 0,
    assignee: "JD",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    title: "Gestion des contacts : commercial et pole relation client",
    description: "",
    status: "a-valider",
    priority: "normale",
    tags: ["contacts", "commercial"],
    subtasks: [],
    comments: 1,
    attachments: 0,
    assignee: "MB",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    title: "Gestion des contacts : formateur",
    description: "",
    status: "a-valider",
    priority: "normale",
    tags: ["contacts", "formateur"],
    subtasks: [],
    comments: 1,
    attachments: 0,
    assignee: "AL",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    title: "Gestion des quiz : création quiz",
    description: "",
    status: "a-valider",
    priority: "normale",
    tags: ["quiz", "création"],
    subtasks: [
      {
        id: "4-1",
        title: "Créer interface quiz",
        completed: false,
      },
    ],
    comments: 1,
    attachments: 0,
    assignee: "TP",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    title: "Quiz stagiaires",
    description: "",
    status: "a-valider",
    priority: "normale",
    tags: ["quiz", "stagiaires"],
    subtasks: [],
    comments: 0,
    attachments: 0,
    assignee: "RG",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    title: "Page d'accueil - Stagiaire",
    description: "",
    status: "a-valider",
    priority: "normale",
    tags: ["accueil", "stagiaire"],
    subtasks: [],
    comments: 0,
    attachments: 0,
    assignee: "KL",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<StatusColumn[]>(initialColumns);

  // Charger depuis le localStorage au montage
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedState = localStorage.getItem("taskManagerState");
        if (savedState) {
          const parsedState: AppState = JSON.parse(savedState);
          const tasksToUpdate = parsedState.tasks.map((task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
          setTasks((prevTasks) => [...prevTasks, ...tasksToUpdate]);
        } else {
          setTasks(initialTasks);
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        setTasks(initialTasks);
      }
    };

    loadTasks();
  }, []);

  // Sauvegarder dans le localStorage à chaque changement
  useEffect(() => {
    const state: AppState = { tasks, columns };
    localStorage.setItem("taskManagerState", JSON.stringify(state));
  }, [tasks, columns]);

  // Mettre à jour le statut d'une tâche (drag & drop)
  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              updatedAt: new Date(),
            }
          : task
      )
    );
  };

  // Déplacer une tâche (réorganisation dans la même colonne)
  const moveTask = (
    taskId: string,
    newIndex: number,
    status: Task["status"]
  ) => {
    setTasks((prevTasks) => {
      const tasksInStatus = prevTasks.filter((task) => task.status === status);
      const otherTasks = prevTasks.filter((task) => task.status !== status);

      const taskToMove = tasksInStatus.find((task) => task.id === taskId);
      if (!taskToMove) return prevTasks;

      const filteredTasks = tasksInStatus.filter((task) => task.id !== taskId);
      const newTasksInStatus = [
        ...filteredTasks.slice(0, newIndex),
        taskToMove,
        ...filteredTasks.slice(newIndex),
      ];

      return [...otherTasks, ...newTasksInStatus];
    });
  };

  // Ajouter une nouvelle tâche
  const addTask = (title: string, status: Task["status"] = "en-attente") => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description: "",
      status,
      priority: "normale",
      tags: [],
      subtasks: [],
      comments: 0,
      attachments: 0,
      assignee: "US", // Utilisateur par défaut
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  // Mettre à jour une tâche
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  // Supprimer une tâche
  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  // Obtenir les tâches par statut
  const getTasksByStatus = (status: Task["status"]) => {
    return tasks.filter((task) => task.status === status);
  };

  return {
    tasks,
    columns,
    updateTaskStatus,
    moveTask,
    addTask,
    updateTask,
    deleteTask,
    getTasksByStatus,
  };
};
