// src/services/taskFileService.ts
import api from "./api";

export interface TaskFile {
  id: number;
  task_id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_by: number;
  description?: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  download_url?: string;
  preview_url?: string;
  formatted_size?: string;
}

export interface UploadFileData {
  task_id: number;
  files: File[];
  description?: string;
}

const taskFileService = {
  // Récupérer les fichiers d'une tâche
  getTaskFiles: async (taskId: number, params?: any): Promise<TaskFile[]> => {
    const response = await api.get(`/tasks/${taskId}/files`, { params });
    return response.data.data;
  },

  // Télécharger un fichier
  downloadFile: async (fileId: number): Promise<Blob> => {
    const response = await api.get(`/files/${fileId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Obtenir l'URL de prévisualisation
  getPreviewUrl: async (fileId: number): Promise<string> => {
    const response = await api.get(`/files/${fileId}/preview`);
    return response.data.data.preview_url;
  },

  // Uploader des fichiers
  uploadFiles: async (
    taskId: number,
    files: File[],
    description?: string
  ): Promise<TaskFile[]> => {
    const formData = new FormData();
    formData.append("task_id", taskId.toString());
    files.forEach((file) => {
      formData.append("files[]", file);
    });
    if (description) {
      formData.append("description", description);
    }

    const response = await api.post("/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.uploaded_files;
  },

  // Mettre à jour la description d'un fichier
  updateFileDescription: async (
    fileId: number,
    description: string
  ): Promise<TaskFile> => {
    const response = await api.put(`/files/${fileId}`, { description });
    return response.data.data;
  },

  // Supprimer un fichier
  deleteFile: async (fileId: number): Promise<void> => {
    await api.delete(`/files/${fileId}`);
  },

  // Supprimer plusieurs fichiers
  deleteMultipleFiles: async (fileIds: number[]): Promise<void> => {
    await api.delete("/files", { data: { file_ids: fileIds } });
  },

  // Récupérer les statistiques des fichiers
  getStatistics: async (taskId?: number): Promise<any> => {
    const params = taskId ? { task_id: taskId } : {};
    const response = await api.get("/files/statistics", { params });
    return response.data.data;
  },
};

export default taskFileService;
