import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDnd } from "../../context/DndContext";
import StatusColumn from "./StatusColumn";
import { type Task } from "../../types";

const DndContainer: React.FC = () => {
  const { tasks, moveTask, handleTaskClick } = useDnd();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const statusColumns = [
    {
      id: "en-attente",
      title: "EN ATTENTE",
      status: "en-attente" as Task["status"],
      color: "bg-gray-400",
      tasks: tasks.filter((task) => task.status === "en-attente"),
    },
    {
      id: "ouvert",
      title: "OUVERT",
      status: "ouvert" as Task["status"],
      color: "bg-blue-500",
      tasks: tasks.filter((task) => task.status === "ouvert"),
    },
    {
      id: "en-cours",
      title: "EN COURS",
      status: "en-cours" as Task["status"],
      color: "bg-yellow-500",
      tasks: tasks.filter((task) => task.status === "en-cours"),
    },
    {
      id: "a-valider",
      title: "À VALIDER",
      status: "a-valider" as Task["status"],
      color: "bg-orange-500",
      tasks: tasks.filter((task) => task.status === "a-valider"),
    },
    {
      id: "termine",
      title: "TERMINÉ",
      status: "termine" as Task["status"],
      color: "bg-green-500",
      tasks: tasks.filter((task) => task.status === "termine"),
    },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const overColumnId = over.id as string;

    // Trouver la colonne de destination
    const targetColumn = statusColumns.find((col) => col.id === overColumnId);

    if (targetColumn) {
      moveTask(taskId, targetColumn.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}>
      <SortableContext
        items={statusColumns.map((col) => col.id)}
        strategy={horizontalListSortingStrategy}>
        <div className="flex space-x-6 overflow-x-auto pb-6">
          {statusColumns.map((column) => (
            <StatusColumn
              key={column.id}
              column={column}
              tasks={column.tasks}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default DndContainer;
