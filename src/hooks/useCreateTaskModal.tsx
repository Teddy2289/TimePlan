// src/hooks/useCreateTaskModal.ts - CORRIGÉ
import { useState, useCallback } from "react";
import type { Task as ApiTask } from "../services/taskService";
import type { User, Task as AppTask } from "../types";

interface UseCreateTaskModalProps {
  projectId: number;
  projectName?: string;
  availableUsers: User[];
  onTaskCreated?: (task: AppTask) => void;
}

export const useCreateTaskModal = ({
  projectId,
  projectName,
  availableUsers,
  onTaskCreated,
}: UseCreateTaskModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] =
    useState<ApiTask["status"]>("backlog");

  const openModal = useCallback((status?: string) => {
    if (status) {
      // Convertir le statut de l'app vers l'API
      const apiStatus = convertAppStatusToApiStatus(status);
      setDefaultStatus(apiStatus);
    }
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setDefaultStatus("backlog");
  }, []);

  // Convertir le statut de l'application vers l'API
  const convertAppStatusToApiStatus = (
    appStatus: string
  ): ApiTask["status"] => {
    const statusMap: Record<string, ApiTask["status"]> = {
      "en-attente": "backlog",
      ouvert: "todo",
      "en-cours": "doing",
      "a-valider": "todo",
      termine: "done",
      backlog: "backlog",
      todo: "todo",
      doing: "doing",
      done: "done",
    };
    return statusMap[appStatus] || "backlog";
  };

  const convertApiTaskToAppTask = (apiTask: ApiTask): AppTask => {
    return {
      id: apiTask.id,
      project_id: apiTask.project_id,
      title: apiTask.title,
      description: apiTask.description || undefined,
      assigned_to: apiTask.assigned_to,
      assignee: apiTask.assigned_user
        ? ({
            id: apiTask.assigned_user.id,
            name: apiTask.assigned_user.name,
            email: apiTask.assigned_user.email,
            initials: apiTask.assigned_user.name.charAt(0).toUpperCase(),
          } as any)
        : undefined,
      status: convertApiStatusToAppStatus(apiTask.status),
      priority: convertApiPriorityToAppPriority(apiTask.priority),
      start_date: apiTask.start_date,
      due_date: apiTask.due_date,
      estimated_time: apiTask.estimated_time || undefined,
      created_at: apiTask.created_at,
      updated_at: apiTask.updated_at,
      tags: apiTask.tags || [],
      subtasks: [],
      comments: apiTask.comments?.length || 0,
      attachments: apiTask.files?.length || 0,
      progress: apiTask.progress,
      is_overdue: apiTask.is_overdue,
      total_worked_time: apiTask.total_worked_time,
    };
  };

  const convertApiStatusToAppStatus = (
    apiStatus: string
  ): AppTask["status"] => {
    const statusMap: Record<string, AppTask["status"]> = {
      backlog: "en-attente",
      todo: "ouvert",
      doing: "en-cours",
      done: "termine",
    };
    return statusMap[apiStatus] || (apiStatus as AppTask["status"]);
  };

  const convertApiPriorityToAppPriority = (
    apiPriority: string
  ): AppTask["priority"] => {
    const priorityMap: Record<string, AppTask["priority"]> = {
      low: "basse",
      medium: "normale",
      high: "elevee",
    };
    return priorityMap[apiPriority] || (apiPriority as AppTask["priority"]);
  };

  const handleTaskCreated = useCallback(
    (apiTask: ApiTask) => {
      const appTask = convertApiTaskToAppTask(apiTask);
      if (onTaskCreated) {
        onTaskCreated(appTask);
      }
      closeModal();
    },
    [onTaskCreated, closeModal]
  );

  return {
    isModalOpen,
    openModal,
    closeModal,
    modalProps: {
      isOpen: isModalOpen,
      onClose: closeModal,
      onSubmit: handleTaskCreated,
      projectId,
      projectName,
      availableUsers,
      defaultStatus, // Maintenant de type ApiTask["status"]
    },
  };
};
