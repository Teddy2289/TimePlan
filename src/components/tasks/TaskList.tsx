import React from "react";
import { type Task } from "../../types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask?: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  title,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      {/* Header de la liste */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">
          {tasks.length}
        </span>
      </div>

      {/* Liste des tâches */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
        ))}

        {/* Bouton Ajouter Tache */}
        <button
          onClick={onAddTask}
          className="w-full py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm flex items-center justify-center space-x-1">
          <span>+</span>
          <span>Ajouter Tache</span>
        </button>
      </div>
    </div>
  );
};

export default TaskList;
