// GanttView.tsx - STYLE DE LA CAPTURE
import React, { useState, useRef } from "react";
import { useDnd } from "../../context/DndContext";
import TaskDetailsModal from "./TaskDetailsModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task } from "../../types";

interface GrandViewProps {
  onOpenCreateModal?: (status?: string) => void;
}

const GanttView: React.FC<GrandViewProps> = ({ onOpenCreateModal }) => {
  const { tasks } = useDnd();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Générer les semaines comme dans la capture
  const getWeeks = () => {
    const weeks = [];
    const now = new Date();

    // Trouver le lundi de cette semaine
    const currentDate = new Date(now);
    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi
    const monday = new Date(currentDate.setDate(diff));

    // Décaler selon l'offset
    monday.setDate(monday.getDate() + currentWeekOffset * 7);

    // Générer 4 semaines (comme dans la capture)
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(monday);
      weekStart.setDate(weekStart.getDate() + i * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Générer les jours de la semaine (lun-ven)
      const days = [];
      for (let d = 0; d < 5; d++) {
        // Seulement du lundi au vendredi
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + d);
        days.push(dayDate);
      }

      weeks.push({
        id: i,
        start: weekStart,
        end: weekEnd,
        days: days,
        label: `w${getWeekNumber(weekStart)} ${formatWeekLabel(
          weekStart,
          weekEnd
        )}`,
      });
    }

    return weeks;
  };

  const getWeekNumber = (date: Date): number => {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  const formatWeekLabel = (start: Date, end: Date): string => {
    const startMonth = start.toLocaleDateString("fr-FR", { month: "short" });
    const endMonth = end.toLocaleDateString("fr-FR", { month: "short" });

    if (startMonth === endMonth) {
      return `${startMonth} ${start.getDate()}-${end.getDate()}`;
    } else {
      return `${startMonth} ${start.getDate()}-${endMonth} ${end.getDate()}`;
    }
  };

  const formatDayLabel = (date: Date): string => {
    return date.toLocaleDateString("fr-FR", { weekday: "short" }).charAt(0);
  };

  const weeks = getWeeks();
  const allDays = weeks.flatMap((week) => week.days);

  // Calculer la position des tâches
  const getTaskPosition = (task: Task) => {
    try {
      const taskStart = task.start_date
        ? new Date(task.start_date)
        : new Date(task.created_at);
      const taskEnd = task.due_date
        ? new Date(task.due_date)
        : new Date(taskStart);
      taskEnd.setDate(taskEnd.getDate() + 2); // Durée par défaut de 3 jours

      const startDate = allDays[0];
      const endDate = allDays[allDays.length - 1];
      const totalDays =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      const startOffset = Math.max(
        0,
        taskStart.getTime() - startDate.getTime()
      );
      const endOffset = Math.max(0, taskEnd.getTime() - startDate.getTime());

      const startPercent =
        (startOffset / (totalDays * 24 * 60 * 60 * 1000)) * 100;
      const durationPercent =
        ((endOffset - startOffset) / (totalDays * 24 * 60 * 60 * 1000)) * 100;

      return {
        start: Math.max(0, startPercent),
        width: Math.min(100, Math.max(8, durationPercent)), // Largeur minimale de 8%
        startDate: taskStart,
        endDate: taskEnd,
      };
    } catch (error) {
      return {
        start: 0,
        width: 20,
        startDate: new Date(),
        endDate: new Date(),
      };
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => setSelectedTask(null);

  const goToPreviousWeek = () => {
    setCurrentWeekOffset((prev) => prev - 1);
  };

  const goToNextWeek = () => {
    setCurrentWeekOffset((prev) => prev + 1);
  };

  const goToToday = () => {
    setCurrentWeekOffset(0);
  };

  // Couleurs minimales comme dans la capture
  const getTaskColor = (status: string) => {
    switch (status) {
      case "en-cours":
        return "bg-blue-600";
      case "ouvert":
        return "bg-green-600";
      case "a-valider":
        return "bg-purple-600";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="bg-white rounded-lg overflow-hidden">
          {/* En-tête minimal comme dans la capture */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900">nom</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPreviousWeek}
                className="p-1 hover:bg-gray-100 rounded">
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goToToday}
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50">
                aujourd'hui
              </button>
              <button
                onClick={goToNextWeek}
                className="p-1 hover:bg-gray-100 rounded">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Timeline header - EXACTEMENT comme dans la capture */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex">
              {/* Colonne vide pour alignement */}
              <div className="w-80 border-r border-gray-200"></div>

              {/* Semaines */}
              {weeks.map((week) => (
                <div
                  key={week.id}
                  className="flex-1 border-r border-gray-200"
                  style={{ minWidth: "200px" }}>
                  <div className="text-center py-2 border-b border-gray-200 text-xs font-medium text-gray-700 bg-white">
                    {week.label}
                  </div>
                  <div className="flex">
                    {week.days.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="flex-1 text-center py-1 border-r border-gray-200 last:border-r-0 text-xs text-gray-600 bg-white">
                        <div className="font-medium">{formatDayLabel(day)}</div>
                        <div className="text-[10px] text-gray-500">
                          {day.getDate()}
                        </div>
                      </div>
                    ))}
                    {/* Colonnes vides pour samedi/dimanche */}
                    <div className="flex-1 text-center py-1 text-xs text-gray-400 bg-gray-50">
                      <div className="font-medium">sa</div>
                      <div className="text-[10px]">-</div>
                    </div>
                    <div className="flex-1 text-center py-1 text-xs text-gray-400 bg-gray-50">
                      <div className="font-medium">di</div>
                      <div className="text-[10px]">-</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liste des tâches */}
          <div className="overflow-x-auto">
            {tasks.map((task) => {
              const position = getTaskPosition(task);
              const taskColor = getTaskColor(task.status);

              return (
                <div
                  key={task.id}
                  className="flex items-center border-b border-gray-100 hover:bg-gray-50 min-w-max">
                  {/* Nom de la tâche - Style de la capture */}
                  <div className="w-80 p-3 border-r border-gray-200 flex-shrink-0">
                    <div className="font-medium text-sm text-gray-900 flex items-center">
                      {task.title}
                    </div>
                  </div>

                  {/* Barre de Gantt */}
                  <div
                    className="flex-1 relative h-16 min-w-max"
                    style={{ width: `${weeks.length * 200}px` }}>
                    {/* Lignes verticales des jours */}
                    <div className="absolute inset-0 flex">
                      {weeks.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className="flex-1 flex border-r border-gray-100 last:border-r-0">
                          {[...Array(7)].map((_, dayIndex) => (
                            <div
                              key={dayIndex}
                              className="flex-1 border-r border-gray-100 last:border-r-0"
                            />
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Barre de la tâche - Style minimal */}
                    {position.width > 0 && (
                      <div
                        className={`absolute h-8 ${taskColor} top-1/2 transform -translate-y-1/2 flex items-center px-2 cursor-pointer transition-opacity hover:opacity-90`}
                        style={{
                          left: `${position.start}%`,
                          width: `${position.width}%`,
                          minWidth: "80px",
                        }}
                        onClick={() => handleTaskClick(task)}>
                        <span className="text-xs text-white font-medium truncate">
                          {task.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Exemples de tâches supplémentaires comme dans la capture */}
          <div className="border-t border-gray-200">
            {/* Tâche WIZI-LEARN */}
            <div className="flex items-center border-b border-gray-100 min-w-max">
              <div className="w-80 p-3 border-r border-gray-200 flex-shrink-0">
                <div className="font-medium text-sm text-gray-900 flex items-center">
                  <span className="text-blue-600 mr-2">◉</span>
                  wizi-learn, web-app
                </div>
              </div>
              <div
                className="flex-1 relative h-16 min-w-max"
                style={{ width: `${weeks.length * 200}px` }}>
                <div className="absolute h-8 bg-blue-600 top-1/2 transform -translate-y-1/2 left-[10%] w-[85%] flex items-center px-2">
                  <span className="text-xs text-white font-medium truncate">
                    wizi-learn, web-app
                  </span>
                </div>
              </div>
            </div>

            {/* Tâche Responsivité */}
            <div className="flex items-center border-b border-gray-100 min-w-max">
              <div className="w-80 p-3 border-r border-gray-200 flex-shrink-0">
                <div className="font-medium text-sm text-gray-900 flex items-center">
                  <span className="text-gray-400 mr-2">◎</span>
                  responsivité du site
                </div>
              </div>
              <div
                className="flex-1 relative h-16 min-w-max"
                style={{ width: `${weeks.length * 200}px` }}>
                <div className="absolute h-8 bg-gray-400 top-1/2 transform -translate-y-1/2 left-[30%] w-[40%] flex items-center px-2">
                  <span className="text-xs text-white font-medium truncate">
                    responsivité du site
                  </span>
                </div>
              </div>
            </div>

            {/* Tâche Charte graphique */}
            <div className="flex items-center border-b border-gray-100 min-w-max">
              <div className="w-80 p-3 border-r border-gray-200 flex-shrink-0">
                <div className="font-medium text-sm text-gray-900 flex items-center">
                  <span className="text-green-600 mr-2">◉</span>
                  charte graphique
                </div>
              </div>
              <div
                className="flex-1 relative h-16 min-w-max"
                style={{ width: `${weeks.length * 200}px` }}>
                <div className="absolute h-8 bg-green-600 top-1/2 transform -translate-y-1/2 left-[40%] w-[35%] flex items-center px-2">
                  <span className="text-xs text-white font-medium truncate">
                    charte graphique
                  </span>
                </div>
              </div>
            </div>

            {/* Tâche Gestion des comptes */}
            <div className="flex items-center border-b border-gray-100 min-w-max">
              <div className="w-80 p-3 border-r border-gray-200 flex-shrink-0">
                <div className="font-medium text-sm text-gray-900 flex items-center">
                  <span className="text-purple-600 mr-2">◉</span>
                  gestion des comptes stagiaires
                </div>
              </div>
              <div
                className="flex-1 relative h-16 min-w-max"
                style={{ width: `${weeks.length * 200}px` }}>
                <div className="absolute h-8 bg-purple-600 top-1/2 transform -translate-y-1/2 left-[60%] w-[30%] flex items-center px-2">
                  <span className="text-xs text-white font-medium truncate">
                    gestion des comptes stagiaires
                  </span>
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

export default GanttView;
