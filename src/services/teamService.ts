// src/services/teamService.ts
import type {
  CreateTeamRequest,
  PaginatedResponse,
  Team,
  TeamMember,
  TeamStatistics,
  UpdateTeamRequest,
} from "../types";
import api from "./api";

class TeamService {
  // Routes publiques (sans token)
  async getPublicTeams(params?: {
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Team>> {
    const response = await api.get("/teams/public", { params });
    return response.data;
  }

  async getTeamById(id: string): Promise<Team> {
    const response = await api.get(`/teams/${id}`);
    return response.data;
  }

  async searchPublicTeams(criteria: {
    search?: string;
    is_public?: boolean;
  }): Promise<PaginatedResponse<Team>> {
    const response = await api.post("/teams/search", criteria);
    return response.data;
  }

  // Routes protégées (avec token)
  async createTeam(teamData: CreateTeamRequest): Promise<Team> {
    // Envoyer explicitement l'owner_id dans la payload
    const response = await api.post("/teamsCrud", teamData);
    return response.data;
  }

  async updateTeam(id: string, teamData: UpdateTeamRequest): Promise<Team> {
    const response = await api.put(`/teamsCrud/${id}`, teamData);
    return response.data;
  }

  async deleteTeam(id: string): Promise<void> {
    await api.delete(`/teamsCrud/${id}`);
  }

  async getMyTeams(): Promise<Team[]> {
    const response = await api.get("/teamsCrud/user/my-teams");
    return response.data;
  }

  async getTeamsByOwner(ownerId: string | number): Promise<Team[]> {
    const response = await api.get(`/teamsCrud/owner/${ownerId}`);
    return response.data;
  }

  // Gestion des membres
  async addMember(
    teamId: string | number,
    userId: string | number
  ): Promise<void> {
    const response = await api.post(`/teamsCrud/${teamId}/members`, {
      user_id: userId,
    });
    return response.data;
  }

  async removeMember(
    teamId: string | number,
    userId: string | number
  ): Promise<void> {
    const response = await api.delete(`/teamsCrud/${teamId}/members`, {
      data: { user_id: userId },
    });
    return response.data;
  }

  async getMembers(teamId: string | number): Promise<TeamMember[]> {
    const response = await api.get(`/teamsCrud/${teamId}/members`);
    return response.data;
  }

  // Autres opérations
  async transferOwnership(
    teamId: string,
    newOwnerId: string | number
  ): Promise<Team> {
    const response = await api.post(`/teamsCrud/${teamId}/transfer-ownership`, {
      new_owner_id: newOwnerId,
    });
    return response.data;
  }

  async getStatistics(teamId: string | number): Promise<TeamStatistics> {
    const response = await api.get(`/teamsCrud/${teamId}/statistics`);
    return response.data;
  }

  async checkOwnership(
    teamId: string | number
  ): Promise<{ is_owner: boolean }> {
    const response = await api.get(`/teamsCrud/${teamId}/check-ownership`);
    return response.data;
  }

  async checkMembership(
    teamId: string | number
  ): Promise<{ is_member: boolean }> {
    const response = await api.get(`/teamsCrud/${teamId}/check-membership`);
    return response.data;
  }

  async advancedSearch(criteria: any): Promise<PaginatedResponse<Team>> {
    const response = await api.post("/teamsCrud/search/advanced", criteria);
    return response.data;
  }

  // Méthodes utilitaires
  mapPermissionToAccessLevel(permission: string): "edit" | "comment" | "view" {
    switch (permission) {
      case "edit":
        return "edit";
      case "comment":
        return "comment";
      case "view":
        return "view";
      default:
        return "edit";
    }
  }

  formatTeamRequest(
    formData: {
      name: string;
      icon?: string;
      description?: string;
      permission: string;
      isPrivate: boolean;
      useTemplates: boolean;
    },
    ownerId: string | number // Ajouter ownerId en paramètre
  ): CreateTeamRequest {
    return {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      owner_id: ownerId, // Inclure l'owner_id
      is_public: !formData.isPrivate,
    };
  }

  // Vérifier le format de l'ID (string vs number)
  normalizeId(id: string | number): string | number {
    // Si c'est un nombre, le garder comme nombre
    // Si c'est une chaîne qui représente un nombre, convertir en nombre
    if (typeof id === "string" && !isNaN(Number(id))) {
      return Number(id);
    }
    return id;
  }
}
export default new TeamService();
