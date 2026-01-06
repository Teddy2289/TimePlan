import api from './api';
import type {
    RecentTasksResponse,
    OverdueTasksResponse,
    UpcomingTasksResponse,
    TaskStatusStats,
    ApiResponse,
} from '../../src/types/index';

class DashboardService {
    /**
     * Récupère les tâches récentes
     */
    async getRecentTasks(options?: {
        limit?: number;
        days?: number;
    }): Promise<ApiResponse<RecentTasksResponse>> {
        try {
            const response = await api.get('/userDashboard/recent-tasks', {
                params: {
                    limit: options?.limit || 10,
                    days: options?.days || 7,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching recent tasks:', error);
            throw error;
        }
    }

    /**
     * Récupère les tâches en retard
     */
    async getOverdueTasks(options?: {
        limit?: number;
    }): Promise<ApiResponse<OverdueTasksResponse>> {
        try {
            const response = await api.get('/userDashboard/overdue-tasks', {
                params: {
                    limit: options?.limit || 20,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching overdue tasks:', error);
            throw error;
        }
    }

    /**
     * Récupère les tâches à venir
     */
    async getUpcomingTasks(options?: {
        limit?: number;
        days_ahead?: number;
    }): Promise<UpcomingTasksResponse> {
        try {
            const response = await api.get('/userDashboard/upcoming-tasks', {
                params: {
                    limit: options?.limit || 15,
                    days_ahead: options?.days_ahead || 7,
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching upcoming tasks:', error);

            // Retournez une réponse d'erreur structurée
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to fetch upcoming tasks',
                data: {
                    tasks_by_day: [],
                    critical_tasks: [],
                    statistics: {
                        total: 0,
                        by_day: [],
                        by_priority: { high: 0, medium: 0, low: 0 },
                        by_project: [],
                        by_schedule_type: { scheduled: 0, unscheduled: 0 },
                    },
                    period: {
                        days_ahead: options?.days_ahead || 7,
                        start_date: new Date().toISOString().split('T')[0],
                        end_date: new Date(
                            Date.now() + (options?.days_ahead || 7) * 24 * 60 * 60 * 1000
                        )
                            .toISOString()
                            .split('T')[0],
                    },
                    user_role: '',
                    current_date: new Date().toISOString().split('T')[0],
                },
                errors: error.response?.data?.errors,
            };
        }
    }

    /**
     * Récupère les statistiques des tâches
     */
    async getTaskStats(timeframe: string = 'month'): Promise<ApiResponse<TaskStatusStats>> {
        try {
            const response = await api.get('/userDashboard/task-stats', {
                params: { timeframe },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching task stats:', error);
            throw error;
        }
    }

    /**
     * Récupère le dashboard principal
     */
    async getDashboard(): Promise<any> {
        try {
            const response = await api.get('/userDashboard');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            throw error;
        }
    }

    /**
     * Récupère le résumé mensuel
     */
    async getMonthlySummary(year?: number, month?: number): Promise<any> {
        try {
            const response = await api.get('/userDashboard/monthly-summary', {
                params: {
                    year,
                    month,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching monthly summary:', error);
            throw error;
        }
    }

    /**
     * Récupère la liste paginée des tâches
     */
    async getTasksList(params?: {
        page?: number;
        per_page?: number;
        status?: string;
        priority?: string;
        project_id?: number;
        assigned_to?: number;
        search?: string;
        sort_by?: string;
        sort_order?: string;
    }): Promise<any> {
        try {
            const response = await api.get('/userDashboard/tasks', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks list:', error);
            throw error;
        }
    }
}

export default new DashboardService();
