import { useState, useEffect } from "react";
import projectsTeamsService from "../services/projectsTeamsService";
import type { ProjectTeam } from "../types";

export const useTeamProjects = (teamId?: string | number) => {
  const [projects, setProjects] = useState<ProjectTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamProjects = async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectsTeamsService.getTeamProjects(id);
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching team projects:", err);
      setError("Impossible de charger les projets de l'équipe");
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = async () => {
    if (teamId) {
      await fetchTeamProjects(teamId);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTeamProjects(teamId);
    }
  }, [teamId]);

  return { projects, loading, error, refreshProjects };
};
