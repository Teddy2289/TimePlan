import React from "react";
import { MessageSquare, Paperclip, MoreHorizontal, Clock } from "lucide-react";
import { type Task } from "../../types";

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-red-500";
      case "elevee":
        return "bg-orange-500";
      case "normale":
      default:
        return "bg-gray-400";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onTaskClick(task)}>
      {/* Header avec titre et menu */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 text-sm leading-tight">
          {task.title}
        </h3>
        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Sous-tâches */}
      {task.subtasks.length > 0 && (
        <div className="text-xs text-gray-500 mb-2">
          {task.subtasks.length} sous-tâche{task.subtasks.length > 1 ? "s" : ""}
        </div>
      )}

      {/* Dates et priorité */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <div className="flex items-center space-x-1 text-gray-500 text-xs">
              <Clock size={12} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Priorité */}
          <div
            className={`w-3 h-3 ${getPriorityColor(
              task.priority
            )} rounded-full`}></div>

          {/* Métadonnées */}
          <div className="flex items-center space-x-1 text-gray-400">
            <Paperclip size={12} />
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <MessageSquare size={12} />
          </div>

          {/* Avatar */}
          <div className="w-6 h-6 bg-gray-300 rounded-full text-xs text-white flex items-center justify-center font-medium">
            {task.assignee?.initials || "JD"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
