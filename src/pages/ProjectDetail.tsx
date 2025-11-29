// ProjectDetail.tsx
import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import MainView from "../components/tasks/MainView";
import { useDnd } from "../context/DndContext";
import HeaderFilterAction from "../components/layout/HeaderFilterAction";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  console.log("ProjectDetail render - projectId:", projectId); // DEBUG

  const projectData = {
    aopia: { name: "AOPIA & LIKEFORMA", color: "purple" },
    "hotel-thailand": { name: "Hotel Thaïlande", color: "blue" },
    "wizi-learn": { name: "WIZI-LEARN, web-app", color: "green" },
    graphiste: { name: "Graphiste", color: "yellow" },
    test: { name: "Test", color: "red" },
    notes: { name: "Project Notes", color: "indigo" },
  };

  const project = projectData[projectId as keyof typeof projectData] || {
    name: "Projet",
    color: "gray",
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header avec navigation par onglets */}
        <HeaderFilterAction />
        
        {/* Contenu du projet */}
        <div className="flex-1 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-4 h-4 bg-${project.color}-500 rounded-full`}></div>
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          </div>

          {/* Vue principale (Tableau, List, Calendar, Gantt) */}
          <MainView />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;