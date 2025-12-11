// SortableTaskCard.tsx - VERSION MINIMALISTE
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "../../types";
import { Calendar, User } from "lucide-react";

interface SortableTaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  columnStyle: any;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({
  task,
  onTaskClick,
  columnStyle,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Formatage date
  const formatDueDate = () => {
    if (!task.due_date) return null;

    const today = new Date();
    const dueDate = new Date(task.due_date);
    const diffDays = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Demain";
    if (diffDays < 0) return `${Math.abs(diffDays)}j retard`;

    return dueDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const dueDateText = formatDueDate();
  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  const assigneeName = task.assignee?.name
    ? task.assignee.name.split(" ")[0]
    : null;

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onTaskClick(task);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-lg p-4 mb-2
        transition-all duration-200 
        cursor-grab active:cursor-grabbing 
        hover:shadow-md hover:border-gray-300 border border-gray-200
        select-none touch-none
        ${
          isDragging
            ? "opacity-70 shadow-xl z-50 bg-blue-50 border-2 border-blue-300"
            : ""
        }
        ${isOverdue ? "border-l-3 border-l-red-400" : ""}
      `}
      onClick={handleClick}>
      {/* Titre principal */}
      <h3 className="font-medium text-gray-900 text-sm leading-snug mb-3 line-clamp-2">
        {task.title}
      </h3>

      {/* Ligne inférieure avec date et assigné */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Date */}
        {dueDateText && (
          <div
            className={`flex items-center gap-1 ${
              isOverdue ? "text-red-600 font-medium" : ""
            }`}>
            <Calendar
              size={12}
              className={isOverdue ? "text-red-500" : "text-gray-400"}
            />
            <span>{dueDateText}</span>
          </div>
        )}

        {/* Assigné */}
        {assigneeName && (
          <div className="flex items-center gap-1">
            <User size={12} className="text-gray-400" />
            <span>{assigneeName}</span>
          </div>
        )}
      </div>

      {/* Indicateur de statut discret */}
      <div
        className={`h-1 mt-2 rounded-full ${
          task.status === "done" || task.status === "termine"
            ? "bg-green-400"
            : task.status === "doing" || task.status === "en-cours"
            ? "bg-yellow-400"
            : task.status === "todo" || task.status === "ouvert"
            ? "bg-blue-400"
            : "bg-gray-300"
        }`}
      />
    </div>
  );
};

export default SortableTaskCard;
