// MainView.tsx - version corrigée
import React from "react";
import { useDnd } from "../../context/DndContext";
import DndContainer from "./DndContainer";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import type { Task } from "../../types";

interface MainViewProps {
  projectTasks?: Task[];
  onOpenCreateModal?: (status?: string) => void; // Ajout de cette prop
}

const MainView: React.FC<MainViewProps> = ({
  projectTasks = [],
  onOpenCreateModal,
}) => {
  const { currentView, setTasks, tasks: contextTasks } = useDnd();

  // Synchroniser les tâches du projet avec le contexte si nécessaire
  React.useEffect(() => {
    if (projectTasks.length > 0) {
      // Convertir les statuts de l'API vers votre application
      const convertedTasks = projectTasks.map((task) => ({
        ...task,
        status: convertApiStatusToAppStatus(task.status),
      }));
      setTasks(convertedTasks);
    }
  }, [projectTasks, setTasks]);

  const convertApiStatusToAppStatus = (
    apiStatus: string
  ):
    | "en-attente"
    | "ouvert"
    | "en-cours"
    | "a-valider"
    | "termine"
    | "backlog"
    | "todo"
    | "doing"
    | "done" => {
    const statusMap: Record<
      string,
      | "en-attente"
      | "ouvert"
      | "en-cours"
      | "a-valider"
      | "termine"
      | "backlog"
      | "todo"
      | "doing"
      | "done"
    > = {
      backlog: "en-attente",
      todo: "ouvert",
      doing: "en-cours",
      done: "termine",
      "en-attente": "en-attente",
      ouvert: "ouvert",
      "en-cours": "en-cours",
      "a-valider": "a-valider",
      termine: "termine",
    };

    // fallback to a valid status or default to "en-attente"
    return statusMap[apiStatus] ?? "en-attente";
  };

  const renderView = () => {
    switch (currentView) {
      case "tableau":
        return <DndContainer onOpenCreateModal={onOpenCreateModal} />; // Passage de la prop
      case "list":
        return <ListView onOpenCreateModal={onOpenCreateModal} />;
      case "calendar":
        return <CalendarView onOpenCreateModal={onOpenCreateModal} />;

      default:
        return <div className="p-6 text-gray-500">Vue non trouvée</div>;
    }
  };

  return <div className="flex-1">{renderView()}</div>;
};

export default MainView;
