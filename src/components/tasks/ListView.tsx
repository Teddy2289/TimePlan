// ListView.tsx
import React, { useState } from "react";
import { useDnd } from "../../context/DndContext";
import { Plus, MessageSquare, Paperclip, ChevronDown, ChevronRight, Edit2, Check, X } from "lucide-react";

const ListView: React.FC = () => {
  const { tasks, handleTaskClick, addTask, moveTask } = useDnd();
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "TERMINER": true,
    "EN COURS": true,
    "OUVERT": true
  });
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{priority?: string, status?: string}>({});

  // Grouper les tâches par statut comme dans l'image
  const groupedTasks = {
    "TERMINER": tasks.filter(task => task.status === "termine"),
    "EN COURS": tasks.filter(task => task.status === "en-cours"), 
    "OUVERT": tasks.filter(task => task.status === "ouvert" || task.status === "en-attente" || task.status === "a-valider")
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const startEditing = (taskId: string, field: 'priority' | 'status', currentValue: string) => {
    setEditingTask(taskId);
    setEditForm({ [field]: currentValue });
  };

  const saveEdit = (taskId: string, field: 'priority' | 'status') => {
    if (editForm[field]) {
      if (field === 'status') {
        moveTask(taskId, editForm.status as any);
      }
      // Pour la priorité, vous devriez ajouter une fonction updateTaskPriority dans votre contexte
      // updateTaskPriority(taskId, editForm.priority);
    }
    setEditingTask(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditForm({});
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgente":
        return "bg-red-500 text-white";
      case "elevee":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "termine":
        return "bg-green-100 text-green-800";
      case "en-cours":
        return "bg-blue-100 text-blue-800";
      case "ouvert":
        return "bg-yellow-100 text-yellow-800";
      case "en-attente":
        return "bg-gray-100 text-gray-800";
      case "a-valider":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddTask = (statusGroup: string) => {
    let status: any = "en-attente";
    if (statusGroup === "EN COURS") status = "en-cours";
    if (statusGroup === "CLOTURE") status = "termine";
    
    const title = "Nouvelle tâche";
    addTask(title, status);
  };

  const priorityOptions = [
    { value: "normale", label: "Normale" },
    { value: "elevee", label: "Élevée" },
    { value: "urgente", label: "Urgente" }
  ];

  const statusOptions = [
    { value: "en-attente", label: "EN ATTENTE" },
    { value: "ouvert", label: "OUVERT" },
    { value: "en-cours", label: "EN COURS" },
    { value: "a-valider", label: "À VALIDER" },
    { value: "termine", label: "TERMINÉ" }
  ];

  return (
    <div className="p-6 space-y-4">
      {Object.entries(groupedTasks).map(([statusGroup, statusTasks]) => (
        <div key={statusGroup} className="bg-white rounded-lg border border-gray-200">
          {/* En-tête du groupe avec accordéon */}
          <div 
            className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer"
            onClick={() => toggleGroup(statusGroup)}
          >
            <div className="flex items-center space-x-3">
              {expandedGroups[statusGroup] ? (
                <ChevronDown size={16} className="text-gray-500" />
              ) : (
                <ChevronRight size={16} className="text-gray-500" />
              )}
              <h3 className="font-semibold text-gray-900 text-xs">{statusGroup}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                {statusTasks.length}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddTask(statusGroup);
              }}
              className="flex items-center space-x-1 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded border border-gray-300 transition-colors"
            >
              <Plus size={12} />
              <span>Ajouter Tâche</span>
            </button>
          </div>

          {/* Contenu dépliable */}
          {expandedGroups[statusGroup] && (
            <>
              {/* En-tête du tableau */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                <div className="col-span-3">Nom</div>
                <div className="col-span-1">Assigné</div>
                <div className="col-span-2">Date d'éch...</div>
                <div className="col-span-1">Priorité</div>
                <div className="col-span-1">Statut</div>
                <div className="col-span-1">Commenta...</div>
                <div className="col-span-1">Demandeur</div>
                <div className="col-span-2">Site IA</div>
              </div>

              {/* Liste des tâches */}
              <div className="divide-y divide-gray-200">
                {statusTasks.length > 0 ? (
                  statusTasks.map((task) => (
                    <div
                      key={task.id}
                      className="grid grid-cols-12 gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors items-center text-xs"
                    >
                      {/* Nom */}
                      <div className="col-span-3">
                        <div className="font-medium text-gray-900">
                          {task.title}
                        </div>
                      </div>

                      {/* Assigné */}
                      <div className="col-span-1">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full text-[8px] text-white flex items-center justify-center font-medium">
                          {task.assignee}
                        </div>
                      </div>

                      {/* Date d'échéance */}
                      <div className="col-span-2 text-gray-500">
                        {task.createdAt.toLocaleDateString('fr-FR')}
                      </div>

                      {/* Priorité - Éditable */}
                      <div className="col-span-1">
                        {editingTask === task.id && editForm.priority !== undefined ? (
                          <div className="flex items-center space-x-1">
                            <select
                              value={editForm.priority}
                              onChange={(e) => setEditForm({ priority: e.target.value })}
                              className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full"
                              autoFocus
                            >
                              {priorityOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => saveEdit(task.id, 'priority')}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(task.id, 'priority', task.priority);
                            }}
                          >
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded font-medium ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority === "elevee" ? "Élevée" : 
                              task.priority === "urgente" ? "Urgente" : "Normale"}
                            </span>
                            <Edit2 size={10} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </div>

                      {/* Statut - Éditable */}
                      <div className="col-span-1">
                        {editingTask === task.id && editForm.status !== undefined ? (
                          <div className="flex items-center space-x-1">
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ status: e.target.value })}
                              className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full"
                              autoFocus
                            >
                              {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => saveEdit(task.id, 'status')}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(task.id, 'status', task.status);
                            }}
                          >
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded font-medium ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status === "en-cours" ? "EN COURS" :
                              task.status === "termine" ? "TERMINÉ" :
                              task.status === "ouvert" ? "OUVERT" :
                              task.status === "en-attente" ? "EN ATTENTE" : "À VALIDER"}
                            </span>
                            <Edit2 size={10} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        )}
                      </div>

                      {/* Commentaires */}
                      <div className="col-span-1 flex items-center space-x-1">
                        <MessageSquare size={12} className="text-gray-400" />
                        <span className="text-gray-600">{task.comments}</span>
                      </div>

                      {/* Demandeur */}
                      <div className="col-span-1 text-gray-500">
                        AO
                      </div>

                      {/* Site IA */}
                      <div className="col-span-2 text-gray-500">
                        -
                      </div>
                    </div>
                  ))
                ) : (
                  // Ligne vide avec bouton ajouter comme dans l'image
                  <div className="px-4 py-2">
                    <button
                      onClick={() => handleAddTask(statusGroup)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                    >
                      <Plus size={12} />
                      <span>Ajouter Tâche</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Section des options de groupement comme dans l'image */}
      <div className="flex items-center space-x-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <span>Grouper</span>
          <select className="border border-gray-300 rounded px-2 py-1 text-xs">
            <option>Statut</option>
            <option>Priorité</option>
            <option>Assigné</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="subtasks" className="rounded text-xs" />
          <label htmlFor="subtasks">Sous-tâches</label>
        </div>
        
        <div className="flex items-center space-x-2">
          <input type="checkbox" id="columns" className="rounded text-xs" />
          <label htmlFor="columns">Colonnes</label>
        </div>
      </div>
    </div>
  );
};

export default ListView;