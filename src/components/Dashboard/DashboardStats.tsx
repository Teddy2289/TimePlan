import React from "react";
import { type Task } from "../../types/index";
import { Clock, AlertTriangle, CheckCircle, Circle } from "lucide-react";

interface DashboardStatsProps {
  tasks: Task[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks }) => {
  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    inProgress: tasks.filter((task) => task.status === "inProgress").length,
    done: tasks.filter((task) => task.status === "done").length,
    overdue: tasks.filter(
      (task) =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "done"
    ).length,
  };

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      icon: Circle,
      color: "gray" as const,
    },
    {
      label: "À faire",
      value: stats.todo,
      icon: Circle,
      color: "blue" as const,
    },
    {
      label: "En cours",
      value: stats.inProgress,
      icon: Clock,
      color: "yellow" as const,
    },
    {
      label: "Terminées",
      value: stats.done,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      label: "En retard",
      value: stats.overdue,
      icon: AlertTriangle,
      color: "red" as const,
    },
  ];

  const colorClasses = {
    gray: "bg-gray-100 text-gray-600",
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg">
              <div className={`p-2 rounded-full ${colorClasses[stat.color]}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardStats;
