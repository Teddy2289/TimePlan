// src/components/tasks/DndContainer.tsx - CORRIGÉ
import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDnd } from "../../context/DndContext";
import StatusColumn from "./StatusColumn";
import TaskDetailsModal from "./TaskDetailsModal"; // IMPORTEZ LE MODAL ICI
import { type Task } from "../../types";

interface DndContainerProps {
  onOpenCreateModal?: (status?: string) => void;
}

const DndContainer: React.FC<DndContainerProps> = ({ onOpenCreateModal }) => {
  const {
    tasks,
    moveTask,
    activeTask,
    setActiveTask,
    selectedTaskForDetails, // AJOUTEZ CES LIGNES
    isTaskDetailsModalOpen,
    closeTaskDetails,
    updateTask,
    openTaskDetails,
  } = useDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const statusColumns = [
    {
      id: "en-attente",
      title: "EN ATTENTE",
      status: "en-attente" as Task["status"],
      color: "",
      tasks: tasks.filter((task) => task.status === "en-attente"),
    },
    {
      id: "ouvert",
      title: "OUVERT",
      status: "ouvert" as Task["status"],
      color: "",
      tasks: tasks.filter((task) => task.status === "ouvert"),
    },
    {
      id: "en-cours",
      title: "EN COURS",
      status: "en-cours" as Task["status"],
      color: "",
      tasks: tasks.filter((task) => task.status === "en-cours"),
    },
    {
      id: "a-valider",
      title: "À VALIDER",
      status: "a-valider" as Task["status"],
      color: "",
      tasks: tasks.filter((task) => task.status === "a-valider"),
    },
    {
      id: "termine",
      title: "TERMINÉ",
      status: "termine" as Task["status"],
      color: "",
      tasks: tasks.filter((task) => task.status === "termine"),
    },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = Number(active.id);
    const task = tasks.find((t) => t.id === taskId);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = Number(active.id);
    const overId = over.id as string;

    const validStatuses = [
      "en-attente",
      "ouvert",
      "en-cours",
      "a-valider",
      "termine",
    ];

    if (validStatuses.includes(overId)) {
      const currentTask = tasks.find((t) => t.id === taskId);
      if (currentTask && currentTask.status !== overId) {
        moveTask(taskId, overId as Task["status"]);
      }
    }
  };

  // MODIFIEZ CETTE FONCTION POUR UTILISER LE CONTEXTE
  const handleAddTask = (status: string) => {
    if (onOpenCreateModal) {
      onOpenCreateModal(status);
    }
  };

  // FONCTION POUR METTRE À JOUR LA TÂCHE
  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      updateTask(taskId, updates);

      // Si vous voulez aussi mettre à jour via l'API :
      // await taskService.updateTask(taskId, updates);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <SortableContext
          items={statusColumns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}>
          <div className="flex gap-4 p-4 overflow-x-auto min-h-[600px]">
            {statusColumns.map((column) => (
              <StatusColumn
                key={column.id}
                column={column}
                tasks={column.tasks}
                onTaskClick={openTaskDetails} // UTILISEZ LA FONCTION DU CONTEXTE
                onAddTask={handleAddTask}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeTask ? (
            <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-lg opacity-90 rotate-3 transform max-w-xs">
              <h3 className="font-medium text-gray-900 text-sm mb-2">
                {activeTask.title}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {activeTask.status}
                </span>
                <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full text-[10px] text-white flex items-center justify-center font-medium">
                  {activeTask.assignee?.initials || "?"}
                </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* AJOUTEZ LE MODAL DE DÉTAILS ICI */}
      {selectedTaskForDetails && (
        <TaskDetailsModal
          task={selectedTaskForDetails}
          isOpen={isTaskDetailsModalOpen}
          onClose={closeTaskDetails}
          onUpdateTask={(updates) => {
            handleUpdateTask(selectedTaskForDetails.id, updates);
          }}
        />
      )}
    </>
  );
};

export default DndContainer;
