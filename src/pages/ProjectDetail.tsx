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
    aopia: { name: "AOPIA & LIKEFORMA", color: "bg-purple-500" },
    "hotel-thailand": { name: "Hotel Thaïlande", color: "bg-blue-500" },
    "wizi-learn": { name: "WIZI-LEARN, web-app", color: "bg-green-500" },
    graphiste: { name: "Graphiste", color: "bg-yellow-500" },
    test: { name: "Test", color: "bg-red-500" },
    notes: { name: "Project Notes", color: "bg-indigo-500" },
  };

  const project = projectData[projectId as keyof typeof projectData] || {
    name: "Projet",
    color: "bg-gray-500",
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header fixe */}
        <HeaderFilterAction />
        
        {/* Zone de contenu avec défilement seulement ici */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* En-tête du projet */}
            <div className="flex items-center space-x-3 mb-6 sticky top-0 bg-gray-50 py-4 z-10">
              <div className={`w-4 h-4 ${project.color} rounded-full`}></div>
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            </div>

            {/* Vue principale (Tableau, List, Calendar, Gantt) */}
            <MainView />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;