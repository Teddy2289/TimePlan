import React, { createContext, useContext, useState } from "react";
import type { Task, ViewType } from "../types";

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
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  addTask: (title: string, status: Task["status"]) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const CustomDndContext = createContext<DndContextType | undefined>(undefined);

// Données initiales (gardez vos tasks ici)
// Données initiales
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
  // Tâches supplémentaires
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
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
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
      }
    ],
    comments: 5,
    attachments: 3,
    assignee: "AL",
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
  },
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
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: "10",
    title: "API - Endpoints utilisateurs",
    description: "Développer les endpoints CRUD pour la gestion des utilisateurs",
    status: "ouvert",
    priority: "normale",
    tags: ["API", "backend"],
    subtasks: [],
    comments: 1,
    attachments: 0,
    assignee: "TP",
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
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
      }
    ],
    comments: 8,
    attachments: 4,
    assignee: "KL",
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-16'),
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
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
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
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
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
      }
    ],
    comments: 4,
    attachments: 5,
    assignee: "AL",
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
  }
];
export const DndProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [currentView, setCurrentView] = useState<ViewType>("tableau");


  const moveTask = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task
      )
    );
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
    activeTask,
    setActiveTask,
    addTask,
    currentView,
    setCurrentView,
  };

  return (
    <CustomDndContext.Provider value={value}>
      {children} {/* JUSTE les enfants, pas de DndContext ici */}
    </CustomDndContext.Provider>
  );
};

export const useDnd = () => {
  const context = useContext(CustomDndContext);
  if (context === undefined) {
    throw new Error("useDnd must be used within a DndProvider");
  }
  return context;
};



