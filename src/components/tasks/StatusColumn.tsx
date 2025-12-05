import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";
import TaskDetailsModal from "./TaskDetailsModal";
import type { StatusColumn as StatusColumnType, Task } from "../../types";
import {
  Plus,
  CircleEllipsis,
  CircleDashed,
  LoaderCircle,
  CircleCheck,
  CircleCheckBig,
} from "lucide-react";

interface StatusColumnProps {
  column: StatusColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: string) => void;
}

const StatusColumn: React.FC<StatusColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    onTaskClick(task);
  };

  const handleCloseModal = () => setSelectedTask(null);

  const handleAddTask = () => onAddTask(column.id);

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (status: string) => {
    const baseClass = "flex-shrink-0";

    switch (status) {
      case "en-attente":
        return (
          <CircleEllipsis size={16} className={`${baseClass} text-white`} />
        );
      case "ouvert":
        return <CircleDashed size={16} className={`${baseClass} text-white`} />;
      case "en-cours":
        return <LoaderCircle size={16} className={`${baseClass} text-white`} />;
      case "a-valider":
        return <CircleCheck size={16} className={`${baseClass} text-white`} />;
      case "termine":
        return (
          <CircleCheckBig size={16} className={`${baseClass} text-white`} />
        );
      default:
        return (
          <CircleEllipsis size={16} className={`${baseClass} text-white`} />
        );
    }
  };

  // Palette épurée et moderne
  const getColumnStyles = () => {
    const styles = {
      "en-attente": {
        bg: "bg-slate-100/70",
        bgback: "bg-slate-500",
        border: "border-slate-200",
        accent: "bg-slate-500",
        text: "text-white",
        badge: "bg-slate-200 text-white",
        button:
          "text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-slate-300",
        headerBg: "bg-slate-50",
      },
      ouvert: {
        bg: "bg-blue-100/70",
        bgback: "bg-blue-500",
        border: "border-blue-200",
        accent: "bg-blue-500",
        text: "text-white",
        badge: "bg-blue-200 text-white",
        button:
          "text-blue-500 hover:text-blue-700 hover:bg-blue-100 border-blue-300",
        headerBg: "bg-blue-50",
      },
      "en-cours": {
        bg: "bg-amber-100/70",
        bgback: "bg-amber-500",
        border: "border-amber-200",
        accent: "bg-amber-500",
        text: "text-white",
        badge: "bg-amber-200 text-white",
        button:
          "text-amber-500 hover:text-amber-700 hover:bg-amber-100 border-amber-300",
        headerBg: "bg-amber-50",
      },
      "a-valider": {
        bg: "bg-purple-100/70",
        bgback: "bg-purple-500",
        border: "border-purple-200",
        accent: "bg-purple-500",
        text: "text-white",
        badge: "bg-purple-200 text-white",
        button:
          "text-purple-500 hover:text-purple-700 hover:bg-purple-100 border-purple-300",
        headerBg: "bg-purple-50",
      },
      termine: {
        bg: "bg-emerald-100/70",
        bgback: "bg-emerald-500",
        border: "border-emerald-200",
        accent: "bg-emerald-500",
        text: "text-white",
        badge: "bg-emerald-200 text-white",
        button:
          "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 border-emerald-300",
        headerBg: "bg-emerald-50",
      },
    };

    return styles[column.id as keyof typeof styles] || styles["en-attente"];
  };

  const styles = getColumnStyles();
  const statusIcon = getStatusIcon(column.id);

  return (
    <>
      <div
        ref={setNodeRef}
        className={`w-80 rounded-2xl transition-all duration-300 border-2 shadow-sm min-h-[200px] ${
          isOver
            ? "border-blue-400 bg-blue-50/70 shadow-lg scale-[1.02] border-dashed"
            : `${styles.border} ${styles.bg} hover:shadow-md hover:scale-[1.01] border-transparent`
        }`}>
        {/* Header moderne et épuré */}
        <div
          className={`px-4 py-3 rounded-t-2xl border-b border-gray-400 ${styles.headerBg} `}>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-2 ${styles.bgback} px-2 py-1 rounded-full`}>
              {/* Icône du statut */}
              {statusIcon}

              <h2 className={`font-medium lowercase text-xs ${styles.text}`}>
                {column.title}
              </h2>

              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles.badge}`}>
                {tasks.length}
              </span>
            </div>

            <div
              className={`w-1.5 h-1.5 ${styles.accent} rounded-full opacity-50`}
            />
          </div>
        </div>

        {/* Zone des tasks - AVEC SortableContext */}
        <div className="p-">
          <SortableContext
            items={tasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tasks.map((task) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  onTaskClick={handleTaskClick}
                  columnStyle={styles}
                />
              ))}
            </div>
          </SortableContext>

          {/* Bouton ajouter — modern UI */}
          <button
            onClick={handleAddTask}
            className={`w-full mt-3 py-2 rounded-lg transition-all duration-200 text-xs font-medium flex items-center justify-center gap-2 border border-dashed ${styles.button} group`}>
            <Plus
              size={14}
              className="transition-transform group-hover:scale-110"
            />
            <span className="text-xs">Ajouter une tâche</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={handleCloseModal}
          onUpdateTask={(updates) => {
            console.log("Update:", selectedTask.id, updates);
          }}
        />
      )}
    </>
  );
};

export default StatusColumn;
