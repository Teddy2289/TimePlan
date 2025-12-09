// src/services/taskService.ts
import api from "./api";
import type { ApiResponse, PaginatedResponse } from "../types/index";

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
  // Récupérer toutes les tâches
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

  // Récupérer les tâches d'un projet
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

  // Alternative: Récupérer les tâches d'un projet via l'endpoint dédié
  async getProjectTasks(projectId: number): Promise<Task[]> {
    try {
      const response = await api.get<ApiResponse<Task[]>>(
        `tasks/projects/${projectId}/tasks`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching project ${projectId} tasks:`, error);
      throw error;
    }
  }

  // Récupérer une tâche par ID
  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle tâche
  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>("/tasks", taskData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  // Mettre à jour une tâche
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

  // Supprimer une tâche
  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }

  // Restaurer une tâche supprimée
  async restoreTask(id: number): Promise<void> {
    try {
      await api.post(`/tasks/${id}/restore`);
    } catch (error) {
      console.error(`Error restoring task ${id}:`, error);
      throw error;
    }
  }

  // Marquer une tâche comme complétée
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

  // Démarrer une tâche
  async startTask(id: number): Promise<Task> {
    try {
      const response = await api.post<ApiResponse<Task>>(`/tasks/${id}/start`);
      return response.data.data;
    } catch (error) {
      console.error(`Error starting task ${id}:`, error);
      throw error;
    }
  }

  // Réinitialiser une tâche à "todo"
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

  // Mettre à jour le statut d'une tâche
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

  // Assigner une tâche à un utilisateur
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

  // Rechercher des tâches
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

  // Récupérer les tâches assignées à un utilisateur
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

  // Récupérer les tâches en retard
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

  // Récupérer les tâches à venir
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

  // Récupérer les statistiques des tâches
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

  // Compter les tâches par statut
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

  // Vérifier la santé du module
  async checkHealth(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>("/tasks/health");
      return response.data.data;
    } catch (error) {
      console.error("Error checking task module health:", error);
      throw error;
    }
  }

  // Test du module
  async test(): Promise<any> {
    try {
      const response = await api.get<ApiResponse<any>>("/tasks/test");
      return response.data.data;
    } catch (error) {
      console.error("Error testing task module:", error);
      throw error;
    }
  }

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
}

export default new TaskService();
