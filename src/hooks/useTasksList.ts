import { useState, useEffect, useCallback } from 'react';
import DashboardService from '../services/dashboardService';

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    progress: number;
    is_overdue: boolean;
    total_worked_time: number;
    formatted_worked_time: string;
    start_date: string | null;
    due_date: string | null;
    estimated_time: number;
    tags: string[];
    created_at: string;
    updated_at: string;
    project: {
        id: number;
        name: string;
        team_name: string;
    };
    assigned_user: {
        id: number;
        name: string;
        avatar: string | null;
        initials: string;
    };
    statistics: {
        time_logs_count: number;
        comments_count: number;
        files_count: number;
        active_time_logs: number;
    };
    actions: {
        can_edit: boolean;
        can_delete: boolean;
        can_assign: boolean;
    };
}

interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

interface Filters {
    status: string | null;
    priority: string | null;
    project_id: number | null;
    assigned_to: number | null;
    search: string | null;
    sort_by: string;
    sort_order: string;
}

interface TasksListResponse {
    tasks: Task[];
    pagination: Pagination;
    filters: Filters;
    user_role: string;
}

interface TasksListParams {
    page?: number;
    per_page?: number;
    status?: string;
    priority?: string;
    project_id?: number;
    assigned_to?: number;
    search?: string;
    sort_by?: string;
    sort_order?: string;
}

export const useTasksList = (initialParams?: TasksListParams) => {
    const [data, setData] = useState<TasksListResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [params, setParams] = useState<TasksListParams>({
        page: 1,
        per_page: 15,
        sort_by: 'created_at',
        sort_order: 'desc',
        ...initialParams,
    });

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await DashboardService.getTasksList(params);

            if (response.success) {
                setData(response.data);
            } else {
                setError(response.message || 'Failed to fetch tasks');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    }, [params]);

    const updateParams = (newParams: Partial<TasksListParams>) => {
        setParams((prev) => ({
            ...prev,
            ...newParams,
            // Reset to page 1 when changing filters
            ...(newParams.status || newParams.priority || newParams.search ? { page: 1 } : {}),
        }));
    };

    const goToPage = (page: number) => {
        updateParams({ page });
    };

    const applyFilter = (filter: Partial<TasksListParams>) => {
        updateParams(filter);
    };

    const clearFilters = () => {
        setParams({
            page: 1,
            per_page: 15,
            sort_by: 'created_at',
            sort_order: 'desc',
            ...initialParams,
        });
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        data,
        loading,
        error,
        params,
        fetchTasks,
        updateParams,
        goToPage,
        applyFilter,
        clearFilters,
    };
};
