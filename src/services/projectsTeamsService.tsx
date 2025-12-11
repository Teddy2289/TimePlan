// src/services/projectsTeamsService.ts
import type {
  ProjectTeam,
  CreateProjectTeamRequest,
  UpdateProjectTeamRequest,
  PaginatedResponse,
  User,
} from "../types";
import api from "./api";

class ProjectsTeamsService {
  // Routes publiques
  async getTeamProjects(
    teamId: string | number
  ): Promise<PaginatedResponse<ProjectTeam>> {
    const response = await api.get(`/projectsTeams/team/${teamId}`);
    return response.data;
  }

  async getAllProjects(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<ProjectTeam>> {
    const response = await api.get("/projectsTeams", { params });
    return response.data;
  }

  async searchProjects(criteria: {
    search?: string;
    team_id?: string | number;
    status?: string;
  }): Promise<PaginatedResponse<ProjectTeam>> {
    const response = await api.get("/projectsTeams/search", {
      params: criteria,
    });
    return response.data;
  }

  async getProjectsByStatus(
    status: string
  ): Promise<PaginatedResponse<ProjectTeam>> {
    const response = await api.get(`/projectsTeams/status/${status}`);
    return response.data;
  }

  async getUpcomingProjects(): Promise<PaginatedResponse<ProjectTeam>> {
    const response = await api.get("/projectsTeams/upcoming");
    return response.data;
  }

  async getStatistics(): Promise<any> {
    const response = await api.get("/projectsTeams/statistics");
    return response.data;
  }

  // Routes protégées (avec authentification)
  async getProjectById(id: string | number): Promise<ProjectTeam> {
    const response = await api.get(`/projectsTeams/${id}`);
    return response.data;
  }

  async createProject(
    projectData: CreateProjectTeamRequest
  ): Promise<ProjectTeam> {
    const response = await api.post("/projectsTeams", projectData);
    return response.data;
  }

  async updateProject(
    id: string | number,
    projectData: UpdateProjectTeamRequest
  ): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}`, projectData);
    return response.data;
  }

  async deleteProject(id: string | number): Promise<void> {
    await api.delete(`/projectsTeams/${id}`);
  }

  // Gestion du statut
  async updateStatus(
    id: string | number,
    status: string
  ): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}/status`, { status });
    return response.data;
  }

  async completeProject(id: string | number): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}/complete`);
    return response.data;
  }

  async putOnHold(id: string | number): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}/on-hold`);
    return response.data;
  }

  async cancelProject(id: string | number): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}/cancel`);
    return response.data;
  }

  async reactivateProject(id: string | number): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}/reactivate`);
    return response.data;
  }

  async restoreProject(id: string | number): Promise<ProjectTeam> {
    const response = await api.put(`/projectsTeams/${id}/restore`);
    return response.data;
  }

  async checkTeamMembership(
    projectId: string | number,
    teamId: string | number
  ): Promise<{ is_member: boolean }> {
    const response = await api.get(
      `/projectsTeams/${projectId}/check-team/${teamId}`
    );
    return response.data;
  }

  // Méthodes utilitaires
  getStatusColor(status: string): string {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "active":
        return "Actif";
      case "completed":
        return "Terminé";
      case "on_hold":
        return "En attente";
      case "cancelled":
        return "Annulé";
      default:
        return status;
    }
  }

  formatProjectDate(date: string): string {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  async getProjectTeamUsers(projectId: string | number): Promise<User[]> {
    try {
      const response = await api.get(`/projectsTeams/${projectId}/team-users`);
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching team users for project ${projectId}:`,
        error
      );
      throw error;
    }
  }

  // Récupérer les utilisateurs assignables pour un projet
  async getAssignableUsers(projectId: string | number): Promise<User[]> {
    try {
      const response = await api.get(
        `/projectsTeams/${projectId}/assignable-users`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching assignable users for project ${projectId}:`,
        error
      );
      throw error;
    }
  }

  // Récupérer un projet avec les détails de l'équipe
  async getProjectWithTeam(id: string | number): Promise<ProjectTeam> {
    try {
      const response = await api.get(`/projectsTeams/${id}/with-team`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching project ${id} with team details:`, error);
      throw error;
    }
  }
}

export default new ProjectsTeamsService();
