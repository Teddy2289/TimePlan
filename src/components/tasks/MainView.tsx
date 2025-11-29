// MainView.tsx - CORRIGÉ
import React from "react";
import { useDnd } from "../../context/DndContext";
import DndContainer from "./DndContainer";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import GanttView from "./GanttView";

const MainView: React.FC = () => {
  const { currentView } = useDnd();

  const renderView = () => {
    switch (currentView) {
      case "tableau":
        return <DndContainer />;
      case "list":
        return <ListView />;
      case "calendar":
        return <CalendarView />;
      case "gantt":
        return <GanttView />;
      default:
        return <div className="p-6 text-gray-500">Vue non trouvée</div>;
    }
  };

  return <div className="flex-1">{renderView()}</div>; 
};

export default MainView;