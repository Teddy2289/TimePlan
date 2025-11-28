import React from "react";
import { Eye, Settings2, Bell, HelpCircle } from "lucide-react";

const HeaderFilterAction: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      {/* Première ligne : Navigation des vues */}
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {/* Left side: View navigation */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1">
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
                Tableau
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
                List
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
                Calendar
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
                二Gantt
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
                @Table
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                Vue
              </button>
            </div>
          </div>

          {/* Right side: Actions */}
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
              <Eye size={16} />
              <span>Masquer</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded">
              <Settings2 size={16} />
              <span>Personnaliser</span>
            </button>

            {/* Icônes d'actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Bell size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <HelpCircle size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
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
