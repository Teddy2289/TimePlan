import { useState, useEffect, useCallback } from 'react';
import taskStatsService from '../services/taskStatsService';
import type { TaskStatusStats } from '../types';

interface UseTaskStatsOptions {
    timeframe?: string;
    autoFetch?: boolean;
    projectId?: number;
    refreshInterval?: number; // en millisecondes
}

interface UseTaskStatsReturn {
    stats: TaskStatusStats | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    updateFilters: (filters: Partial<UseTaskStatsOptions>) => void;
    formattedStats: any | null;
}

export const useTaskStats = (options: UseTaskStatsOptions = {}): UseTaskStatsReturn => {
    const { timeframe = 'month', autoFetch = true, projectId, refreshInterval = 0 } = options;

    const [stats, setStats] = useState<TaskStatusStats | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<UseTaskStatsOptions>(options);

    const fetchStats = useCallback(async () => {
        if (!autoFetch) return;

        setLoading(true);
        setError(null);

        try {
            const params: any = { timeframe: filters.timeframe || timeframe };

            if (filters.projectId) {
                params.project_id = filters.projectId;
            }

            const data = await taskStatsService.getTaskStats(params);
            setStats(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors du chargement des statistiques');
            console.error('Error fetching task stats:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, timeframe, autoFetch]);

    // Effet pour le chargement initial
    useEffect(() => {
        if (autoFetch) {
            fetchStats();
        }
    }, [fetchStats, autoFetch]);

    // Effet pour le rafraîchissement automatique
    useEffect(() => {
        if (refreshInterval > 0 && autoFetch) {
            const intervalId = setInterval(fetchStats, refreshInterval);
            return () => clearInterval(intervalId);
        }
    }, [fetchStats, refreshInterval, autoFetch]);

    // Formater les statistiques pour l'affichage
    const formattedStats = stats ? taskStatsService.formatStatsForDisplay(stats) : null;

    // Mettre à jour les filtres
    const updateFilters = (newFilters: Partial<UseTaskStatsOptions>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    // Rafraîchir manuellement
    const refresh = async () => {
        await fetchStats();
    };

    return {
        stats,
        loading,
        error,
        refresh,
        updateFilters,
        formattedStats,
    };
};
