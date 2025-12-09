import { useState, useEffect } from "react";
import teamService from "../services/teamService";
import type { Team } from "../types";

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les équipes publiques
      const response = await teamService.getPublicTeams();
      setTeams(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Impossible de charger les équipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return { teams, loading, error, refreshTeams: fetchTeams };
};
