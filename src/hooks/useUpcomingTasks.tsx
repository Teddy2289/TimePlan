// hooks/useUpcomingTasks.ts
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import { type UpcomingTasksResponse } from '../types';

interface UseUpcomingTasksProps {
    limit?: number;
    daysAhead?: number;
}

interface UseUpcomingTasksReturn {
    tasksByDay: UpcomingTasksResponse['data']['tasks_by_day'];
    criticalTasks: UpcomingTasksResponse['data']['critical_tasks'];
    statistics: UpcomingTasksResponse['data']['statistics'];
    period: UpcomingTasksResponse['data']['period'];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

const useUpcomingTasks = ({
    limit = 15,
    daysAhead = 7,
}: UseUpcomingTasksProps = {}): UseUpcomingTasksReturn => {
    const [tasksByDay, setTasksByDay] = useState<UpcomingTasksResponse['data']['tasks_by_day']>([]);
    const [criticalTasks, setCriticalTasks] = useState<
        UpcomingTasksResponse['data']['critical_tasks']
    >([]);
    const [statistics, setStatistics] = useState<UpcomingTasksResponse['data']['statistics']>({
        total: 0,
        by_day: [],
        by_priority: { high: 0, medium: 0, low: 0 },
        by_project: [],
        by_schedule_type: { scheduled: 0, unscheduled: 0 },
    });
    const [period, setPeriod] = useState<UpcomingTasksResponse['data']['period']>({
        days_ahead: 7,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUpcomingTasks = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await dashboardService.getUpcomingTasks({
                limit,
                days_ahead: daysAhead,
            });

            console.log('Upcoming tasks response:', response);

            if (response.success) {
                setTasksByDay(response.data.tasks_by_day);
                setCriticalTasks(response.data.critical_tasks);

                // Assurez-vous que by_schedule_type existe
                const stats = {
                    total: response.data.statistics.total,
                    by_day: response.data.statistics.by_day,
                    by_priority: response.data.statistics.by_priority,
                    by_project: response.data.statistics.by_project,
                    by_schedule_type: response.data.statistics.by_schedule_type || {
                        scheduled: 0,
                        unscheduled: 0,
                    },
                };

                setStatistics(stats);
                setPeriod(response.data.period);
            } else {
                setError(response.message || 'Failed to fetch upcoming tasks');
            }
        } catch (err: any) {
            console.error('Error in useUpcomingTasks:', err);
            setError(err.message || 'An error occurred while fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUpcomingTasks();
    }, [limit, daysAhead]);

    return {
        tasksByDay,
        criticalTasks,
        statistics,
        period,
        loading,
        error,
        refresh: fetchUpcomingTasks,
    };
};

export default useUpcomingTasks;
