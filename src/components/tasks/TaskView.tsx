import React from "react";
import { useDnd } from "../../context/DndContext";

const TaskView: React.FC = () => {
  const { selectedTask, isTaskViewOpen, handleCloseTaskView } = useDnd();

  if (!isTaskViewOpen || !selectedTask) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedTask.title}
          </h2>
          <button
            onClick={handleCloseTaskView}
            className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">
                {selectedTask.description || "Aucune description"}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Statut</h3>
              <p className="text-gray-600 capitalize">{selectedTask.status}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Priorité</h3>
              <p className="text-gray-600 capitalize">
                {selectedTask.priority}
              </p>
            </div>

            {selectedTask.dueDate && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Date d'échéance
                </h3>
                <p className="text-gray-600">
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }).format(selectedTask.dueDate)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
