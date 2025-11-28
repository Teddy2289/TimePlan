import { useState, useEffect, useCallback } from "react";
import { type Task } from "../types";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Simuler un appel API
      const response = await new Promise<Task[]>((resolve) => {
        setTimeout(() => {
          resolve([]); // Remplacer par votre appel API réel
        }, 1000);
      });
      setTasks(response);
    } catch (err) {
      setError("Erreur lors du chargement des tâches");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (updatedTask: Task) => {
    try {
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      // Simuler un appel API de mise à jour
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche");
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    updateTask,
    refetchTasks: fetchTasks,
  };
};
