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
const additionalMockTasks: Task[] = [
  // Tâches pour "en-attente"
  {
    id: "7",
    title: "Réunion de planification sprint",
    description: "Préparer l'ordre du jour pour le sprint suivant",
    status: "en-attente",
    priority: "normale",
    tags: ["réunion", "planification"],
    subtasks: [],
    comments: 2,
    attachments: 1,
    assignee: "MB",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "8",
    title: "Refactorisation du module d'authentification",
    description: "Optimiser les performances et la sécurité",
    status: "en-attente",
    priority: "elevee",
    tags: ["refactor", "sécurité"],
    subtasks: [
      {
        id: "8-1",
        title: "Analyser le code existant",
        completed: true,
      },
      {
        id: "8-2",
        title: "Identifier les points d'amélioration",
        completed: false,
      },
    ],
    comments: 5,
    attachments: 3,
    assignee: "AL",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-14"),
  },

  // Tâches pour "ouvert"
  {
    id: "9",
    title: "Design system - Composants base",
    description: "Créer les composants fondamentaux du design system",
    status: "ouvert",
    priority: "normale",
    tags: ["design", "composants"],
    subtasks: [],
    comments: 3,
    attachments: 2,
    assignee: "RG",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "10",
    title: "API - Endpoints utilisateurs",
    description:
      "Développer les endpoints CRUD pour la gestion des utilisateurs",
    status: "ouvert",
    priority: "normale",
    tags: ["API", "backend"],
    subtasks: [],
    comments: 1,
    attachments: 0,
    assignee: "TP",
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
  },

  // Tâches pour "en-cours"
  {
    id: "11",
    title: "Intégration page dashboard",
    description: "Intégrer la maquette Figma du dashboard",
    status: "en-cours",
    priority: "urgente",
    tags: ["intégration", "frontend"],
    subtasks: [
      {
        id: "11-1",
        title: "Structure HTML",
        completed: true,
      },
      {
        id: "11-2",
        title: "Styles CSS",
        completed: true,
      },
      {
        id: "11-3",
        title: "Interactivité JavaScript",
        completed: false,
      },
    ],
    comments: 8,
    attachments: 4,
    assignee: "KL",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "12",
    title: "Tests unitaires module paiement",
    description: "Écrire les tests pour le module de traitement des paiements",
    status: "en-cours",
    priority: "elevee",
    tags: ["tests", "qualité"],
    subtasks: [],
    comments: 2,
    attachments: 1,
    assignee: "JD",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },

  // Tâches pour "termine"
  {
    id: "13",
    title: "Documentation API REST",
    description: "Rédiger la documentation complète des endpoints",
    status: "termine",
    priority: "normale",
    tags: ["documentation", "API"],
    subtasks: [],
    comments: 0,
    attachments: 1,
    assignee: "MB",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "14",
    title: "Setup environnement de développement",
    description: "Configurer l'environnement pour les nouveaux développeurs",
    status: "termine",
    priority: "normale",
    tags: ["devops", "configuration"],
    subtasks: [
      {
        id: "14-1",
        title: "Docker configuration",
        completed: true,
      },
      {
        id: "14-2",
        title: "Scripts d'installation",
        completed: true,
      },
    ],
    comments: 4,
    attachments: 5,
    assignee: "AL",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-10"),
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
            createdAt: new Date(task.created_at),
            updatedAt: new Date(task.updated_at),
            dueDate: task.due_date ? new Date(task.due_date) : undefined,
          }));
          setTasks((prevTasks) => [...prevTasks, ...tasksToUpdate]);
        } else {
          // Charger les données initiales + mock supplémentaires
          setTasks([...initialTasks, ...additionalMockTasks]);
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        setTasks([...initialTasks, ...additionalMockTasks]);
      }
    };

    loadTasks();
  }, []);

  // Le reste de votre code reste identique...
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
      assignee: "US",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

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
