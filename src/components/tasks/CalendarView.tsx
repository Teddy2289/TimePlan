// CalendarView.tsx - CORRIGÉ
import React from "react";
import { useDnd } from "../../context/DndContext";
import { Calendar as CalendarIcon } from "lucide-react";

const CalendarView: React.FC = () => {
  const { tasks } = useDnd();

  // Exemple simple d'un calendrier mensuel
  const daysInMonth = 31;
  const startDay = 3; // Mercredi

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Janvier 2024</h2>
          <div className="flex items-center space-x-4">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Aujourd'hui
            </button>
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded">‹</button>
              <button className="p-1 hover:bg-gray-100 rounded">›</button>
            </div>
          </div>
        </div>

        {/* En-têtes des jours */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDay }, (_, i) => (
            <div key={`empty-${i}`} className="h-24 border border-gray-100" />
          ))}
          
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            // CORRECTION : Filtrage plus robuste
            const dayTasks = tasks.filter((task) => {
              try {
                const taskDate = new Date(task.createdAt);
                return taskDate.getDate() === day && taskDate.getMonth() === 0; // Janvier = mois 0
              } catch (error) {
                console.error("Erreur de date pour la tâche:", task.id, error);
                return false;
              }
            });

            return (
              <div
                key={day}
                className="h-24 border border-gray-200 p-1 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-900">{day}</span>
                  {dayTasks.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                      {dayTasks.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1 max-h-16 overflow-y-auto">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs p-1 bg-blue-50 text-blue-700 rounded truncate"
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayTasks.length - 3} plus
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;