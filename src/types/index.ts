export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "en-attente" | "ouvert" | "en-cours" | "a-valider" | "termine";
  priority: "basse" | "normale" | "elevee" | "urgente";
  tags: string[];
  subtasks: Subtask[];
  comments: number;
  attachments: number;
  assignee: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusColumn {
  id: string;
  title: string;
  color: string;
}

export interface AppState {
  tasks: Task[];
  columns: StatusColumn[];
}
export interface List {
  id: string;
  name: string;
  spaceId: string;
  color: string;
  taskCount: number;
}

export interface SidebarItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  children?: SidebarItem[];
}

export type ViewType = "tableau" | "list" | "calendar" | "gantt";

export interface ViewConfig {
  id: ViewType;
  label: string;
  icon?: React.ReactNode;
}