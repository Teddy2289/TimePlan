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
    id: number;
    team_id: number;
    team?: Team;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Task {
    id: number;
    project_id: number;
    project?: Project;
    title: string;
    description?: string;
    assigned_to?: number | null;
    assignee?: User;
    status: 'backlog' | 'todo' | 'doing' | 'done';
    priority: 'low' | 'medium' | 'high';
    start_date?: string | null;
    due_date?: string | null;
    estimated_time?: number;
    created_at: string;
    updated_at: string;
    tags: string[] | null;
    subtasks?: Subtask[];
    comments?: number;
    attachments?: number;
    progress?: number;
    is_overdue?: boolean;
    total_worked_time?: number;
    assigned_user?: User;
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
export type ViewType = 'tableau' | 'list' | 'calendar' | 'gantt';

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
    status: 'pending' | 'in_progress' | 'paused' | 'completed';
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
    type: 'work' | 'pause';
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
    status: 'backlog' | 'todo' | 'doing' | 'done';
    priority: 'low' | 'medium' | 'high';
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
    status: 'active' | 'completed' | 'on_hold' | 'cancelled';
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
    team_members?: User[];
    tasks_count?: number;
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

// Types pour les tâches récentes
export interface RecentTask {
    id: number;
    title: string;
    status: string;
    priority: string;
    progress: number;
    is_overdue: boolean;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    time_since_update: string;
    project: {
        id: number;
        name: string;
        team_name: string | null;
    } | null;
    assigned_user: {
        id: number;
        name: string;
        avatar: string | null;
        initials: string;
    } | null;
    changes: string[];
}

export interface GroupedTaskDay {
    date: string;
    day_name: string;
    is_today: boolean;
    is_yesterday: boolean;
    tasks_count: number;
    tasks: Array<{
        id: number;
        title: string;
        status: string;
        updated_at: string;
    }>;
}

export interface RecentTasksPeriod {
    days: number;
    start_date: string;
    end_date: string;
}

export interface RecentTasksResponse {
    tasks: RecentTask[];
    grouped_tasks: GroupedTaskDay[];
    total: number;
    period: RecentTasksPeriod;
    user_role: string;
}

// Types pour les tâches en retard
export interface OverdueTask {
    id: number;
    title: string;
    status: string;
    priority: string;
    progress: number;
    due_date: string;
    days_overdue: number;
    severity: string;
    project: {
        id: number;
        name: string;
        team_name: string | null;
    } | null;
    assigned_user: {
        id: number;
        name: string;
        avatar: string | null;
        initials: string;
    } | null;
    total_worked_time: number;
    estimated_time: number | null;
    time_completion_rate: number;
}

export interface OverdueTasksStatistics {
    total: number;
    by_priority: {
        high: number;
        medium: number;
        low: number;
    };
    by_project: Array<{
        project_id: number;
        project_name: string;
        count: number;
    }>;
    days_overdue_stats: {
        '1-3_days': number;
        '4-7_days': number;
        '8-14_days': number;
        '15+_days': number;
    };
}

export interface OverdueTasksResponse {
    tasks: OverdueTask[];
    statistics: OverdueTasksStatistics;
    total: number;
    user_role: string;
    current_date: string;
}

// types/index.ts (ajoutez à votre interface existante)
export interface UpcomingTaskDay {
    date: string;
    day_name: string;
    is_today: boolean;
    is_tomorrow: boolean;
    date_type: 'start_date' | 'due_date';
    days_until: number;
    tasks: UpcomingTask[];
    count: number;
    high_priority_count: number;
    scheduled_count: number;
    unscheduled_count: number;
}

export interface UpcomingTask {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    progress: number;
    start_date?: string;
    due_date?: string;
    reference_date: string;
    date_type: 'start_date' | 'due_date';
    days_until: number;
    urgency: string;
    is_scheduled: boolean;
    project: {
        id: number;
        name: string;
        team_name: string | null;
    } | null;
    assigned_user: {
        id: number;
        name: string;
        avatar: string | null;
        avatar_url?: string;
        initials: string;
    } | null;
    estimated_time: number | null;
    total_worked_time: number;
    time_remaining: number | null;
    tags: string[];
}

export interface CriticalTask {
    id: number;
    title: string;
    project_name: string;
    due_date: string;
    days_until: number;
    progress: number;
}

export interface UpcomingTasksStatistics {
    total: number;
    by_day: Array<{
        date: string;
        count: number;
        high_priority_count: number;
    }>;
    by_priority: {
        high: number;
        medium: number;
        low: number;
    };
    by_project: Array<{
        project_id: number;
        project_name: string;
        count: number;
        high_priority_count: number;
    }>;
}

export interface UpcomingTasksPeriod {
    days_ahead: number;
    start_date: string;
    end_date: string;
}

export interface UpcomingTasksResponse {
    success: boolean;
    message?: string;
    data: {
        tasks_by_day: Array<{
            date: string;
            day_name: string;
            is_today: boolean;
            is_tomorrow: boolean;
            date_type?: 'start_date' | 'due_date';
            days_until: number;
            tasks: Array<UpcomingTask>;
            count: number;
            high_priority_count: number;
            scheduled_count: number;
            unscheduled_count: number;
        }>;
        critical_tasks: Array<{
            id: number;
            title: string;
            project_name: string;
            date_type?: string;
            reference_date: string;
            due_date?: string;
            start_date?: string;
            days_until: number;
            progress: number;
            priority: string;
        }>;
        statistics: {
            total: number;
            by_day: Array<{
                date: string;
                count: number;
                high_priority_count: number;
                scheduled_count?: number;
                unscheduled_count?: number;
            }>;
            by_priority: {
                high: number;
                medium: number;
                low: number;
            };
            by_schedule_type?: {
                scheduled: number;
                unscheduled: number;
            };
            by_project: Array<{
                project_id: number;
                project_name: string;
                count: number;
                high_priority_count: number;
                scheduled_count?: number;
            }>;
        };
        period: {
            days_ahead: number;
            start_date: string;
            end_date: string;
        };
        user_role: string;
        current_date: string;
    };
    errors?: Record<string, string[]>;
    timestamp?: string;
}

// Types pour les statistiques des tâches
export interface TaskStatusStats {
    total: number;
    backlog: number;
    todo: number;
    doing: number;
    done: number;
    overdue: number;
    backlog_percentage: number;
    todo_percentage: number;
    doing_percentage: number;
    done_percentage: number;
    overdue_percentage: number;
    high_priority: number;
    medium_priority: number;
    low_priority: number;
    with_due_date: number;
    without_due_date: number;
    with_time_estimate: number;
    without_time_estimate: number;
    total_worked_time_minutes: number;
    total_worked_time_hours: number;
    avg_worked_time_per_task: number;
    recent_tasks: number;
    recent_percentage: number;
    recently_done: number;
    overdue_high_priority: number;
    overdue_medium_priority: number;
    overdue_low_priority: number;
    project_distribution: Array<{
        project_id: number;
        project_name: string;
        task_count: number;
        percentage: number;
    }>;
    status_evolution: Record<
        string,
        {
            date: string;
            day_name: string;
            total: number;
            backlog: number;
            todo: number;
            doing: number;
            done: number;
            completion_rate: number;
        }
    >;
    active_tasks_count: number;
    avg_progress: number;
    avg_completion_per_day: number;
    total_estimated_time: number;
    time_efficiency: number;
    timeframe?: string;
    start_date?: string | null;
    end_date?: string | null;
    user_role?: string;
    changes?: Record<
        string,
        {
            value: number;
            percentage: number;
            trend: 'up' | 'down' | 'neutral';
            is_positive: boolean;
        }
    > | null;
}
