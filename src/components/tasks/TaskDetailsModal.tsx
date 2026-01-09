import React, { useState, useEffect } from 'react';
import { type Task } from '../../types';
import {
    X,
    Tag,
    Edit2,
    Save,
    ChevronDown,
    ChevronUp,
    Calendar,
    Clock,
    Zap,
    User,
    CheckSquare,
    FileText,
    MessageSquare,
    Activity,
    Filter,
    Eye,
    Download,
    Trash2,
    Upload,
    MoreVertical,
    Search,
} from 'lucide-react';
import taskService from '../../services/taskService';
import taskCommentService from '../../services/taskCommentService';
import taskFileService from '../../services/taskFileService';
import projectsTeamsService from '../../services/projectsTeamsService';
import Toast from '../ui/Toast';
import { TaskFiles } from './taskDetail/TaskFiles';
import { TaskComments } from './taskDetail/TaskComments';
import { FilePreviewModal } from './taskDetail/FilePreviewModal';

interface TaskDetailsModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdateTask: (updates: Partial<Task>) => void;
}

// Fonctions utilitaires
const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
};

const formatTime = (mins?: number) => {
    if (!mins) return 'Non défini';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ''}` : `${m}min`;
};

const getStatusConfig = (status: string) => {
    const config: Record<string, { text: string; color: string; icon: any }> = {
        backlog: {
            text: 'En attente',
            color: 'text-gray-600',
            icon: '⏳',
        },
        todo: {
            text: 'Ouvert',
            color: 'text-blue-600',
            icon: '📝',
        },
        doing: {
            text: 'En cours',
            color: 'text-amber-600',
            icon: '⚡',
        },
        done: {
            text: 'Terminé',
            color: 'text-emerald-600',
            icon: '✅',
        },
    };
    return config[status] || config.backlog;
};

const getPriorityConfig = (priority: string) => {
    const config: Record<string, { text: string; color: string }> = {
        low: {
            text: 'Basse',
            color: 'text-emerald-600',
        },
        medium: {
            text: 'Normale',
            color: 'text-blue-600',
        },
        high: {
            text: 'Élevée',
            color: 'text-rose-600',
        },
    };
    return config[priority] || config.medium;
};

// Type pour le toast
interface ToastState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
    task,
    isOpen,
    onClose,
    onUpdateTask,
}) => {
    // États principaux
    const [activeTab, setActiveTab] = useState('Détails');
    const [showActivity, setShowActivity] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [tempTag, setTempTag] = useState('');

    // États des données
    const [comments, setComments] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<any[]>([]);

    // États prévisualisation
    const [previewFile, setPreviewFile] = useState<any>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    // État toast
    const [toast, setToast] = useState<ToastState>({
        show: false,
        message: '',
        type: 'info',
    });

    // Initialisation
    useEffect(() => {
        if (isOpen && task.id) {
            setEditedTask(task);
            setIsEditing(false);
            fetchTaskDetails();
            fetchAvailableUsers();
        }
    }, [isOpen, task.id]);

    // Fonctions utilitaires
    const showToast = (
        message: string,
        type: 'success' | 'error' | 'info' | 'warning' = 'info'
    ) => {
        setToast({ show: true, message, type });
    };

    const closeToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const [commentsData, filesData] = await Promise.all([
                taskCommentService.getTaskComments(task.id),
                taskFileService.getTaskFiles(task.id),
            ]);
            setComments(commentsData);
            setFiles(filesData);
            showToast('Données chargées avec succès', 'success');
        } catch (error: any) {
            console.error('Erreur détails:', error);
            showToast(
                error.response?.data?.message || 'Erreur lors du chargement des détails',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableUsers = async () => {
        try {
            if (task.project_id) {
                const users = await projectsTeamsService.getAssignableUsers(task.project_id);
                setAvailableUsers(users);
            }
        } catch (error: any) {
            console.error('Erreur users:', error);
            setAvailableUsers([]);
            showToast(
                error.response?.data?.message || 'Erreur lors du chargement des utilisateurs',
                'error'
            );
        }
    };

    // Gestion des mises à jour
    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            const updates: any = {
                title: editedTask.title,
                description: editedTask.description,
                status: editedTask.status,
                priority: editedTask.priority,
                start_date: editedTask.start_date,
                due_date: editedTask.due_date,
                estimated_time: editedTask.estimated_time ? Number(editedTask.estimated_time) : 0,
                tags: editedTask.tags,
                assigned_to: editedTask.assigned_to,
            };

            const response = await taskService.updateTask(task.id, updates);
            onUpdateTask(editedTask);
            setIsEditing(false);
            showToast('Tâche mise à jour avec succès !', 'success');
        } catch (error: any) {
            console.error('Erreur sauvegarde:', error);
            showToast(error.response?.data?.message || 'Erreur lors de la sauvegarde', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = (field: keyof Task, value: any) => {
        setEditedTask((prev) => ({ ...prev, [field]: value }));
    };

    const handleAssigneeChange = (userId: string) => {
        const id = userId ? parseInt(userId) : null;
        const user = availableUsers.find((u) => u.id === id);
        setEditedTask((prev) => ({ ...prev, assigned_to: id, assignee: user }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tempTag.trim()) {
            e.preventDefault();
            const currentTags = editedTask.tags || [];
            if (!currentTags.includes(tempTag.trim())) {
                setEditedTask((prev) => ({
                    ...prev,
                    tags: [...currentTags, tempTag.trim()],
                }));
                showToast('Tag ajouté', 'success');
            } else {
                showToast('Ce tag existe déjà', 'warning');
            }
            setTempTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditedTask((prev) => ({
            ...prev,
            tags: prev.tags ? prev.tags.filter((t) => t !== tagToRemove) : [],
        }));
        showToast('Tag supprimé', 'info');
    };

    // Gestion des fichiers
    const handleFilePreview = (file: any) => {
        setPreviewFile(file);
        setPreviewModalOpen(true);
    };

    const handleDownloadFile = async (file: any) => {
        try {
            const url = file.url || file.file_url;
            if (url) {
                const a = document.createElement('a');
                a.href = url;
                a.download = file.file_name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast('Téléchargement démarré', 'success');
            }
        } catch (error: any) {
            console.error('Erreur téléchargement:', error);
            showToast(error.response?.data?.message || 'Erreur lors du téléchargement', 'error');
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

        try {
            setLoading(true);
            await taskFileService.deleteFile(fileId);
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            showToast('Fichier supprimé avec succès', 'success');
        } catch (error: any) {
            console.error('Erreur suppression:', error);
            showToast(error.response?.data?.message || 'Erreur lors de la suppression', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (filesList: FileList) => {
        const filesArray = Array.from(filesList);

        try {
            setLoading(true);
            const uploadedFiles = await taskFileService.uploadFiles(task.id, filesArray);
            setFiles((prev) => [...uploadedFiles, ...prev]);
            showToast(`${filesArray.length} fichier(s) ajouté(s) avec succès`, 'success');
        } catch (error: any) {
            console.error('Erreur upload:', error);
            showToast(error.response?.data?.message || "Erreur lors de l'upload", 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (content: string) => {
        try {
            const newComment = await taskCommentService.createComment({
                task_id: task.id,
                content,
            });
            setComments([newComment, ...comments]);
            showToast('Commentaire ajouté avec succès', 'success');
        } catch (error: any) {
            console.error('Erreur ajout commentaire:', error);
            showToast(
                error.response?.data?.message || "Erreur lors de l'ajout du commentaire",
                'error'
            );
        }
    };

    if (!isOpen) return null;

    const statusConfig = getStatusConfig(editedTask.status);
    const priorityConfig = getPriorityConfig(editedTask.priority);

    // Vérifier si la date est dépassée
    const isOverdue = editedTask.due_date && new Date(editedTask.due_date) < new Date();
    // Vérifier si la date est proche (dans les 3 jours)
    const isDueSoon =
        editedTask.due_date &&
        new Date(editedTask.due_date) > new Date() &&
        new Date(editedTask.due_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    return (
        <>
            {/* Toast Global */}
            {toast.show && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={closeToast}
                    duration={3000}
                />
            )}

            {/* Modal Principal */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
                    {/* Header */}
                    <div className="flex items-center justify-between h-14 border-b border-gray-200 px-4 sm:px-6 bg-white">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`text-xs font-medium px-2 py-1 rounded ${
                                        statusConfig.color
                                    } border ${statusConfig.color.replace(
                                        'text',
                                        'border'
                                    )}/20 bg-white`}
                                >
                                    {statusConfig.icon} {statusConfig.text}
                                </span>
                                <span className="hidden sm:inline text-xs text-gray-500 border border-gray-200 rounded px-2 py-1 bg-gray-50">
                                    #{task.id}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedTask.title}
                                        onChange={(e) => handleFieldChange('title', e.target.value)}
                                        className="w-full text-base font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none px-1 bg-transparent placeholder-gray-400"
                                        placeholder="Titre de la tâche"
                                        autoFocus
                                    />
                                ) : (
                                    <h2 className="text-base font-semibold text-gray-900 truncate pr-2">
                                        {editedTask.title}
                                    </h2>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedTask(task);
                                            showToast('Modifications annulées', 'info');
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
                                    >
                                        <X size={12} />
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleSaveChanges}
                                        disabled={loading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={12} />
                                        {loading ? '...' : 'Sauvegarder'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
                                    >
                                        <Edit2 size={12} />
                                        Éditer
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-500 transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Corps */}
                    <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                        {/* Colonne Gauche */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                            {/* Description */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                        Description
                                    </h3>
                                    {!isEditing && !editedTask.description && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            + Ajouter
                                        </button>
                                    )}
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={editedTask.description || ''}
                                        onChange={(e) =>
                                            handleFieldChange('description', e.target.value)
                                        }
                                        className="w-full min-h-[100px] p-3 text-sm text-gray-700 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y transition-colors bg-white"
                                        placeholder="Décrivez cette tâche..."
                                    />
                                ) : (
                                    <div
                                        className={`p-4 rounded border ${
                                            editedTask.description
                                                ? 'bg-gray-50 border-gray-200'
                                                : 'border-dashed border-gray-300 bg-gray-50/50'
                                        }`}
                                    >
                                        {editedTask.description ? (
                                            <pre className="font-sans text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                                                {editedTask.description}
                                            </pre>
                                        ) : (
                                            <div className="text-center py-4">
                                                <FileText
                                                    size={20}
                                                    className="mx-auto text-gray-300 mb-1"
                                                />
                                                <p className="text-xs text-gray-400">
                                                    Aucune description pour cette tâche
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Grille de Propriétés */}
                            <div className="mb-6">
                                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
                                    Propriétés
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {/* Statut */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 block">
                                            Statut
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editedTask.status}
                                                onChange={(e) =>
                                                    handleFieldChange('status', e.target.value)
                                                }
                                                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                            >
                                                <option value="backlog">⏳ En attente</option>
                                                <option value="todo">📝 Ouvert</option>
                                                <option value="doing">⚡ En cours</option>
                                                <option value="done">✅ Terminé</option>
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span
                                                    className={`font-medium ${statusConfig.color}`}
                                                >
                                                    {statusConfig.text}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Assigné à */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 block">
                                            Assigné à
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editedTask.assigned_to?.toString() || ''}
                                                onChange={(e) =>
                                                    handleAssigneeChange(e.target.value)
                                                }
                                                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                            >
                                                <option value="">Non assigné</option>
                                                {availableUsers.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <div className="flex items-center gap-2 text-sm">
                                                {editedTask.assignee ? (
                                                    <>
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                                                            {editedTask.assignee.name?.charAt(0) ||
                                                                '?'}
                                                        </div>
                                                        <span className="text-gray-700">
                                                            {editedTask.assignee.name}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 italic">
                                                        Non assigné
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Priorité */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 block">
                                            Priorité
                                        </label>
                                        {isEditing ? (
                                            <select
                                                value={editedTask.priority}
                                                onChange={(e) =>
                                                    handleFieldChange('priority', e.target.value)
                                                }
                                                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                                            >
                                                <option value="low">Basse</option>
                                                <option value="medium">Normale</option>
                                                <option value="high">Élevée</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`text-sm font-medium ${priorityConfig.color}`}
                                            >
                                                {priorityConfig.text}
                                            </span>
                                        )}
                                    </div>

                                    {/* Estimation */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 flex items-center gap-1">
                                            <Clock size={10} />
                                            Estimation
                                        </label>
                                        {isEditing ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={editedTask.estimated_time || ''}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            'estimated_time',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                                                    placeholder="Minutes"
                                                    min="0"
                                                />
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    min
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-700">
                                                {formatTime(editedTask.estimated_time)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Date de début */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={10} />
                                            Date de début
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={formatDateForInput(
                                                    editedTask.start_date ?? undefined
                                                )}
                                                onChange={(e) =>
                                                    handleFieldChange('start_date', e.target.value)
                                                }
                                                className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-700">
                                                {formatDate(editedTask.start_date ?? undefined)}
                                            </span>
                                        )}
                                    </div>

                                    {/* Échéance */}
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar size={10} />
                                            Échéance
                                        </label>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={formatDateForInput(
                                                    editedTask.due_date ?? undefined
                                                )}
                                                onChange={(e) =>
                                                    handleFieldChange('due_date', e.target.value)
                                                }
                                                className={`w-full text-sm border rounded px-3 py-2 focus:ring-1 outline-none bg-white ${
                                                    isOverdue
                                                        ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
                                                        : isDueSoon
                                                        ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-500'
                                                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                                }`}
                                            />
                                        ) : (
                                            <span
                                                className={`text-sm font-medium ${
                                                    isOverdue
                                                        ? 'text-rose-600'
                                                        : isDueSoon
                                                        ? 'text-amber-600'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {formatDate(editedTask.due_date ?? undefined)}
                                                {isOverdue && ' ⚠️'}
                                                {isDueSoon && ' ⏰'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                                        Mots-clés
                                    </h3>
                                    {isEditing && (
                                        <span className="text-xs text-gray-500">
                                            Entrée pour ajouter
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {editedTask.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="group flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-200 transition-all hover:bg-blue-100"
                                        >
                                            #{tag}
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-900"
                                                >
                                                    <X size={10} />
                                                </button>
                                            )}
                                        </span>
                                    ))}

                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempTag}
                                            onChange={(e) => setTempTag(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            placeholder="Ajouter un tag..."
                                            className="text-xs px-2.5 py-1 border border-dashed border-gray-300 rounded focus:outline-none focus:border-blue-400 min-w-[100px] bg-white placeholder-gray-400"
                                        />
                                    ) : (
                                        (!editedTask.tags || editedTask.tags.length === 0) && (
                                            <div className="text-center w-full py-2">
                                                <p className="text-xs text-gray-400">
                                                    Aucun mot-clé défini
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Onglets */}
                            <div className="mb-6">
                                <div className="border-b border-gray-200">
                                    <nav className="flex space-x-4 -mb-px">
                                        {[
                                            {
                                                name: 'Détails',
                                                icon: <FileText size={12} />,
                                                count: null,
                                            },
                                            {
                                                name: 'Fichiers',
                                                icon: <FileText size={12} />,
                                                count: files.length,
                                            },
                                            {
                                                name: 'Commentaires',
                                                icon: <MessageSquare size={12} />,
                                                count: comments.length,
                                            },
                                        ].map((tab) => (
                                            <button
                                                key={tab.name}
                                                onClick={() => setActiveTab(tab.name)}
                                                className={`flex items-center gap-1.5 py-2 text-xs font-medium border-b-2 transition-colors ${
                                                    activeTab === tab.name
                                                        ? 'border-blue-600 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {tab.icon}
                                                {tab.name}
                                                {tab.count !== null && (
                                                    <span
                                                        className={`px-1.5 py-0.5 text-xs rounded ${
                                                            activeTab === tab.name
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-gray-200 text-gray-600'
                                                        }`}
                                                    >
                                                        {tab.count}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                {/* Contenu Onglets */}
                                <div className="mt-4">
                                    {activeTab === 'Détails' && (
                                        <div className="p-4 bg-gray-50 rounded border border-gray-200">
                                            <p className="text-xs text-gray-500">
                                                Les modifications sont sauvegardées automatiquement.
                                                Utilisez les propriétés ci-dessus pour configurer
                                                cette tâche.
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'Fichiers' && (
                                        <TaskFiles
                                            files={files}
                                            loading={loading}
                                            onUpload={handleFileUpload}
                                            onPreview={handleFilePreview}
                                            onDownload={handleDownloadFile}
                                            onDelete={handleDeleteFile}
                                        />
                                    )}

                                    {activeTab === 'Commentaires' && (
                                        <TaskComments
                                            comments={comments}
                                            onAddComment={handleAddComment}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Colonne Activité */}
                        <div className="hidden lg:flex w-80 flex-col border-l border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <Activity size={14} className="text-gray-500" />
                                    Activité
                                </h3>
                                <button
                                    onClick={() => setShowActivity(!showActivity)}
                                    className="text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors"
                                >
                                    {showActivity ? (
                                        <ChevronUp size={14} />
                                    ) : (
                                        <ChevronDown size={14} />
                                    )}
                                </button>
                            </div>

                            {showActivity && (
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    <div className="text-xs p-3 bg-white rounded border border-gray-200">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                                🤖
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                Système
                                            </span>
                                        </div>
                                        <p className="text-gray-600">
                                            Tâche créée le {formatDate(task.created_at)}
                                        </p>
                                    </div>

                                    {comments.slice(0, 10).map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="text-xs p-3 bg-white rounded border border-gray-200"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                                    {comment.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {comment.user?.name}
                                                </span>
                                            </div>
                                            <p className="text-gray-600">
                                                Commenté le{' '}
                                                {new Date(comment.created_at).toLocaleDateString(
                                                    'fr-FR'
                                                )}
                                            </p>
                                            <p className="text-gray-700 mt-1 line-clamp-2">
                                                "{comment.content}"
                                            </p>
                                        </div>
                                    ))}

                                    {files.slice(0, 10).map((file) => (
                                        <div
                                            key={file.id}
                                            className="text-xs p-3 bg-white rounded border border-gray-200"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                                                    📎
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    Système
                                                </span>
                                            </div>
                                            <p className="text-gray-600">
                                                Fichier ajouté le{' '}
                                                {new Date(file.created_at).toLocaleDateString(
                                                    'fr-FR'
                                                )}
                                            </p>
                                            <p className="text-gray-700 truncate">
                                                {file.file_name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Prévisualisation */}
            <FilePreviewModal
                file={previewFile}
                isOpen={previewModalOpen}
                onClose={() => {
                    setPreviewModalOpen(false);
                    setPreviewFile(null);
                }}
            />
        </>
    );
};

export default TaskDetailsModal;
