// HeaderFilterAction.tsx
import React from "react";
import {
  Eye,
  Settings2,
  Bell,
  HelpCircle,
  Grid,
  List,
  Calendar,
} from "lucide-react";
import { useDnd } from "../../context/DndContext";
import type { ViewType } from "../../types";

interface HeaderFilterActionProps {
  projectName?: string;
  onAddTask?: () => void;
}
const HeaderFilterAction: React.FC<HeaderFilterActionProps> = ({
  projectName,
}) => {
  const { currentView, setCurrentView } = useDnd();

  const views: { id: ViewType; label: string; icon: React.ReactNode }[] = [
    { id: "tableau", label: "Tableau", icon: <Grid size={14} /> },
    { id: "list", label: "Liste", icon: <List size={14} /> },
    { id: "calendar", label: "Calendrier", icon: <Calendar size={14} /> },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side: View navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`
                    px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200
                    flex items-center space-x-2 min-w-[100px] justify-center
                    ${
                      currentView === view.id
                        ? "bg—[#E1AF30] border border-[#E1AF30] shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                    }
                  `}>
                  <span className="opacity-80">{view.icon}</span>
                  <span>{view.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
              <Eye size={16} className="opacity-70" />
              <span>Masquer</span>
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
              <Settings2 size={16} className="opacity-70" />
              <span>Personnaliser</span>
            </button>

            {/* Icônes d'actions */}
            <div className="flex items-center space-x-2 ml-2 border-l border-gray-200 pl-4">
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:border-gray-300">
                <Bell size={18} className="opacity-70" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:border-gray-300">
                <HelpCircle size={18} className="opacity-70" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors hover:border-gray-300">
                <Settings2 size={18} className="opacity-70" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderFilterAction;
