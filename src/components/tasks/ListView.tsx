// ListView.tsx
import React, { useState } from 'react';
import { useDnd } from '../../context/DndContext';
import TaskDetailsModal from './TaskDetailsModal';
import {
    Plus,
    MessageSquare,
    Paperclip,
    ChevronDown,
    ChevronRight,
    Edit2,
    Check,
    X,
    CircleEllipsis,
    CircleDashed,
    LoaderCircle,
    CircleCheck,
    CircleCheckBig,
} from 'lucide-react';
import type { Task } from '../../types';

interface ListViewProps {
    onOpenCreateModal?: (status?: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ onOpenCreateModal }) => {
    const { tasks, handleTaskClick, addTask, moveTask } = useDnd();
    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        'à valider': true,
        'en cours': true,
        ouvert: true,
    });
    const [editingTask, setEditingTask] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{
        priority?: string;
        status?: string;
    }>({});
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Fonction pour formater les dates
    const formatDate = (dateString: string) => {
        try {
            // Si la date est au format ISO avec le 'Z' à la fin
            let dateStr = dateString;
            if (dateString.includes('Z') && dateString.includes('T')) {
                // Supprimer les microsecondes et le 'Z' pour éviter les problèmes de fuseau horaire
                dateStr = dateString.split('.')[0];
            }

            const date = new Date(dateStr);

            // Vérifier si la date est valide
            if (isNaN(date.getTime())) {
                // Essayer de parser directement sans le 'Z'
                const altDate = new Date(dateString.replace('Z', ''));
                if (!isNaN(altDate.getTime())) {
                    return altDate.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    });
                }
                return dateString; // Retourner la chaîne originale si non parseable
            }

            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            console.error('Erreur de formatage de date:', e);
            return dateString; // Retourner la chaîne originale en cas d'erreur
        }
    };

    // Fonction pour obtenir le label de priorité
    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'elevee':
                return 'élevée';
            case 'urgente':
                return 'urgente';
            case 'normale':
            default:
                return 'normale';
        }
    };

    // Fonction pour obtenir le label de statut
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'en-attente':
                return 'en attente';
            case 'ouvert':
                return 'ouvert';
            case 'en-cours':
                return 'en cours';
            case 'a-valider':
                return 'à valider';
            case 'termine':
                return 'terminé';
            default:
                return status;
        }
    };

    // Fonction pour obtenir la couleur de statut simple (pour l'affichage texte)
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'en-attente':
                return 'text-slate-600 bg-slate-100 px-2 py-1 rounded';
            case 'ouvert':
                return 'text-blue-600 bg-blue-100 px-2 py-1 rounded';
            case 'en-cours':
                return 'text-amber-600 bg-amber-100 px-2 py-1 rounded';
            case 'a-valider':
                return 'text-purple-600 bg-purple-100 px-2 py-1 rounded';
            case 'termine':
                return 'text-emerald-600 bg-emerald-100 px-2 py-1 rounded';
            default:
                return 'text-gray-600 bg-gray-100 px-2 py-1 rounded';
        }
    };

    // Grouper les tâches par statut comme dans l'image
    const groupedTasks = {
        'à valider': tasks.filter((task) => task.status === 'a-valider'),
        'en cours': tasks.filter((task) => task.status === 'en-cours'),
        ouvert: tasks.filter(
            (task) =>
                task.status === 'ouvert' ||
                task.status === 'en-attente' ||
                task.status === 'termine'
        ),
    };

    const toggleGroup = (groupName: string) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    const startEditing = (
        taskId: string | number,
        field: 'priority' | 'status',
        currentValue: string
    ) => {
        setEditingTask(String(taskId));
        setEditForm({ [field]: currentValue });
    };

    const saveEdit = (taskId: string | number, field: 'priority' | 'status') => {
        if (editForm[field]) {
            if (field === 'status') {
                moveTask(Number(taskId), editForm.status as any);
            }
            // Ici, vous devriez aussi mettre à jour la priorité dans votre contexte/API
        }
        setEditingTask(null);
        setEditForm({});
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setEditForm({});
    };

    // Fonction pour obtenir l'icône selon le statut
    const getStatusIcon = (status: string) => {
        const baseClass = 'flex-shrink-0';

        switch (status) {
            case 'en-attente':
                return <CircleEllipsis size={14} className={`${baseClass} text-white`} />;
            case 'ouvert':
                return <CircleDashed size={14} className={`${baseClass} text-white`} />;
            case 'en-cours':
                return <LoaderCircle size={14} className={`${baseClass} text-white`} />;
            case 'a-valider':
                return <CircleCheck size={14} className={`${baseClass} text-white`} />;
            case 'termine':
                return <CircleCheckBig size={14} className={`${baseClass} text-white`} />;
            default:
                return <CircleEllipsis size={14} className={`${baseClass} text-white`} />;
        }
    };

    // Palette de couleurs cohérente avec StatusColumn
    const getStatusStyles = (status: string) => {
        const styles = {
            'en-attente': {
                bg: 'bg-slate-100/70',
                bgback: 'bg-slate-500',
                border: 'border-slate-200',
                accent: 'bg-slate-500',
                text: 'text-white',
                badge: 'bg-slate-200 text-white',
                button: 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border-slate-300',
                headerBg: 'bg-slate-50',
            },
            ouvert: {
                bg: 'bg-blue-100/70',
                bgback: 'bg-blue-500',
                border: 'border-blue-200',
                accent: 'bg-blue-500',
                text: 'text-white',
                badge: 'bg-blue-200 text-white',
                button: 'text-blue-500 hover:text-blue-700 hover:bg-blue-100 border-blue-300',
                headerBg: 'bg-blue-50',
            },
            'en-cours': {
                bg: 'bg-amber-100/70',
                bgback: 'bg-amber-500',
                border: 'border-amber-200',
                accent: 'bg-amber-500',
                text: 'text-white',
                badge: 'bg-amber-200 text-white',
                button: 'text-amber-500 hover:text-amber-700 hover:bg-amber-100 border-amber-300',
                headerBg: 'bg-amber-50',
            },
            'a-valider': {
                bg: 'bg-purple-100/70',
                bgback: 'bg-purple-500',
                border: 'border-purple-200',
                accent: 'bg-purple-500',
                text: 'text-white',
                badge: 'bg-purple-200 text-white',
                button: 'text-purple-500 hover:text-purple-700 hover:bg-purple-100 border-purple-300',
                headerBg: 'bg-purple-50',
            },
            termine: {
                bg: 'bg-emerald-100/70',
                bgback: 'bg-emerald-500',
                border: 'border-emerald-200',
                accent: 'bg-emerald-500',
                text: 'text-white',
                badge: 'bg-emerald-200 text-white',
                button: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 border-emerald-300',
                headerBg: 'bg-emerald-50',
            },
        };

        return styles[status as keyof typeof styles] || styles['en-attente'];
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgente':
                return 'bg-red-500 text-white';
            case 'elevee':
                return 'bg-orange-500 text-white';
            case 'normale':
            default:
                return 'bg-gray-200 text-gray-700';
        }
    };

    const getGroupStyles = (groupName: string) => {
        switch (groupName) {
            case 'à valider':
                return getStatusStyles('a-valider');
            case 'en cours':
                return getStatusStyles('en-cours');
            case 'ouvert':
                return getStatusStyles('ouvert');
            default:
                return getStatusStyles('en-attente');
        }
    };

    const handleTaskRowClick = (task: Task) => {
        setSelectedTask(task);
        handleTaskClick(task);
    };

    const handleCloseModal = () => setSelectedTask(null);

    const handleAddTask = (statusGroup: string) => {
        let status: any = 'en-attente';
        if (statusGroup === 'en cours') status = 'en-cours';
        if (statusGroup === 'à valider') status = 'a-valider';

        const title = 'Nouvelle tâche';
        addTask(title, status);
    };

    const priorityOptions = [
        { value: 'normale', label: 'normale' },
        { value: 'elevee', label: 'élevée' },
        { value: 'urgente', label: 'urgente' },
    ];

    const statusOptions = [
        { value: 'en-attente', label: 'en attente' },
        { value: 'ouvert', label: 'ouvert' },
        { value: 'en-cours', label: 'en cours' },
        { value: 'a-valider', label: 'à valider' },
        { value: 'termine', label: 'terminé' },
    ];

    return (
        <>
            <div className="p-6 space-y-4">
                {Object.entries(groupedTasks).map(([statusGroup, statusTasks]) => {
                    const groupStyles = getGroupStyles(statusGroup);
                    const statusIcon = getStatusIcon(
                        statusGroup === 'à valider'
                            ? 'a-valider'
                            : statusGroup === 'en cours'
                            ? 'en-cours'
                            : 'ouvert'
                    );

                    return (
                        <div
                            key={statusGroup}
                            className="bg-white rounded-lg border border-gray-200"
                        >
                            {/* En-tête du groupe avec accordéon */}
                            <div
                                className={`flex items-center justify-between px-4 py-3 border-b border-gray-300 cursor-pointer ${groupStyles.headerBg}`}
                                onClick={() => toggleGroup(statusGroup)}
                            >
                                <div className="flex items-center space-x-3">
                                    {expandedGroups[statusGroup] ? (
                                        <ChevronDown size={16} className="text-gray-500" />
                                    ) : (
                                        <ChevronRight size={16} className="text-gray-500" />
                                    )}
                                    <div
                                        className={`flex items-center space-x-2 ${groupStyles.bgback} px-3 py-1 rounded-full`}
                                    >
                                        {statusIcon}
                                        <h3 className={`font-medium text-xs ${groupStyles.text}`}>
                                            {statusGroup}
                                        </h3>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${groupStyles.badge}`}
                                        >
                                            {statusTasks.length}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddTask(statusGroup);
                                    }}
                                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded border transition-colors ${groupStyles.button}`}
                                >
                                    <Plus size={12} />
                                    <span>ajouter tiche</span>
                                </button>
                            </div>

                            {/* Contenu dépliable */}
                            {expandedGroups[statusGroup] && (
                                <>
                                    {/* En-tête du tableau */}
                                    <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
                                        <div className="col-span-3">nom</div>
                                        <div className="col-span-1">assigné</div>
                                        <div className="col-span-2">date d'éch...</div>
                                        <div className="col-span-1">priorité</div>
                                        <div className="col-span-1">statut</div>
                                        <div className="col-span-1">commenta...</div>
                                    </div>

                                    {/* Liste des tâches */}
                                    <div className="divide-y divide-gray-200">
                                        {statusTasks.length > 0 ? (
                                            statusTasks.map((task) => {
                                                const taskStyles = getStatusStyles(task.status);
                                                return (
                                                    <div
                                                        key={task.id}
                                                        className="grid grid-cols-12 gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors items-center text-xs"
                                                        onClick={() => handleTaskRowClick(task)}
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
                                                                {task.assignee?.name?.[0] || '?'}
                                                            </div>
                                                        </div>

                                                        {/* Date d'échéance - CORRIGÉ */}
                                                        <div className="col-span-2 text-gray-500">
                                                            {task.due_date
                                                                ? formatDate(task.due_date)
                                                                : formatDate(task.created_at)}
                                                        </div>

                                                        {/* Priorité - Éditable - CORRIGÉ */}
                                                        <div className="col-span-1">
                                                            {editingTask === String(task.id) &&
                                                            editForm.priority !== undefined ? (
                                                                <div className="flex items-center space-x-1">
                                                                    <select
                                                                        value={editForm.priority}
                                                                        onChange={(e) =>
                                                                            setEditForm({
                                                                                priority:
                                                                                    e.target.value,
                                                                            })
                                                                        }
                                                                        className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full"
                                                                        autoFocus
                                                                    >
                                                                        {priorityOptions.map(
                                                                            (option) => (
                                                                                <option
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                >
                                                                                    {option.label}
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            saveEdit(
                                                                                task.id,
                                                                                'priority'
                                                                            );
                                                                        }}
                                                                        className="text-green-600 hover:text-green-800"
                                                                    >
                                                                        <Check size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            cancelEdit();
                                                                        }}
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
                                                                        startEditing(
                                                                            task.id,
                                                                            'priority',
                                                                            task.priority
                                                                        );
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={`inline-flex items-center px-2 py-1 rounded font-medium text-xs ${getPriorityColor(
                                                                            task.priority
                                                                        )}`}
                                                                    >
                                                                        {getPriorityLabel(
                                                                            task.priority
                                                                        )}
                                                                    </span>
                                                                    <Edit2
                                                                        size={10}
                                                                        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Statut - Éditable - CORRIGÉ */}
                                                        <div className="col-span-1">
                                                            {editingTask === String(task.id) &&
                                                            editForm.status !== undefined ? (
                                                                <div className="flex items-center space-x-1">
                                                                    <select
                                                                        value={editForm.status}
                                                                        onChange={(e) =>
                                                                            setEditForm({
                                                                                status: e.target
                                                                                    .value,
                                                                            })
                                                                        }
                                                                        className="border border-gray-300 rounded px-1 py-0.5 text-xs w-full"
                                                                        autoFocus
                                                                    >
                                                                        {statusOptions.map(
                                                                            (option) => (
                                                                                <option
                                                                                    key={
                                                                                        option.value
                                                                                    }
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                >
                                                                                    {option.label}
                                                                                </option>
                                                                            )
                                                                        )}
                                                                    </select>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            saveEdit(
                                                                                task.id,
                                                                                'status'
                                                                            );
                                                                        }}
                                                                        className="text-green-600 hover:text-green-800"
                                                                    >
                                                                        <Check size={12} />
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            cancelEdit();
                                                                        }}
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
                                                                        startEditing(
                                                                            task.id,
                                                                            'status',
                                                                            task.status
                                                                        );
                                                                    }}
                                                                >
                                                                    <span
                                                                        className={`text-xs ${getStatusColor(
                                                                            task.status
                                                                        )}`}
                                                                    >
                                                                        {getStatusLabel(
                                                                            task.status
                                                                        )}
                                                                    </span>
                                                                    <Edit2
                                                                        size={10}
                                                                        className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Commentaires */}
                                                        <div className="col-span-1 flex items-center space-x-1">
                                                            <MessageSquare
                                                                size={12}
                                                                className="text-gray-400"
                                                            />
                                                            <span className="text-gray-600">
                                                                {task.comments || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            // Ligne vide avec bouton ajouter comme dans l'image
                                            <div className="px-4 py-2">
                                                <button
                                                    onClick={() => handleAddTask(statusGroup)}
                                                    className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
                                                >
                                                    <Plus size={12} />
                                                    <span>ajouter tiche</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Section des options de groupement comme dans l'image */}
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                        <span>grouper</span>
                        <select className="border border-gray-300 rounded px-2 py-1 text-xs">
                            <option>statut</option>
                            <option>priorité</option>
                            <option>assigné</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="subtasks" className="rounded text-xs" />
                        <label htmlFor="subtasks">sous-tâches</label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input type="checkbox" id="columns" className="rounded text-xs" />
                        <label htmlFor="columns">colonnes</label>
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
                        console.log('Update:', selectedTask.id, updates);
                    }}
                />
            )}
        </>
    );
};

export default ListView;
