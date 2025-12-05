export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user" | "viewer";
  password?: string;
  avatar?: string;
  avatar_url?: string;
  initials: string;
  created_at: Date;
  updated_at: Date;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  owner?: User;
  created_at: Date;
  updated_at: Date;
}

export interface Project {
  id: string;
  team_id: string;
  team?: Team;
  name: string;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Task {
  id: string;
  project_id: string;
  project?: Project;
  title: string;
  description?: string;
  assigned_to?: string;
  assignee?: User;
  status:
    | "backlog"
    | "todo"
    | "doing"
    | "done"
    | "en-attente"
    | "ouvert"
    | "en-cours"
    | "a-valider"
    | "termine";
  priority:
    | "low"
    | "medium"
    | "high"
    | "basse"
    | "normale"
    | "elevee"
    | "urgente";
  start_date?: Date;
  due_date?: Date;
  estimated_time?: number; // minutes
  created_at: Date;
  updated_at: Date;

  // Propriétés existantes de votre modèle
  tags: string[];
  subtasks: Subtask[];
  comments: number;
  attachments: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskTimeLog {
  id: string;
  task_id: string;
  task?: Task;
  user_id: string;
  user?: User;
  start_time: Date;
  end_time?: Date;
  duration?: number; // minutes
  note?: string;
}

export interface TaskFile {
  id: string;
  task_id: string;
  task?: Task;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_by: string;
  uploaded_by_user?: User;
  created_at: Date;
}

export interface Comment {
  id: string;
  task_id: string;
  task?: Task;
  user_id: string;
  user?: User;
  content: string;
  created_at: Date;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

export interface StatusColumn {
  id: string;
  title: string;
  color: string;
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

// Nouveau type pour le store
export interface AppState {
  tasks: Task[];
  columns: StatusColumn[];
  users: User[];
  teams: Team[];
  projects: Project[];
  taskTimeLogs: TaskTimeLog[];
  taskFiles: TaskFile[];
  comments: Comment[];
  spaces: Space[];
  lists: List[];
  sidebarItems: SidebarItem[];
}
export type ViewType = "tableau" | "list" | "calendar" | "gantt";

export interface ViewConfig {
  id: ViewType;
  label: string;
  icon?: React.ReactNode;
}
