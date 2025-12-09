import type {
  MonthlyStats,
  WeeklyStats,
  WorkTime,
  WorkTimeStatus,
  SyncTimeRequest,
} from "../types";
import api from "./api";

class WorkTimeService {
  // Démarrer la journée
  async startDay(): Promise<{
    already_started: any;
    success: boolean;
    message: string;
    data: WorkTime;
  }> {
    const response = await api.post("/work-time/start-day");
    return response.data;
  }

  // Mettre en pause
  async pause(): Promise<{
    success: boolean;
    message: string;
    data: WorkTime;
  }> {
    const response = await api.post("/work-time/pause");
    return response.data;
  }

  // Reprendre le travail
  async resume(): Promise<{
    success: boolean;
    message: string;
    data: WorkTime;
  }> {
    const response = await api.post("/work-time/resume");
    return response.data;
  }

  // Terminer la journée
  async endDay(): Promise<{
    success: boolean;
    message: string;
    data: WorkTime;
  }> {
    const response = await api.post("/work-time/end-day");
    return response.data;
  }

  // Synchroniser le temps avec le backend
  async syncTime(data: SyncTimeRequest): Promise<{
    success: boolean;
    message: string;
    data: WorkTime;
  }> {
    const response = await api.post("/work-time/sync-time", data);
    return response.data;
  }

  // Récupérer le statut actuel
  async getStatus(): Promise<WorkTimeStatus> {
    const response = await api.get("/work-time/status");
    return response.data;
  }

  // Formater le temps (secondes -> HH:MM:SS)
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Obtenir les heures cibles du jour
  getDailyTarget(): number {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 0) return 0; // Dimanche
    if (dayOfWeek === 6) return 4; // Samedi
    return 8; // Lundi à Vendredi
  }
}

export default new WorkTimeService();
