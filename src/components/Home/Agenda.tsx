import React from "react";
import { Calendar } from "lucide-react";

const Agenda: React.FC = () => {
  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Agenda</h2>

      {/* Date header */}
      <div className="flex items-center space-x-2 mb-4">
        <Calendar size={18} className="text-gray-500" />
        <span className="text-lg font-medium text-gray-900">FON. 25, VOT.</span>
      </div>

      {/* Placeholder for calendar/agenda */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mb-6">
        <div className="text-gray-500 font-medium mb-2">[Agionchat]</div>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Les éléments à l'ordre du jour dans vos côtendiers s'attribuent ici.
        </p>
        <button className="text-blue-600 text-sm font-medium hover:text-blue-700 mt-2">
          En savoir plus.
        </button>
      </div>

      {/* Task item */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start space-x-3">
          <div className="w-4 h-4 border-2 border-gray-400 rounded-sm mt-1 flex-shrink-0"></div>
          <div>
            <span className="text-gray-900 font-medium">
              Ajuster des intégrations de caractères
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
