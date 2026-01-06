// src/hooks/useRecentTasks.ts
import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import { type RecentTasksResponse } from '../types';

export const useRecentTasks = (options?: { limit?: number; days?: number }) => {
    const [data, setData] = useState<RecentTasksResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await dashboardService.getRecentTasks(options);

            if (response.success) {
                setData(response.data);
            } else {
                setError('Erreur lors du chargement des données');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
            console.error('Error in useRecentTasks:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [options?.limit, options?.days]);

    const refetch = () => {
        fetchData();
    };

    return {
        data,
        loading,
        error,
        refetch,
    };
};
