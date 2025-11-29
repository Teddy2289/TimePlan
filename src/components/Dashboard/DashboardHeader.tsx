import React from "react";
import { Search, Plus, LayoutGrid, List, Calendar } from "lucide-react";

interface DashboardHeaderProps {
  viewMode: "board" | "list" | "calendar";
  onViewModeChange: (mode: "board" | "list" | "calendar") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTaskCreate: () => void;
  taskCount: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  onTaskCreate,
  taskCount,
}) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {taskCount} tâche{taskCount !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Rechercher une tâche..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>

          {/* Sélecteur de vue */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("board")}
              className={`p-2 ${
                viewMode === "board"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={`p-2 border-l border-r border-gray-300 ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}>
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange("calendar")}
              className={`p-2 ${
                viewMode === "calendar"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}>
              <Calendar className="h-4 w-4" />
            </button>
          </div>

          {/* Bouton de création */}
          <button
            onClick={onTaskCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent text-xs text-sm rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle tâche
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
