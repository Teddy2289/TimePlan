export interface User {
  id: number; // Changé de string à number
  name: string;
  email: string;
  role: string;
  role_label: string;
  permissions: string[];
  password?: string;
  avatar_url?: string | null;
  initials: string;
  email_verified_at: string | null;
  avatar: string | null;
  created_at: string; // Changé de Date à string
  updated_at: string; // Changé de Date à string
}

export interface Project {
  id: number; // Changé de string à number
  team_id: number; // Changé de string à number
  team?: Team;
  name: string;
  description?: string;
  start_date?: string; // Changé de Date à string pour la compatibilité API
  end_date?: string; // Changé de Date à string pour la compatibilité API
  status: string;
  created_at: string; // Changé de Date à string
  updated_at: string; // Changé de Date à string
}

export interface Task {
  id: number; // Changé de string à number
  project_id: number; // Changé de string à number
  project?: Project;
  title: string;
  description?: string;
  assigned_to?: number | null; // Changé de string à number | null
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
  start_date?: string | null; // Changé de Date à string | null
  due_date?: string | null; // Changé de Date à string | null
  estimated_time?: number; // minutes
  created_at: string; // Changé de Date à string
  updated_at: string; // Changé de Date à string

  // Propriétés existantes de votre modèle
  tags: string[] | null;
  subtasks?: Subtask[]; // Optionnel car pas dans la réponse API
  comments?: number; // Optionnel
  attachments?: number; // Optionnel
  progress?: number; // Ajouté pour la compatibilité
  is_overdue?: boolean; // Ajouté pour la compatibilité
  total_worked_time?: number; // Ajouté pour la compatibilité
  assigned_user?: User; // Ajouté pour la compatibilité API
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

// User service methods reference the User type
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  data: {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
  message: string;
}

export interface ProfileUpdateData {
  name?: string;
  email?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface SyncTimeRequest {
  work_time_id: number;
  elapsed_seconds: number;
  is_running: boolean;
  last_sync_at: string;
}

export interface WorkTime {
  id: number;
  user_id: number;
  work_date: string;
  start_time: string | null;
  end_time: string | null;
  pause_start: string | null;
  pause_end: string | null;
  total_seconds: number;
  pause_seconds: number;
  net_seconds: number;
  status: "pending" | "in_progress" | "paused" | "completed";
  daily_target: number;
  progress_percentage: number;
  net_hours: number;
  pause_hours: number;
  created_at: string;
  already_started: boolean;
  updated_at: string;
  sessions?: WorkSession[];
}

export interface WorkSession {
  id: number;
  work_time_id: number;
  session_start: string;
  session_end: string | null;
  duration_seconds: number;
  type: "work" | "pause";
  duration_hours: number;
  created_at: string;
  updated_at: string;
}

export interface WorkTimeStatus {
  has_active_day: boolean;
  current_status: string | null;
  today: string;
  day_name: string;
  daily_target_hours: number;
  work_time: WorkTime | null;
}

export interface WeeklyStats {
  success: boolean;
  period: {
    start: string;
    end: string;
  };
  stats: {
    total_days: number;
    total_net_hours: number;
    total_target_hours: number;
    completion_percentage: number;
    daily_average: number;
  };
  daily_details: Array<{
    date: string;
    day_name: string;
    net_hours: number;
    target_hours: number;
    progress_percentage: number;
    status: string;
  }>;
}

export interface MonthlyStats {
  success: boolean;
  month: string;
  year: number;
  stats: {
    total_days_worked: number;
    total_net_hours: number;
    total_target_hours: number;
    completion_percentage: number;
    daily_average: number;
  };
  weekly_breakdown: Array<{
    week: number;
    period: string;
    net_hours: number;
    target_hours: number;
    completion_percentage: number;
    days_worked: number;
  }>;
  daily_details: Array<{
    date: string;
    day_name: string;
    net_hours: number;
    target_hours: number;
    progress_percentage: number;
    status: string;
  }>;
}

// end WorkTime
// Teams

export interface Team {
  id: number; // Changé de string à number
  name: string;
  description: string;
  owner_id: number; // Changé de string à number
  is_public: boolean;
  created_at: string;
  updated_at: string;
  members_count?: number;
}

export interface ApiTask {
  id: number;
  project_id: number;
  title: string;
  description: string | null;
  assigned_to: number | null;
  status: "backlog" | "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
  start_date: string | null;
  due_date: string | null;
  estimated_time: number | null;
  tags: string[] | null;
  progress: number;
  is_overdue: boolean;
  total_worked_time: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  assigned_user?: {
    id: number;
    name: string;
    email: string;
  };
  time_logs?: any[];
  comments?: any[];
  files?: any[];
}

export interface CreateTeamRequest {
  name: string;
  description?: string;
  owner_id?: number | string;
  is_public?: boolean;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  owner_id?: number | string;
  is_public?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  // Ajoutez d'autres champs selon votre modèle User
}

export interface TeamStatistics {
  total_members: number;
  total_projects: number;
  active_members: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}
// src/types/index.ts (ajoutez ces interfaces)
export interface ProjectTeam {
  id: number;
  team_id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: "active" | "completed" | "on_hold" | "cancelled";
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  team: {
    id: number;
    name: string;
    owner_id: number;
    description: string | null;
    is_public: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
}

export interface CreateProjectTeamRequest {
  team_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status?: string;
}

export interface UpdateProjectTeamRequest {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}
