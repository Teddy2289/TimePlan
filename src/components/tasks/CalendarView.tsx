// CalendarView.tsx - AMÉLIORÉ
import React, { useState, useEffect } from "react";
import { useDnd } from "../../context/DndContext";
import TaskDetailsModal from "./TaskDetailsModal";
import {
  ChevronLeft,
  ChevronRight,
  CircleEllipsis,
  CircleDashed,
  LoaderCircle,
  CircleCheck,
  CircleCheckBig,
  Calendar as CalendarIcon,
} from "lucide-react";
import type { Task } from "../../types";

interface CalendarViewProps {
  onOpenCreateModal?: (status?: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onOpenCreateModal }) => {
  const { tasks } = useDnd();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentView, setCurrentView] = useState<"month" | "week">("month");

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (status: string) => {
    const baseClass = "flex-shrink-0 mr-1";

    switch (status) {
      case "en-attente":
        return (
          <CircleEllipsis size={10} className={`${baseClass} text-slate-500`} />
        );
      case "ouvert":
        return (
          <CircleDashed size={10} className={`${baseClass} text-blue-500`} />
        );
      case "en-cours":
        return (
          <LoaderCircle size={10} className={`${baseClass} text-amber-500`} />
        );
      case "a-valider":
        return (
          <CircleCheck size={10} className={`${baseClass} text-purple-500`} />
        );
      case "termine":
        return (
          <CircleCheckBig
            size={10}
            className={`${baseClass} text-emerald-500`}
          />
        );
      default:
        return (
          <CircleEllipsis size={10} className={`${baseClass} text-slate-500`} />
        );
    }
  };

  // Palette de couleurs cohérente
  const getStatusColor = (status: string) => {
    switch (status) {
      case "en-attente":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "ouvert":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "en-cours":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "a-valider":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "termine":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Fonctions de navigation du calendrier
  const goToPreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Calcul des jours du mois
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = (firstDay.getDay() + 6) % 7; // Pour commencer par lundi

    const days = [];

    // Jours du mois précédent
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({ date, isCurrentMonth: false, tasks: [] });
    }

    // Jours du mois courant
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTasks = tasks.filter((task) => {
        try {
          const taskDate = new Date(task.created_at);
          return (
            taskDate.getDate() === day &&
            taskDate.getMonth() === month &&
            taskDate.getFullYear() === year
          );
        } catch (error) {
          return false;
        }
      });
      days.push({ date, isCurrentMonth: true, tasks: dayTasks });
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length; // 6 semaines
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false, tasks: [] });
    }

    return days;
  };

  const days = getDaysInMonth();
  const monthNames = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const dayNames = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => setSelectedTask(null);

  // Trier les tâches par priorité pour l'affichage
  const getPriorityOrder = (priority: string) => {
    switch (priority) {
      case "urgente":
        return 1;
      case "elevee":
        return 2;
      case "normale":
        return 3;
      default:
        return 4;
    }
  };

  const sortedTasks = (tasks: Task[]) => {
    return [...tasks].sort(
      (a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority)
    );
  };

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {/* En-tête du calendrier */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                aujourd'hui
              </button>
              <div className="flex items-center">
                <button
                  onClick={goToPreviousMonth}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentView("month")}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  currentView === "month"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                }`}>
                mois
              </button>
              <button
                onClick={() => setCurrentView("week")}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${
                  currentView === "week"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                }`}>
                semaine
              </button>
            </div>
          </div>

          {/* Noms des jours */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-t">
            {dayNames.map((day) => (
              <div
                key={day}
                className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Grille du calendrier */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 border-t-0 rounded-b overflow-hidden">
            {days.map((day, index) => {
              const isToday =
                day.date.toDateString() === new Date().toDateString();
              const sortedDayTasks = sortedTasks(day.tasks);

              return (
                <div
                  key={index}
                  className={`min-h-[120px] bg-white p-2 ${
                    !day.isCurrentMonth ? "bg-gray-50" : ""
                  } ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}`}>
                  {/* Numéro du jour */}
                  <div className="flex justify-between items-center mb-1">
                    <span
                      className={`text-xs font-medium ${
                        day.isCurrentMonth
                          ? isToday
                            ? "text-blue-600 font-bold"
                            : "text-gray-900"
                          : "text-gray-400"
                      }`}>
                      {day.date.getDate()}
                    </span>
                    {sortedDayTasks.length > 0 && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {sortedDayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Liste des tâches */}
                  <div className="space-y-1 max-h-[88px] overflow-y-auto">
                    {sortedDayTasks.slice(0, 4).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={`text-xs p-1.5 rounded border cursor-pointer transition-all hover:shadow-sm ${getStatusColor(
                          task.status
                        )}`}
                        title={`${task.title} - ${task.priority} - ${task.assignee}`}>
                        <div className="flex items-center">
                          {getStatusIcon(task.status)}
                          <span className="truncate flex-1">{task.title}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-gray-500">
                            {task.assignee?.name || "Non assigné"}
                          </span>
                          {task.priority === "urgente" && (
                            <span className="text-[8px] bg-red-500 text-white px-1 py-0.5 rounded">
                              urgente
                            </span>
                          )}
                          {task.priority === "elevee" && (
                            <span className="text-[8px] bg-orange-500 text-white px-1 py-0.5 rounded">
                              élevée
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {sortedDayTasks.length > 4 && (
                      <div className="text-[10px] text-gray-500 text-center pt-1">
                        +{sortedDayTasks.length - 4} plus
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Légende */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-600">légende:</span>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <CircleEllipsis size={10} className="text-slate-500 mr-1" />
                    <span className="text-xs text-gray-700">en attente</span>
                  </div>
                  <div className="flex items-center">
                    <CircleDashed size={10} className="text-blue-500 mr-1" />
                    <span className="text-xs text-gray-700">ouvert</span>
                  </div>
                  <div className="flex items-center">
                    <LoaderCircle size={10} className="text-amber-500 mr-1" />
                    <span className="text-xs text-gray-700">en cours</span>
                  </div>
                  <div className="flex items-center">
                    <CircleCheck size={10} className="text-purple-500 mr-1" />
                    <span className="text-xs text-gray-700">à valider</span>
                  </div>
                  <div className="flex items-center">
                    <CircleCheckBig
                      size={10}
                      className="text-emerald-500 mr-1"
                    />
                    <span className="text-xs text-gray-700">terminé</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCompleted"
                    className="rounded"
                  />
                  <label htmlFor="showCompleted">terminées</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showSubtasks"
                    className="rounded"
                  />
                  <label htmlFor="showSubtasks">sous-tâches</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal pour afficher les détails de la tâche */}
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

export default CalendarView;
