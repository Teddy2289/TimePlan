import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "../../types";
import {
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  CheckSquare,
} from "lucide-react";

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-red-400";
      case "elevee":
        return "bg-orange-400";
      case "normale":
      default:
        return columnStyle?.accent || "bg-gray-400";
    }
  };

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
        bg-white rounded-lg p-3 
        transition-all duration-200 
        cursor-grab active:cursor-grabbing 
        group hover:shadow-md hover:border-gray-300
        select-none touch-none
        ${isDragging
          ? "opacity-60 rotate-2 shadow-xl z-50 scale-105 border-2 border-blue-400 bg-blue-50"
          : "hover:scale-[1.02]"
        }
      `}
      onClick={handleClick}
    >
      {/* Header avec titre */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-xs leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <button
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity p-1 rounded hover:bg-gray-100 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Menu pour:", task.title);
          }}
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Métadonnées */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          {/* Checkbox */}
          <div
            className="w-3.5 h-3.5 border border-gray-300 rounded flex items-center justify-center transition-colors hover:border-gray-400 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Toggle checkbox for:", task.id);
            }}
          >
            <CheckSquare size={12} className="text-gray-600" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Icônes de métadonnées */}
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

          {/* Point de priorité */}
          <div
            className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full`}
          />

          {/* Avatar */}
          <div
            className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full text-[10px] text-white flex items-center justify-center font-medium shadow-sm cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              console.log("Click avatar for:", task.assignee);
            }}
          >
            {task.assignee}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortableTaskCard;