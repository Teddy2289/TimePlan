import api from "./api";
import type { ApiResponse, PaginatedResponse, User } from "../types/index";

export interface Task {
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

export interface CreateTaskRequest {
  project_id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  status?: "backlog" | "todo" | "doing" | "done";
  priority?: "low" | "medium" | "high";
  start_date?: string;
  due_date?: string;
  estimated_time?: number;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  assigned_to?: number | null;
  status?: "backlog" | "todo" | "doing" | "done";
  priority?: "low" | "medium" | "high";
  start_date?: string;
  due_date?: string;
  estimated_time?: number;
  tags?: string[];
}

export interface TaskFilters {
  project_id?: number;
  status?: string;
  priority?: string;
  assigned_to?: number;
  search?: string;
  order_by?: string;
  order_direction?: "asc" | "desc";
}

export interface TaskStatistics {
  total: number;
  backlog: number;
  todo: number;
  doing: number;
  done: number;
  overdue: number;
  low_priority: number;
  medium_priority: number;
  high_priority: number;
}

class TaskService {
  // === Routes principales CRUD ===

  // Récupérer toutes les tâches (GET /tasks)
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
        "/tasks",
        {
          params: filters,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  // Créer une nouvelle tâche (POST /tasks)
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>("/tasks", taskData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  // Récupérer une tâche par ID (GET /tasks/{id})
  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  // Mettre à jour une tâche (PUT /tasks/{id})
  async updateTask(id: number, taskData: UpdateTaskRequest): Promise<Task> {
    try {
      const response = await api.put<ApiResponse<Task>>(
        `/tasks/${id}`,
        taskData
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  }

  // Supprimer une tâche (DELETE /tasks/{id})
  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  // Restaurer une tâche supprimée (POST /tasks/{id}/restore)
  async restoreTask(id: number): Promise<void> {
    try {
      await api.post(`/tasks/${id}/restore`);
    } catch (error) {
      console.error(`Error restoring task ${id}:`, error);
      throw error;
    }
  }

  // === Routes spécifiques pour les statuts ===

  // Marquer une tâche comme complétée (POST /tasks/{id}/complete)
  async completeTask(id: number): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>(
        `/tasks/${id}/complete`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error completing task ${id}:`, error);
      throw error;
    }
  }

  // Démarrer une tâche (POST /tasks/{id}/start)
  async startTask(id: number): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>(`/tasks/${id}/start`);
      return response.data.data;
    } catch (error) {
      console.error(`Error starting task ${id}:`, error);
      throw error;
    }
  }

  // Réinitialiser une tâche à "todo" (POST /tasks/{id}/reset-todo)
  async resetTaskToTodo(id: number): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>(
        `/tasks/${id}/reset-todo`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error resetting task ${id}:`, error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une tâche (POST /tasks/{id}/status)
  async updateTaskStatus(
    id: number,
    status: "backlog" | "todo" | "doing" | "done"
  ): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>(
        `/tasks/${id}/status`,
        { status }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating task ${id} status:`, error);
      throw error;
    }
  }

  // Assigner une tâche à un utilisateur (POST /tasks/{id}/assign)
  async assignTask(id: number, userId: number): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>(
        `/tasks/${id}/assign`,
        { user_id: userId }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error assigning task ${id} to user ${userId}:`, error);
      throw error;
    }
  }

  // === Routes de recherche et filtrage ===

  // Rechercher des tâches (POST /tasks/search)
  async searchTasks(
    query: string,
    filters?: Omit<TaskFilters, "search">
  ): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.post<ApiResponse<PaginatedResponse<Task>>>(
        "/tasks/search",
        { query, ...filters }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }

  // Récupérer les tâches d'un projet (GET /tasks/project/{projectId})
  async getTasksByProject(
    projectId: number,
    filters?: Omit<TaskFilters, "project_id">
  ): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
        `/tasks/project/${projectId}`,
        {
          params: filters,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching tasks for project ${projectId}:`, error);
      throw error;
    }
  }

  // Alternative: Récupérer les tâches d'un projet via l'endpoint dédié (GET /tasks/projects/{projectId}/tasks)
  async getProjectTasks(projectId: number): Promise<Task[]> {
    try {
      const response = await api.get<ApiResponse<Task[]>>(
        `/tasks/projects/${projectId}/tasks`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching project ${projectId} tasks:`, error);
      throw error;
    }
  }

  // Récupérer les tâches assignées à un utilisateur (GET /tasks/user/{userId})
  async getTasksByUser(
    userId: number,
    filters?: Omit<TaskFilters, "assigned_to">
  ): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
        `/tasks/user/${userId}`,
        {
          params: filters,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error);
      throw error;
    }
  }

  // Récupérer les tâches en retard (GET /tasks/overdue)
  async getOverdueTasks(projectId?: number): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
        "/tasks/overdue",
        {
          params: projectId ? { project_id: projectId } : {},
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching overdue tasks:", error);
      throw error;
    }
  }

  // Récupérer les tâches à venir (GET /tasks/upcoming)
  async getUpcomingTasks(projectId?: number): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Task>>>(
        "/tasks/upcoming",
        {
          params: projectId ? { project_id: projectId } : {},
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error);
      throw error;
    }
  }

  // === Routes de statistiques ===

  // Récupérer les statistiques des tâches (GET /tasks/statistics)
  async getTaskStatistics(projectId?: number): Promise<TaskStatistics> {
    try {
      const response = await api.get<ApiResponse<TaskStatistics>>(
        "/tasks/statistics",
        {
          params: projectId ? { project_id: projectId } : {},
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching task statistics:", error);
      throw error;
    }
  }

  // Compter les tâches par statut (GET /tasks/count-by-status)
  async countTasksByStatus(
    projectId?: number
  ): Promise<Record<string, number>> {
    try {
      const response = await api.get<ApiResponse<Record<string, number>>>(
        "/tasks/count-by-status",
        {
          params: projectId ? { project_id: projectId } : {},
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error counting tasks by status:", error);
      throw error;
    }
  }

  // === Routes pour les utilisateurs assignables et membres ===

  // Récupérer les utilisateurs assignables pour un projet (GET /tasks/project/{projectId}/assignable-users)
  async getAssignableUsers(projectId: number): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>(
        `/tasks/project/${projectId}/assignable-users`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching assignable users for project ${projectId}:`,
        error
      );
      throw error;
    }
  }

  // Récupérer les membres de l'équipe pour un projet (GET /tasks/project/{projectId}/team-members)
  async getTeamMembers(projectId: number): Promise<User[]> {
    try {
      const response = await api.get<ApiResponse<User[]>>(
        `/tasks/project/${projectId}/team-members`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching team members for project ${projectId}:`,
        error
      );
      throw error;
    }
  }

  // === Routes de santé et test ===

  // Vérifier la santé du module (GET /tasks/health)
  async checkHealth(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>("/tasks/health");
      return response.data.data;
    } catch (error) {
      console.error("Error checking task module health:", error);
      throw error;
    }
  }

  // Vérifier la santé du module (version publique) (GET /tasks/health/public)
  async checkHealthPublic(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>("/tasks/health/public");
      return response.data.data;
    } catch (error) {
      console.error("Error checking task module health (public):", error);
      throw error;
    }
  }

  // Test du module (GET /tasks/test)
  async test(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>("/tasks/test");
      return response.data.data;
    } catch (error) {
      console.error("Error testing task module:", error);
      throw error;
    }
  }

  // Test du module (version publique) (GET /tasks/test/public)
  async testPublic(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>("/tasks/test/public");
      return response.data.data;
    } catch (error) {
      console.error("Error testing task module (public):", error);
      throw error;
    }
  }

  // === Fonctions utilitaires supplémentaires ===

  // Récupérer les tâches avec des filtres avancés (alias de getTasks)
  async getFilteredTasks(filters?: TaskFilters): Promise<PaginatedResponse<Task>> {
    return this.getTasks(filters);
  }

  // Mettre à jour la progression d'une tâche (fonction utilitaire)
  async updateTaskProgress(id: number, progress: number): Promise<Task> {
    try {
      // Si le progrès est 100%, marquer comme "done"
      if (progress === 100) {
        return await this.updateTaskStatus(id, "done");
      } else if (progress > 0) {
        // Si progrès > 0 mais pas 100%, marquer comme "doing"
        await this.updateTaskStatus(id, "doing");
      }
      
      // Mettre à jour le progrès
      return await this.updateTask(id, { 
        // Note: Vous pourriez avoir besoin d'ajouter un champ progress dans UpdateTaskRequest
        // Si ce n'est pas le cas, utilisez une autre méthode
      } as UpdateTaskRequest);
    } catch (error) {
      console.error(`Error updating task ${id} progress:`, error);
      throw error;
    }
  }

  // === Méthodes utilitaires pour le frontend ===

  // Méthode utilitaire pour formater les données de tâche
  formatTaskRequest(
    taskData: Partial<CreateTaskRequest>,
    projectId: number
  ): CreateTaskRequest {
    return {
      project_id: projectId,
      title: taskData.title || "",
      description: taskData.description,
      assigned_to: taskData.assigned_to,
      status: taskData.status || "backlog",
      priority: taskData.priority || "medium",
      start_date: taskData.start_date,
      due_date: taskData.due_date,
      estimated_time: taskData.estimated_time,
      tags: taskData.tags || [],
    };
  }

  // Méthode utilitaire pour calculer la progression
  calculateProgress(status: string): number {
    switch (status) {
      case "backlog":
        return 0;
      case "todo":
        return 0;
      case "doing":
        return 50;
      case "done":
        return 100;
      default:
        return 0;
    }
  }

  // Méthode utilitaire pour vérifier si une tâche est en retard
  isTaskOverdue(dueDate: string | null, status: string): boolean {
    if (!dueDate || status === "done") return false;
    const due = new Date(dueDate);
    const now = new Date();
    return due < now;
  }

  // Méthode utilitaire pour grouper les tâches par statut
  groupTasksByStatus(tasks: Task[]): Record<string, Task[]> {
    const groups: Record<string, Task[]> = {
      backlog: [],
      todo: [],
      doing: [],
      done: [],
    };

    tasks.forEach((task) => {
      if (groups[task.status]) {
        groups[task.status].push(task);
      }
    });

    return groups;
  }

  // Méthode utilitaire pour filtrer les tâches
  filterTasks(tasks: Task[], filters: Partial<TaskFilters>): Task[] {
    return tasks.filter((task) => {
      if (filters.status && task.status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.assigned_to && task.assigned_to !== filters.assigned_to)
        return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          task.title.toLowerCase().includes(search) ||
          (task.description && task.description.toLowerCase().includes(search))
        );
      }
      return true;
    });
  }

  // Méthode utilitaire pour trier les tâches
  sortTasks(
    tasks: Task[],
    field: string,
    direction: "asc" | "desc" = "asc"
  ): Task[] {
    return [...tasks].sort((a, b) => {
      let aValue: any = a[field as keyof Task];
      let bValue: any = b[field as keyof Task];

      // Gérer les valeurs nulles
      if (aValue === null) aValue = direction === "asc" ? Infinity : -Infinity;
      if (bValue === null) bValue = direction === "asc" ? Infinity : -Infinity;

      // Comparer les dates
      if (field.includes("date")) {
        aValue = aValue ? new Date(aValue).getTime() : 0;
        bValue = bValue ? new Date(bValue).getTime() : 0;
      }

      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  // Méthode pour récupérer les URL des endpoints
  getEndpointUrls() {
    return {
      tasks: "/tasks",
      taskById: (id: number) => `/tasks/${id}`,
      completeTask: (id: number) => `/tasks/${id}/complete`,
      startTask: (id: number) => `/tasks/${id}/start`,
      resetTask: (id: number) => `/tasks/${id}/reset-todo`,
      updateStatus: (id: number) => `/tasks/${id}/status`,
      assignTask: (id: number) => `/tasks/${id}/assign`,
      restoreTask: (id: number) => `/tasks/${id}/restore`,
      searchTasks: "/tasks/search",
      projectTasks: (projectId: number) => `/tasks/project/${projectId}`,
      userTasks: (userId: number) => `/tasks/user/${userId}`,
      overdueTasks: "/tasks/overdue",
      upcomingTasks: "/tasks/upcoming",
      statistics: "/tasks/statistics",
      countByStatus: "/tasks/count-by-status",
      assignableUsers: (projectId: number) => `/tasks/project/${projectId}/assignable-users`,
      teamMembers: (projectId: number) => `/tasks/project/${projectId}/team-members`,
      health: "/tasks/health",
      healthPublic: "/tasks/health/public",
      test: "/tasks/test",
      testPublic: "/tasks/test/public",
      projectTasksAlternative: (projectId: number) => `/tasks/projects/${projectId}/tasks`,
    };
  }
}

export default new TaskService();