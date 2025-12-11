// src/services/taskCommentService.ts
import api from "./api";

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  replies_count?: number;
}

export interface CreateCommentData {
  task_id: number;
  content: string;
  parent_id?: number | null;
}

export interface UpdateCommentData {
  content: string;
}

const taskCommentService = {
  // Récupérer les commentaires d'une tâche
  getTaskComments: async (
    taskId: number,
    params?: any
  ): Promise<TaskComment[]> => {
    const response = await api.get(`/tasks/${taskId}/comments`, { params });
    return response.data.data;
  },

  // Créer un commentaire
  createComment: async (data: CreateCommentData): Promise<TaskComment> => {
    const response = await api.post(`/tasks/${data.task_id}/comments`, data);
    return response.data.data;
  },

  // Mettre à jour un commentaire
  updateComment: async (
    commentId: number,
    data: UpdateCommentData
  ): Promise<TaskComment> => {
    const response = await api.put(`/comments/${commentId}`, data);
    return response.data.data;
  },

  // Supprimer un commentaire
  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },

  // Ajouter une réponse à un commentaire
  addReply: async (
    commentId: number,
    data: { content: string }
  ): Promise<TaskComment> => {
    const response = await api.post(`/comments/${commentId}/reply`, data);
    return response.data.data;
  },

  // Récupérer les réponses d'un commentaire
  getReplies: async (commentId: number): Promise<TaskComment[]> => {
    const response = await api.get(`/comments/${commentId}/replies`);
    return response.data.data;
  },

  // Récupérer les statistiques des commentaires
  getStatistics: async (taskId?: number): Promise<any> => {
    const params = taskId ? { task_id: taskId } : {};
    const response = await api.get("/comments/statistics", { params });
    return response.data.data;
  },
};

export default taskCommentService;
