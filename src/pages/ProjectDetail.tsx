// ProjectDetail.tsx - version corrigée
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import MainView from "../components/tasks/MainView";
import { useDnd } from "../context/DndContext";
import HeaderFilterAction from "../components/layout/HeaderFilterAction";
import { Loader2, AlertCircle } from "lucide-react";
import type { ProjectTeam, Task, ApiTask } from "../types";
import projectsTeamsService from "../services/projectsTeamsService";
import taskService from "../services/taskService";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setTasks, tasks: contextTasks } = useDnd();

  useEffect(() => {
    const fetchData = async () => {
      const isNumericId = /^\d+$/.test(projectId || "");

      if (isNumericId) {
        await fetchProjectDetails();
        await fetchTasks();
      } else {
        setError("Projet non trouvé");
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const projectData = await projectsTeamsService.getProjectById(
        parseInt(projectId!)
      );
      console.log("Fetched project data:", projectData);
      setProject(projectData);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Impossible de charger les détails du projet");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    if (!projectId || !/^\d+$/.test(projectId)) return;

    try {
      setTasksLoading(true);
      const tasks = await taskService.getProjectTasks(parseInt(projectId));
      console.log("Tâches récupérées:", tasks);

      // Correction: Créer un objet Task compatible
      const transformedTasks: Task[] = tasks.map((task: ApiTask) => {
        // Créer un objet assignee simple avec seulement les propriétés nécessaires
        const assigneeData = task.assigned_user
          ? ({
              id: task.assigned_user.id,
              name: task.assigned_user.name,
              email: task.assigned_user.email,
              initials: task.assigned_user.name.charAt(0).toUpperCase(),
            } as any)
          : undefined;

        return {
          id: task.id, // Garder comme number
          project_id: task.project_id,
          title: task.title,
          description: task.description || undefined,
          assigned_to: task.assigned_to,
          assignee: assigneeData,
          status: convertApiStatusToAppStatus(task.status),
          priority: convertApiPriorityToAppPriority(task.priority),
          start_date: task.start_date,
          due_date: task.due_date,
          estimated_time: task.estimated_time || undefined,
          created_at: task.created_at,
          updated_at: task.updated_at,
          tags: task.tags || [],
          subtasks: [],
          comments: task.comments?.length || 0,
          attachments: task.files?.length || 0,
          progress: task.progress,
          is_overdue: task.is_overdue,
          total_worked_time: task.total_worked_time,
          // Pour compatibilité
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
        };
      });

      setTasks(transformedTasks);
      console.log("Tâches transformées:", transformedTasks);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  const convertApiStatusToAppStatus = (apiStatus: string): Task["status"] => {
    const statusMap: Record<string, Task["status"]> = {
      backlog: "en-attente",
      todo: "ouvert",
      doing: "en-cours",
      done: "termine",
    };
    return statusMap[apiStatus] || (apiStatus as Task["status"]);
  };

  const convertApiPriorityToAppPriority = (
    apiPriority: string
  ): Task["priority"] => {
    const priorityMap: Record<string, Task["priority"]> = {
      low: "basse",
      medium: "normale",
      high: "elevee",
    };
    return priorityMap[apiPriority] || (apiPriority as Task["priority"]);
  };

  // ... reste du code inchangé

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        <HeaderFilterAction projectName={project?.name || "Projet"} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-4 h-4 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {project?.name || "Projet"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {project?.description || "Pas de description"}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Tâches: {contextTasks.length}</span>
                    {tasksLoading && (
                      <Loader2 className="animate-spin h-3 w-3 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vue principale */}
            <MainView />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
