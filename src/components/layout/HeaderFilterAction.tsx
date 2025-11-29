// HeaderFilterAction.tsx
import React from "react";
import { Eye, Settings2, Bell, HelpCircle } from "lucide-react";
import { useDnd } from "../../context/DndContext";
import type { ViewType } from "../../types";

const HeaderFilterAction: React.FC = () => {
  const { currentView, setCurrentView } = useDnd();

  const views: { id: ViewType; label: string }[] = [
    { id: "tableau", label: "Tableau" },
    { id: "list", label: "List" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Left side: View navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                    currentView === view.id
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded border border-gray-300">
              <Eye size={16} />
              <span>Masquer</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded border border-gray-300">
              <Settings2 size={16} />
              <span>Personnaliser</span>
            </button>

            {/* Icônes d'actions */}
            <div className="flex items-center space-x-3 ml-4">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-300">
                <Bell size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-300">
                <HelpCircle size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg border border-gray-300">
                <Settings2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderFilterAction;