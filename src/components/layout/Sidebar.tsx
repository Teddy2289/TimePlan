import React, { useState } from "react";
import {
  Home,
  MoreHorizontal,
  Star,
  ChevronRight,
  ChevronDown,
  Plus,
  Settings,
  Briefcase,
  Building,
  Globe,
  Palette,
  FileText,
  TestTube,
  Users,
  BookOpen,
  Hotel,
  Cpu,
  CheckSquare,
  Calendar,
  BarChart,
} from "lucide-react";
import { useNavigation } from "../../hooks/useNavigation";
import CreateSpaceModal from "../spaces/CreateSpaceModal";

const Sidebar: React.FC = () => {
  const { navigateTo, isActiveRoute, navigationRoutes } = useNavigation();
  const [isTeamSpaceOpen, setIsTeamSpaceOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [isCreateSpaceModalOpen, setIsCreateSpaceModalOpen] = useState(false);

  // Données des projets avec leurs icônes et chemins
  const projects = [
    {
      id: "aopia",
      name: "AOPIA & LIKEFORMA...",
      count: 13,
      icon: Building,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      path: "/projects/aopia",
    },
    {
      id: "hotel-thailand",
      name: "Hotel Thaïlande",
      count: 5,
      icon: Hotel,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      path: "/projects/hotel-thailand",
    },
    {
      id: "wizi-learn",
      name: "WIZI-LEARN, web-app",
      count: 19,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100",
      path: "/projects/wizi-learn",
    },
    {
      id: "graphiste",
      name: "Graphiste",
      count: 5,
      icon: Palette,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      path: "/projects/graphiste",
    },
    {
      id: "test",
      name: "Test",
      count: null,
      icon: TestTube,
      color: "text-red-600",
      bgColor: "bg-red-100",
      path: "/projects/test",
    },
    {
      id: "project-notes",
      name: "Project Notes",
      count: null,
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      path: "/projects/notes",
    },
    {
      id: "tech",
      name: "Tech Team",
      count: 8,
      icon: Cpu,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      path: "/projects/tech",
    },
    {
      id: "marketing",
      name: "Marketing",
      count: 12,
      icon: Globe,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      path: "/projects/marketing",
    },
  ];

  const toggleTeamSpace = () => {
    setIsTeamSpaceOpen(!isTeamSpaceOpen);
  };

  const toggleProjects = () => {
    setIsProjectsOpen(!isProjectsOpen);
  };

  const handleProjectClick = (path: string) => {
    navigateTo(path);
  };

  // Remplacer les icônes de navigation génériques
  const getRouteIcon = (label: string) => {
    switch (label) {
      case "Accueil":
        return Home;
      case "Tableau de bord":
        return Briefcase;
      case "Projet":
        return Users;
      case "Tâches":
        return CheckSquare;
      case "Calendrier":
        return Calendar;
      case "Fichiers":
        return FileText;
      case "Rapports":
        return BarChart;
      case "Paramètres":
        return Settings;
      default:
        return Home;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto flex flex-col">
      {/* En-tête M. MBL Service */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900 mb-4">M. MBL Service</h1>

        {/* Navigation principale */}
        <div className="space-y-1">
          {navigationRoutes.map((route) => {
            const IconComponent = getRouteIcon(route.label);
            return (
              <div
                key={route.path}
                onClick={() => navigateTo(route.path)}
                className={`flex items-center space-x-3 py-2 px-3 rounded cursor-pointer transition-colors ${
                  isActiveRoute(route.path)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}>
                <IconComponent
                  size={18}
                  className={
                    isActiveRoute(route.path)
                      ? "text-blue-600"
                      : "text-gray-500"
                  }
                />
                <span className="text-xs font-medium">{route.label}</span>
              </div>
            );
          })}

          {/* Plus */}
          <div className="flex items-center space-x-3 py-2 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
            <MoreHorizontal size={18} className="text-gray-500" />
            <span className="text-xs font-medium">Plus</span>
          </div>
        </div>
      </div>

      {/* Section Favoris et Espaces */}
      <div className="p-4 border-b border-gray-200">
        {/* Favoris */}
        <div className="flex items-center justify-between py-2 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors mb-2">
          <div className="flex items-center space-x-3">
            <Star size={16} className="text-gray-500" />
            <span className="text-xs font-medium">Favoris</span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </div>

        {/* Espaces */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Espaces
            </h3>
            <div className="flex space-x-1">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreHorizontal size={14} className="text-gray-500" />
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                onClick={() => setIsCreateSpaceModalOpen(true)}>
                <Plus size={14} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Tout */}
          <div className="flex items-center space-x-3 py-1 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
            <div className="w-6 h-6 flex items-center justify-center">
              <Globe size={14} className="text-gray-500" />
            </div>
            <span className="text-xs">Tout</span>
          </div>

          {/* Team Space - Accordéon */}
          <div className="space-y-1">
            <div
              onClick={toggleTeamSpace}
              className="flex items-center space-x-3 py-1 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <Users size={14} className="text-blue-600" />
              </div>
              <span className="text-xs">Team Space</span>
              <div className="flex space-x-1 ml-auto items-center">
                <button
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action pour les points de suspension
                  }}>
                  <MoreHorizontal size={12} className="text-gray-500" />
                </button>
                <button
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Action pour le plus
                  }}>
                  <Plus size={12} className="text-gray-500" />
                </button>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform ${
                    isTeamSpaceOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </div>
            </div>

            {/* Contenu de Team Space (collapsible) */}
            {isTeamSpaceOpen && (
              <div className="ml-6 space-y-1">
                {/* Projets - Sous-accordéon */}
                <div className="space-y-1">
                  <div
                    onClick={toggleProjects}
                    className="flex items-center space-x-3 py-1 px-3 text-gray-700 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                    <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                      <Briefcase size={14} className="text-green-600" />
                    </div>
                    <span className="text-xs">Projets</span>
                    <div className="flex space-x-1 ml-auto items-center">
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <MoreHorizontal size={12} className="text-gray-500" />
                      </button>
                      <button
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}>
                        <Plus size={12} className="text-gray-500" />
                      </button>
                      <ChevronDown
                        size={14}
                        className={`text-gray-500 transition-transform ${
                          isProjectsOpen ? "rotate-0" : "-rotate-90"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Liste des projets (collapsible) */}
                  {isProjectsOpen && (
                    <div className="ml-6 space-y-1">
                      {projects.map((project) => {
                        const ProjectIcon = project.icon;
                        return (
                          <div
                            key={project.id}
                            onClick={() => handleProjectClick(project.path)}
                            className={`flex items-center justify-between py-1 px-3 rounded cursor-pointer transition-colors ${
                              isActiveRoute(project.path)
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-6 h-6 ${project.bgColor} rounded flex items-center justify-center`}>
                                <ProjectIcon
                                  size={14}
                                  className={project.color}
                                />
                              </div>
                              <span className="text-xs">{project.name}</span>
                            </div>
                            {project.count && (
                              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                {project.count}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bouton Créer un espace */}
        <div
          onClick={() => setIsCreateSpaceModalOpen(true)}
          className="flex items-center space-x-3 py-2 px-3 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors mt-2">
          <Plus size={16} className="text-blue-600" />
          <span className="text-xs font-medium">Créer un espace</span>
        </div>

        {/* Modal de création d'espace */}
        {isCreateSpaceModalOpen && (
          <CreateSpaceModal
            isOpen={isCreateSpaceModalOpen}
            onClose={() => setIsCreateSpaceModalOpen(false)}
            onCreateSpace={(spaceData) => {
              console.log("Espace créé:", spaceData);
              // Ajouter ici la logique pour créer l'espace
            }}
          />
        )}
      </div>

      {/* Section basse avec boutons */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex space-x-2 mb-2">
          <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center">
            <Users size={14} className="mr-2" />
            <span>Inviter</span>
          </button>
          <button
            onClick={() => navigateTo("/settings")}
            className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
            <span>Aide</span>
          </button>
        </div>

        {/* Profile utilisateur */}
        <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-medium">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              John Doe
            </p>
            <p className="text-xs text-gray-500 truncate">Administrateur</p>
          </div>
          <Settings
            size={16}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
