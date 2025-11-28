import React from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

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
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-4 h-4 bg-${project.color}-500 rounded-full`}></div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-gray-600">
            Page de détail du projet {project.name}. Ici vous pouvez gérer
            toutes les tâches et ressources de ce projet.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProjectDetail;
