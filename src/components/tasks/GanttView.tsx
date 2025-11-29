// GanttView.tsx - CORRIGÉ
import React from "react";
import { useDnd } from "../../context/DndContext";

const GanttView: React.FC = () => {
  const { tasks } = useDnd();

  // Dates de référence pour le diagramme de Gantt
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2024-01-31");

  // Fonction sécurisée pour obtenir la position
  const getTaskPosition = (task: any) => {
    try {
      // S'assurer que createdAt est une Date valide
      const taskDate = task.createdAt instanceof Date 
        ? task.createdAt 
        : new Date(task.createdAt);
      
      // Calculer le nombre de jours depuis le début
      const startDiff = taskDate.getTime() - startDate.getTime();
      const daysFromStart = Math.max(0, startDiff / (1000 * 60 * 60 * 24));
      
      // Durée par défaut de 7 jours
      const duration = 7;
      
      // Calculer le pourcentage de largeur (max 100%)
      const widthPercent = Math.min((duration / 31) * 100, 100);
      
      return {
        start: daysFromStart,
        duration: duration,
        width: widthPercent,
      };
    } catch (error) {
      console.error("Erreur dans getTaskPosition pour la tâche:", task.id, error);
      return {
        start: 0,
        duration: 7,
        width: 22.5, // 7/31 * 100
      };
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* En-tête du diagramme de Gantt */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Diagramme de Gantt</h2>
          <p className="text-sm text-gray-500 mt-1">
            Vue d'ensemble de l'avancement des tâches
          </p>
        </div>

        {/* Légende de la timeline */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-64 p-3 border-r border-gray-200 font-medium text-sm">
            Tâches
          </div>
          <div className="flex-1 grid grid-cols-31 text-xs">
            {Array.from({ length: 31 }, (_, i) => (
              <div 
                key={i} 
                className="p-2 border-r border-gray-200 text-center font-medium"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Tâches */}
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const position = getTaskPosition(task);
            
            return (
              <div 
                key={task.id} 
                className="flex items-center hover:bg-gray-50 transition-colors"
              >
                {/* Nom de la tâche */}
                <div className="w-64 p-3 border-r border-gray-200 flex-shrink-0">
                  <div className="font-medium text-sm text-gray-900">
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Assigné à: {task.assignee} | {task.status}
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="flex-1 relative h-16 px-2">
                  <div
                    className="absolute h-6 bg-blue-500 rounded top-1/2 transform -translate-y-1/2 flex items-center px-2"
                    style={{
                      left: `${(position.start / 31) * 100}%`,
                      width: `${position.width}%`,
                      minWidth: '40px' // Largeur minimale pour être visible
                    }}
                  >
                    <span className="text-xs text-white font-medium truncate">
                      {task.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttView;