// src/pages/ProjectDetail.tsx - CORRIGÉ
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import MainView from "../components/tasks/MainView";
import { useDnd } from "../context/DndContext";
import HeaderFilterAction from "../components/layout/HeaderFilterAction";
import { Loader2 } from "lucide-react";
import type { ProjectTeam, Task, ApiTask, User } from "../types";
import projectsTeamsService from "../services/projectsTeamsService";
import taskService from "../services/taskService";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import { useCreateTaskModal } from "../hooks/useCreateTaskModal";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<ProjectTeam | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectUsers, setProjectUsers] = useState<User[]>([]);

  const { setTasks, tasks: contextTasks } = useDnd();

  useEffect(() => {
    const fetchData = async () => {
      const isNumericId = /^\d+$/.test(projectId || "");
      if (!isNumericId) {
        setError("Projet non trouvé");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await Promise.all([
          fetchProjectDetails(),
          fetchTasks(),
          fetchProjectUsers(),
        ]);
      } catch (err) {
        console.error("Error fetching project data:", err);
        setError("Impossible de charger les données du projet");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const fetchProjectUsers = async () => {
    if (!projectId || !/^\d+$/.test(projectId)) return;

    try {
      const users = await projectsTeamsService.getProjectTeamUsers(
        parseInt(projectId)
      );
      setProjectUsers(users);
    } catch (error) {
      console.error("Error fetching project users:", error);
      try {
        const users = await taskService.getTeamMembers(parseInt(projectId));
        setProjectUsers(users);
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    }
  };

  // Utiliser UN SEUL hook pour gérer le modal
  const createTaskModalHook = useCreateTaskModal({
    projectId: projectId ? parseInt(projectId) : 0,
    projectName: project?.name,
    availableUsers: projectUsers,
    onTaskCreated: (newTask) => {
      setTasks([...contextTasks, newTask]);
    },
  });

  const fetchProjectDetails = async () => {
    if (!projectId || !/^\d+$/.test(projectId)) return;

    try {
      const projectData = await projectsTeamsService.getProjectWithTeam(
        parseInt(projectId)
      );
      setProject(projectData);

      if (projectData.team_members && projectData.team_members.length > 0) {
        setProjectUsers(projectData.team_members);
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      try {
        const projectData = await projectsTeamsService.getProjectById(
          parseInt(projectId)
        );
        setProject(projectData);
      } catch (fallbackError) {
        setError("Impossible de charger les détails du projet");
      }
    }
  };

  const fetchTasks = async () => {
    if (!projectId || !/^\d+$/.test(projectId)) return;

    try {
      setTasksLoading(true);
      const tasks = await taskService.getProjectTasks(parseInt(projectId));
      const transformedTasks: Task[] = tasks.map((task: ApiTask) => {
        const assigneeData = task.assigned_user
          ? ({
              id: task.assigned_user.id,
              name: task.assigned_user.name,
              email: task.assigned_user.email,
              initials: task.assigned_user.name.charAt(0).toUpperCase(),
            } as any)
          : undefined;

        return {
          id: task.id,
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
          createdAt: new Date(task.created_at),
          updatedAt: new Date(task.updated_at),
        };
      });

      setTasks(transformedTasks);
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

  // Fonction pour ouvrir le modal
  const handleOpenCreateModal = (status?: string) => {
    createTaskModalHook.openModal(status);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        <HeaderFilterAction
          projectName={project?.name || "Projet"}
          onAddTask={() => handleOpenCreateModal()}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
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
                    <span>Membres: {projectUsers.length}</span>
                    {tasksLoading && (
                      <Loader2 className="animate-spin h-3 w-3 text-blue-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Passer la fonction d'ouverture du modal au MainView */}
            <MainView onOpenCreateModal={handleOpenCreateModal} />
          </div>
        </div>
        {/* UN SEUL MODAL pour la création de tâche */}
        <CreateTaskModal {...createTaskModalHook.modalProps} />
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
