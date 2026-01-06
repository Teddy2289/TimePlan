import api from './api';
import type { TaskStatusStats } from '../types';

interface TaskStatsFilters {
    timeframe?: string; // 'day', 'week', 'month', 'year', 'all'
    start_date?: string;
    end_date?: string;
    project_id?: number;
    status?: string;
}

class TaskStatsService {
    // Récupérer les statistiques des tâches
    async getTaskStats(filters: TaskStatsFilters = {}): Promise<TaskStatusStats> {
        const params = new URLSearchParams();

        if (filters.timeframe) params.append('timeframe', filters.timeframe);
        if (filters.start_date) params.append('start_date', filters.start_date);
        if (filters.end_date) params.append('end_date', filters.end_date);
        if (filters.project_id) params.append('project_id', filters.project_id.toString());
        if (filters.status) params.append('status', filters.status);

        const response = await api.get(`/userDashboard/task-stats?${params.toString()}`);
        return response.data.data;
    }

    // Récupérer les statistiques pour un timeframe spécifique
    async getTaskStatsByTimeframe(timeframe: string = 'month'): Promise<TaskStatusStats> {
        return this.getTaskStats({ timeframe });
    }

    // Récupérer les statistiques pour une période personnalisée
    async getTaskStatsByDateRange(startDate: string, endDate: string): Promise<TaskStatusStats> {
        return this.getTaskStats({
            timeframe: 'all',
            start_date: startDate,
            end_date: endDate,
        });
    }

    // Récupérer les statistiques par projet
    async getTaskStatsByProject(projectId: number): Promise<TaskStatusStats> {
        return this.getTaskStats({
            project_id: projectId,
            timeframe: 'all',
        });
    }

    // Formater les statistiques pour l'affichage
    formatStatsForDisplay(stats: TaskStatusStats) {
        return {
            total: stats.total,
            backlog: stats.backlog,
            todo: stats.todo,
            doing: stats.doing,
            done: stats.done,
            overdue: stats.overdue,

            percentages: {
                todo: stats.todo_percentage,
                doing: stats.doing_percentage,
                done: stats.done_percentage,
                overdue: stats.overdue_percentage,
            },

            priorities: {
                high: stats.high_priority,
                medium: stats.medium_priority,
                low: stats.low_priority,
            },

            timeMetrics: {
                totalWorkedHours: stats.total_worked_time_hours,
                avgWorkedPerTask: stats.avg_worked_time_per_task,
                timeEfficiency: stats.time_efficiency,
            },

            distribution: stats.project_distribution,
            evolution: stats.status_evolution,
            changes: stats.changes,
        };
    }

    // Calculer les tendances (pourcentage de changement)
    calculateTrends(currentStats: TaskStatusStats, previousStats?: TaskStatusStats) {
        if (!previousStats) return null;

        return {
            todo: this.calculatePercentageChange(currentStats.todo, previousStats.todo),
            doing: this.calculatePercentageChange(currentStats.doing, previousStats.doing),
            done: this.calculatePercentageChange(currentStats.done, previousStats.done),
            overdue: this.calculatePercentageChange(currentStats.overdue, previousStats.overdue),
            completionRate: this.calculatePercentageChange(
                currentStats.done_percentage,
                previousStats.done_percentage
            ),
        };
    }

    private calculatePercentageChange(current: number, previous: number): number {
        if (previous === 0) return 0;
        return ((current - previous) / Math.abs(previous)) * 100;
    }
}

export default new TaskStatsService();
