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
} from 'lucide-react';
import taskService from '../../services/taskService';
import taskCommentService from '../../services/taskCommentService';
import taskFileService from '../../services/taskFileService';
import projectsTeamsService from '../../services/projectsTeamsService';
import Toast from '../ui/Toast';
import { FieldDisplay } from './taskDetail/FieldDisplay';
import { TaskFiles } from './taskDetail/TaskFiles';
import { TaskComments } from './taskDetail/TaskComments';
import { FilePreviewModal } from './taskDetail/FilePreviewModal';

// Import des composants

interface TaskDetailsModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
    onUpdateTask: (updates: Partial<Task>) => void;
}

// Fonctions utilitaires
const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR');
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

const getStatusDisplay = (status: string) => {
    const map: any = {
        backlog: 'En attente',
        todo: 'Ouvert',
        doing: 'En cours',
        done: 'Terminé',
    };
    return map[status] || status;
};

const getStatusColor = (status: string) => {
    const map: any = {
        backlog: 'bg-gray-100 text-gray-800',
        todo: 'bg-blue-100 text-blue-800',
        doing: 'bg-yellow-100 text-yellow-800',
        done: 'bg-green-100 text-green-800',
    };
    return map[status] || 'bg-gray-100';
};

const getPriorityDisplay = (priority: string) => {
    const map: any = { low: 'Basse', medium: 'Normale', high: 'Élevée' };
    return map[priority] || priority;
};

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
    const [toast, setToast] = useState({ show: false, message: '' });

    // Initialisation
    useEffect(() => {
        if (isOpen && task.id) {
            setEditedTask(task);
            fetchTaskDetails();
            fetchAvailableUsers();
        }
    }, [isOpen, task.id]);

    // Fonctions utilitaires
    const showToast = (message: string) => {
        setToast({ show: true, message });
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
        } catch (error) {
            console.error('Erreur détails:', error);
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
        } catch (error) {
            console.error('Erreur users:', error);
            setAvailableUsers([]);
        }
    };

    // Gestion des mises à jour
    const handleSaveChanges = async () => {
        try {
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

            await taskService.updateTask(task.id, updates);
            onUpdateTask(editedTask);
            setIsEditing(false);
            showToast('Tâche mise à jour avec succès !');
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            showToast('Erreur lors de la sauvegarde');
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
            }
            setTempTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setEditedTask((prev) => ({
            ...prev,
            tags: prev.tags ? prev.tags.filter((t) => t !== tagToRemove) : [],
        }));
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
                showToast('Téléchargement démarré');
            }
        } catch (error) {
            console.error('Erreur téléchargement:', error);
            showToast('Erreur lors du téléchargement');
        }
    };

    const handleDeleteFile = async (fileId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

        try {
            await taskFileService.deleteFile(fileId);
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            showToast('Fichier supprimé');
        } catch (error) {
            console.error('Erreur suppression:', error);
            showToast('Erreur lors de la suppression');
        }
    };

    const handleFileUpload = async (filesList: FileList) => {
        const filesArray = Array.from(filesList);

        try {
            setLoading(true);
            for (const file of filesArray) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('task_id', task.id.toString());
                const uploadedFile = await taskFileService.uploadFiles(formData);
                setFiles((prev) => [uploadedFile, ...prev]);
            }
            showToast(`${filesArray.length} fichier(s) ajouté(s)`);
        } catch (error) {
            console.error('Erreur upload:', error);
            showToast("Erreur lors de l'upload");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (content: string) => {
        const newComment = await taskCommentService.createComment({
            task_id: task.id,
            content,
        });
        setComments([newComment, ...comments]);
        showToast('Commentaire ajouté');
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Principal */}
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <Toast
                    message={toast.message}
                    isVisible={toast.show}
                    onClose={() => setToast({ ...toast, show: false })}
                />

                <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between h-14 border-b border-gray-300 px-6 bg-white">
                        <div className="flex items-center space-x-3">
                            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 border border-gray-300 rounded">
                                Tâche #{task.id}
                            </span>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedTask.title}
                                    onChange={(e) => handleFieldChange('title', e.target.value)}
                                    className="text-lg font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 outline-none px-1 bg-transparent"
                                    placeholder="Titre de la tâche"
                                />
                            ) : (
                                <span className="text-lg font-bold text-gray-900 truncate max-w-md">
                                    {editedTask.title}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {isEditing ? (
                                <button
                                    onClick={handleSaveChanges}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                                >
                                    <Save size={14} />
                                    Sauvegarder
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
                                >
                                    <Edit2 size={14} />
                                    Éditer
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Corps */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Colonne Gauche */}
                        <div className="flex-1 overflow-y-auto p-6 lg:max-w-[calc(100%-384px)]">
                            {/* Description */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold text-gray-900">Description</h3>
                                </div>
                                {isEditing ? (
                                    <textarea
                                        value={editedTask.description || ''}
                                        onChange={(e) =>
                                            handleFieldChange('description', e.target.value)
                                        }
                                        className="w-full min-h-[100px] p-3 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-y transition-colors"
                                        placeholder="Ajouter une description..."
                                    />
                                ) : (
                                    <div
                                        className={`p-4 rounded-lg border ${
                                            editedTask.description
                                                ? 'bg-gray-50 border-gray-200'
                                                : 'border-dashed border-gray-300'
                                        }`}
                                    >
                                        {editedTask.description ? (
                                            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                                {editedTask.description}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">
                                                Aucune description fournie.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Grille de Propriétés */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <FieldDisplay
                                    label="Statut"
                                    icon={CheckSquare}
                                    isEditing={isEditing}
                                    isSelect={true}
                                    isPill={true}
                                    value={editedTask.status}
                                    displayValue={getStatusDisplay(editedTask.status)}
                                    color={getStatusColor(editedTask.status)}
                                    options={[
                                        { value: 'backlog', label: 'En attente' },
                                        { value: 'todo', label: 'Ouvert' },
                                        { value: 'doing', label: 'En cours' },
                                        { value: 'done', label: 'Terminé' },
                                    ]}
                                    onChange={(val) => handleFieldChange('status', val)}
                                />

                                <FieldDisplay
                                    label="Assigné à"
                                    icon={User}
                                    isEditing={isEditing}
                                    isSelect={true}
                                    value={
                                        editedTask.assigned_to
                                            ? editedTask.assigned_to.toString()
                                            : ''
                                    }
                                    displayValue={editedTask.assignee?.name || 'Non assigné'}
                                    options={[
                                        { value: '', label: 'Non assigné' },
                                        ...availableUsers.map((u) => ({
                                            value: u.id.toString(),
                                            label: u.name,
                                        })),
                                    ]}
                                    onChange={handleAssigneeChange}
                                />

                                <FieldDisplay
                                    label="Priorité"
                                    icon={Zap}
                                    isEditing={isEditing}
                                    isSelect={true}
                                    value={editedTask.priority}
                                    displayValue={getPriorityDisplay(editedTask.priority)}
                                    options={[
                                        { value: 'low', label: 'Basse' },
                                        { value: 'medium', label: 'Normale' },
                                        { value: 'high', label: 'Élevée' },
                                    ]}
                                    onChange={(val) => handleFieldChange('priority', val)}
                                />

                                <FieldDisplay
                                    label="Estimation"
                                    icon={Clock}
                                    isEditing={isEditing}
                                    isInput={true}
                                    inputType="number"
                                    value={editedTask.estimated_time}
                                    displayValue={formatTime(editedTask.estimated_time)}
                                    onChange={(val) => handleFieldChange('estimated_time', val)}
                                />

                                <FieldDisplay
                                    label="Date de début"
                                    icon={Calendar}
                                    isEditing={isEditing}
                                    isDate={true}
                                    value={formatDateForInput(editedTask.start_date ?? undefined)}
                                    displayValue={formatDate(editedTask.start_date ?? undefined)}
                                    onChange={(val) => handleFieldChange('start_date', val)}
                                />

                                <FieldDisplay
                                    label="Échéance"
                                    icon={Calendar}
                                    isEditing={isEditing}
                                    isDate={true}
                                    value={formatDateForInput(editedTask.due_date ?? undefined)}
                                    displayValue={formatDate(editedTask.due_date ?? undefined)}
                                    onChange={(val) => handleFieldChange('due_date', val)}
                                />
                            </div>

                            {/* Tags */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag size={14} className="text-gray-500" />
                                    <span className="text-xs font-semibold uppercase text-gray-500">
                                        Mots-clés / Tags
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {editedTask.tags?.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full animate-fade-in"
                                        >
                                            {tag}
                                            {isEditing && (
                                                <button
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-blue-900 transition-colors"
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
                                            placeholder="+ Ajouter (Entrée)"
                                            className="text-xs px-2 py-1 border border-dashed border-gray-300 rounded-full focus:outline-none focus:border-blue-400 min-w-[100px] bg-transparent"
                                        />
                                    ) : (
                                        (!editedTask.tags || editedTask.tags.length === 0) && (
                                            <span className="text-xs text-gray-400 italic">
                                                Aucun tag
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Onglets */}
                            <div className="border-b mb-6 border-gray-300">
                                <nav className="flex space-x-6 -mb-px">
                                    {[
                                        'Détails',
                                        `Fichiers (${files.length})`,
                                        `Commentaires (${comments.length})`,
                                    ].map((tab) => {
                                        const tabName = tab.split(' ')[0];
                                        return (
                                            <button
                                                key={tabName}
                                                onClick={() => setActiveTab(tabName)}
                                                className={`py-2 px-1 text-xs font-medium border-b-2 transition-colors ${
                                                    activeTab === tabName
                                                        ? 'border-blue-600 text-blue-600'
                                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                                }`}
                                            >
                                                {tab}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Contenu Onglets */}
                            <div className="space-y-6">
                                {activeTab === 'Détails' && (
                                    <div className="text-sm text-gray-500 italic">
                                        Visualisez l'historique dans la colonne de droite.
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

                        {/* Colonne Activité */}
                        <div className="w-96 border-l flex flex-col bg-gray-50 border-gray-300">
                            <div className="flex items-center justify-between p-4 border-b bg-white border-gray-300">
                                <h3 className="text-lg font-semibold text-gray-900">Activité</h3>
                                <button
                                    onClick={() => setShowActivity(!showActivity)}
                                    className="text-gray-500 hover:bg-gray-100 p-1 rounded transition-colors"
                                >
                                    {showActivity ? (
                                        <ChevronUp size={16} />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )}
                                </button>
                            </div>

                            {showActivity && (
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    <div className="text-xs text-gray-500">
                                        <span className="font-semibold text-gray-900">Système</span>{' '}
                                        a créé la tâche le {formatDate(task.created_at)}
                                    </div>
                                    {comments.map((c) => (
                                        <div
                                            key={c.id}
                                            className="text-xs border-l-2 border-blue-200 pl-2"
                                        >
                                            <span className="font-semibold">{c.user?.name}</span> a
                                            commenté le{' '}
                                            {new Date(c.created_at).toLocaleDateString('fr-FR')}.
                                        </div>
                                    ))}
                                    {files.map((f) => (
                                        <div
                                            key={f.id}
                                            className="text-xs border-l-2 border-green-200 pl-2"
                                        >
                                            <span className="font-semibold">Système</span> a ajouté
                                            le fichier "{f.file_name}" le{' '}
                                            {new Date(f.created_at).toLocaleDateString('fr-FR')}.
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
