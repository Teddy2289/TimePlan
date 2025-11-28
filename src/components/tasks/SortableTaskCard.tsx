import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "../../types";
import {
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  GripVertical,
  CheckSquare,
} from "lucide-react";

interface SortableTaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  columnStyle: {
    bg: string;
    border: string;
    headerBg: string;
    headerBorder: string;
    accent: string;
    text: string;
    badge: string;
    button: string;
  };
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-red-400";
      case "elevee":
        return "bg-orange-400";
      case "normale":
      default:
        return columnStyle.accent;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Empêche le clic lors du drag
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onTaskClick(task);
  };

  // Gestion du drag start pour éviter les conflits
  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Fonction pour obtenir le design spécifique selon la capture
  const getTaskSpecificContent = (taskId: string) => {
    switch (taskId) {
      case "1":
        return {
          icon: "📌",
          metadata: null,
          percentage: null,
          icons: null,
        };
      case "2":
      case "3":
        return {
          icon: null,
          metadata: "1 💬 ☐",
          percentage: null,
          icons: null,
        };
      case "4":
        return {
          icon: null,
          metadata: "1 💬 ☐",
          percentage: "% 1 sous-tâche",
          icons: null,
        };
      case "5":
      case "6":
        return {
          icon: null,
          metadata: null,
          percentage: null,
          icons: "🗥 ☐ ☐",
        };
      default:
        return {
          icon: null,
          metadata: null,
          percentage: null,
          icons: null,
        };
    }
  };

  const { icon, metadata, percentage, icons } = getTaskSpecificContent(task.id);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners} // ← AJOUT IMPORTANT: listeners sur toute la carte
      className={`bg-white rounded-lg border border-gray-200/80 p-3 transition-all duration-200 cursor-grab active:cursor-grabbing group hover:shadow-md hover:border-gray-300 ${
        isDragging
          ? "opacity-80 rotate-2 shadow-xl z-50 scale-105 border-2 border-blue-300"
          : "hover:scale-[1.02]"
      }`}
      onClick={handleClick}
      onMouseDown={handleDragStart}>
      {/* Supprimez le handle de drag séparé puisque toute la carte est draggable */}
      {/* 
      <div
        {...listeners}
        className="float-right -mt-1 -mr-1 p-1 text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors opacity-0 group-hover:opacity-100"
        onClick={(e) => e.stopPropagation()}>
        <GripVertical size={14} />
      </div>
      */}

      {/* Header avec titre */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>

        {/* Indicateur de drag subtil */}
        <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={14} className="text-gray-300" />
        </div>

        {icon ? (
          <div className="text-gray-400 text-base flex-shrink-0 ml-2">
            {icon}
          </div>
        ) : (
          <button
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity p-1 rounded hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Menu pour:", task.title);
            }}>
            <MoreHorizontal size={14} />
          </button>
        )}
      </div>

      {/* Métadonnées spécifiques selon la capture */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          {/* Checkbox stylisée */}
          <div
            className="w-3.5 h-3.5 border border-gray-300 rounded flex items-center justify-center transition-colors hover:border-gray-400"
            onClick={(e) => e.stopPropagation()} // Empêche le drag quand on clique la checkbox
          >
            {task.id === "1" && (
              <CheckSquare size={12} className="text-gray-600" />
            )}
          </div>

          {/* Métadonnées spécifiques */}
          {metadata && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              {metadata.split(" ").map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          )}

          {/* Pourcentage de sous-tâches */}
          {percentage && (
            <div className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {percentage}
            </div>
          )}

          {/* Icônes */}
          {icons && (
            <div className="flex items-center space-x-1 text-gray-400">
              {icons.split(" ").map((item, index) => (
                <span key={index} className="text-base">
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Métadonnées normales */}
          {!metadata && (
            <>
              {task.attachments > 0 && (
                <div className="flex items-center space-x-1 text-gray-400">
                  <Paperclip size={12} />
                </div>
              )}
              {task.comments > 0 && (
                <div className="flex items-center space-x-1 text-gray-400">
                  <MessageSquare size={12} />
                </div>
              )}
            </>
          )}

          {/* Priorité - point coloré */}
          <div
            className={`w-2 h-2 ${getPriorityColor(
              task.priority
            )} rounded-full`}
          />

          {/* Avatar élégant */}
          <div
            className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full text-[10px] text-white flex items-center justify-center font-medium shadow-sm"
            onClick={(e) => e.stopPropagation()} // Empêche le drag quand on clique l'avatar
          >
            {task.assignee}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableTaskCard;
