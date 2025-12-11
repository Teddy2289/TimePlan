// src/components/tasks/CreateTaskModal.tsx - VERSION COMPLÈTE AVEC SAUVEGARDE
import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Calendar,
  Tag,
  Clock,
  AlertCircle,
  User,
  FileText,
  MessageSquare,
  Paperclip,
  File,
  Image,
  Video,
  Music,
  FileIcon,
  Upload,
  Trash2,
  Eye,
  Download,
  CheckSquare,
  ListChecks,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  Zap,
  Search,
} from "lucide-react";
import taskService, {
  type CreateTaskRequest,
  type Task as ApiTask,
} from "../../services/taskService";
import taskCommentService, {
  type CreateCommentData,
  type TaskComment,
} from "../../services/taskCommentService";
import taskFileService, { type TaskFile } from "../../services/taskFileService";
import type { User as AppUser } from "../../types";
import { statusMapping } from "../../utils/statusMapping";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: ApiTask) => void;
  projectId: number;
  projectName?: string;
  availableUsers: AppUser[];
  defaultAssigneeId?: number;
  defaultStatus?: ApiTask["status"];
}

// Composant FieldDisplay étendu avec support des dates
const FieldDisplay: React.FC<{
  label: string;
  value: any;
  color?: string;
  isButton?: boolean;
  icon?: React.ElementType;
  isPill?: boolean;
  isSelect?: boolean;
  isDateInput?: boolean;
  isNumberInput?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  onDateChange?: (startDate: string, endDate: string) => void;
}> = ({
  label,
  value,
  color = "text-gray-600",
  isButton = false,
  icon: Icon,
  isPill = false,
  isSelect = false,
  isDateInput = false,
  isNumberInput = false,
  placeholder = "",
  options = [],
  onChange,
  onDateChange,
}) => {
  const [showDateInputs, setShowDateInputs] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateSave = () => {
    if (startDate && endDate && onDateChange) {
      onDateChange(startDate, endDate);
      setShowDateInputs(false);
    }
  };

  // Si c'est un champ de date avec bouton, afficher les inputs au clic
  if (isDateInput && isButton && !showDateInputs) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center space-x-1 mb-1">
          {Icon && <Icon size={14} className="text-gray-500" />}
          <span className="text-xs font-semibold uppercase text-gray-500">
            {label}
          </span>
        </div>
        <button
          onClick={() => setShowDateInputs(true)}
          className={`text-xs font-medium ${color} hover:underline w-full text-left px-2 py-1 border border-gray-300 rounded hover:border-blue-500 bg-white`}>
          {value || placeholder}
        </button>
      </div>
    );
  }

  // Si c'est un champ de date en mode édition
  if (isDateInput && showDateInputs) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center space-x-1 mb-1">
          {Icon && <Icon size={14} className="text-gray-500" />}
          <span className="text-xs font-semibold uppercase text-gray-500">
            {label}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="Début"
            />
            <span className="text-xs text-gray-400 flex items-center">→</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs w-full px-2 py-1 border border-gray-300 rounded"
              placeholder="Échéance"
              min={startDate}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDateSave}
              disabled={!startDate || !endDate}
              className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
              OK
            </button>
            <button
              onClick={() => setShowDateInputs(false)}
              className="flex-1 text-xs px-2 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-1 mb-1">
        {Icon && <Icon size={14} className="text-gray-500" />}
        <span className="text-xs font-semibold uppercase text-gray-500">
          {label}
        </span>
      </div>
      <div className="min-h-[24px]">
        {isSelect ? (
          <select
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            className={`text-xs w-full px-2 py-1 border border-gray-300 rounded ${color}`}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : isNumberInput ? (
          <input
            type="number"
            value={value || ""}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={`text-xs w-full px-2 py-1 border border-gray-300 rounded ${color}`}
            min="0"
            step="0.5"
          />
        ) : isPill ? (
          <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
            {value}
          </span>
        ) : isButton ? (
          <button className={`text-xs font-medium ${color} hover:underline`}>
            {value}
          </button>
        ) : (
          <span className={`text-xs ${color}`}>{value}</span>
        )}
      </div>
    </div>
  );
};

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  projectName,
  availableUsers,
  defaultAssigneeId,
  defaultStatus = "backlog",
}) => {
  // Conversion des statuts
  const convertAppStatusToApiStatus = (
    appStatus: string
  ): ApiTask["status"] => {
    const statusMap: Record<string, ApiTask["status"]> = {
      "en-attente": "backlog",
      ouvert: "todo",
      "en-cours": "doing",
      "a-valider": "todo",
      termine: "done",
    };
    return statusMap[appStatus] || "backlog";
  };

  // Convertir pour l'affichage dans FieldDisplay
  const convertApiStatusToDisplay = (apiStatus: string): string => {
    const uiStatus =
      statusMapping.apiToUi[apiStatus as keyof typeof statusMapping.apiToUi] ||
      "en-attente";
    return (
      statusMapping.displayNames[
        uiStatus as keyof typeof statusMapping.displayNames
      ] || uiStatus
    );
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États du formulaire principal
  const [formData, setFormData] = useState<CreateTaskRequest>({
    project_id: projectId,
    title: "",
    description: "",
    assigned_to: defaultAssigneeId || undefined,
    status: convertAppStatusToApiStatus("en-attente"),
    priority: "medium",
    start_date: "",
    due_date: "",
    estimated_time: undefined,
    tags: [],
  });

  // États pour les commentaires (colonne de droite)
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [showActivity, setShowActivity] = useState(true);

  // États pour les fichiers
  const [files, setFiles] = useState<File[]>([]);
  const [fileDescription, setFileDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // États pour les étiquettes et relations
  const [newLabel, setNewLabel] = useState("");
  const [labels, setLabels] = useState<string[]>(["nouvelle tâche"]);
  const [newRelation, setNewRelation] = useState("");

  // États pour les sous-tâches
  const [newSubtask, setNewSubtask] = useState("");
  const [subtasks, setSubtasks] = useState<any[]>([]);

  const convertApiStatusToAppStatus = (apiStatus: string): string => {
    const statusMap: Record<string, string> = {
      backlog: "en-attente",
      todo: "ouvert",
      doing: "en-cours",
      done: "termine",
    };
    return statusMap[apiStatus] || apiStatus;
  };

  // Formatage des dates pour l'affichage
  const formatDateDisplay = () => {
    if (formData.start_date && formData.due_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.due_date);
      return `${start.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      })} → ${end.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      })}`;
    }
    return "Début → Échéance";
  };

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setFormData({
        project_id: projectId,
        title: "",
        description: "",
        assigned_to: defaultAssigneeId || undefined,
        status: convertAppStatusToApiStatus("en-attente"),
        priority: "medium",
        start_date: "",
        due_date: "",
        estimated_time: undefined,
        tags: [],
      });
      setNewComment("");
      setComments([]);
      setFiles([]);
      setUploadedFiles([]);
      setFileDescription("");
      setNewLabel("");
      setLabels(["nouvelle tâche"]);
      setError(null);
    }
  }, [isOpen, projectId, defaultAssigneeId]);

  // Gestion du formulaire
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "estimated_time") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : undefined,
      }));
    } else if (name === "assigned_to") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseInt(value, 10) : undefined,
      }));
    } else if (name === "start_date" || name === "due_date") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Gestion des dates via FieldDisplay
  const handleDateChange = (startDate: string, endDate: string) => {
    setFormData((prev) => ({
      ...prev,
      start_date: startDate,
      due_date: endDate,
    }));
  };

  // Gestion des tags
  const [newTag, setNewTag] = useState("");
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  // Gestion des étiquettes
  const handleAddLabel = () => {
    if (newLabel.trim() && !labels.includes(newLabel.trim())) {
      setLabels((prev) => [...prev, newLabel.trim()]);
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (labelToRemove: string) => {
    setLabels((prev) => prev.filter((label) => label !== labelToRemove));
  };

  // Gestion des fichiers
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Gestion des commentaires
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        content: newComment,
        user: {
          id: 1,
          name: "Vous",
        },
        created_at: new Date().toISOString(),
        replies: [],
      };
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    }
  };

  // Gestion des sous-tâches
  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: Date.now(),
        title: newSubtask.trim(),
        completed: false,
        created_at: new Date().toISOString(),
      };
      setSubtasks((prev) => [...prev, subtask]);
      setNewSubtask("");
    }
  };

  const toggleSubtask = (id: number) => {
    setSubtasks((prev) =>
      prev.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st
      )
    );
  };

  // Fonction pour uploader les fichiers après création de la tâche
  const uploadTaskFiles = async (taskId: number) => {
    if (files.length === 0) return [];

    try {
      const uploaded = await taskFileService.uploadFiles(
        taskId,
        files,
        fileDescription
      );
      return uploaded;
    } catch (err) {
      console.error("Erreur lors de l'upload des fichiers:", err);
      throw new Error("Certains fichiers n'ont pas pu être uploadés");
    }
  };

  // Fonction pour créer les commentaires après création de la tâche
  const createTaskComments = async (taskId: number) => {
    if (comments.length === 0) return [];

    try {
      const createdComments = [];
      for (const comment of comments) {
        const commentData: CreateCommentData = {
          task_id: taskId,
          content: comment.content,
        };
        const created = await taskCommentService.createComment(commentData);
        createdComments.push(created);
      }
      return createdComments;
    } catch (err) {
      console.error("Erreur lors de la création des commentaires:", err);
      throw new Error("Certains commentaires n'ont pas pu être créés");
    }
  };

  // Soumission du formulaire avec tous les éléments
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error("Le titre est requis");
      }

      // Validation des dates
      if (formData.start_date && formData.due_date) {
        const start = new Date(formData.start_date);
        const end = new Date(formData.due_date);
        if (end < start) {
          throw new Error(
            "La date d'échéance doit être après la date de début"
          );
        }
      }

      // 1. Créer la tâche principale
      const createdTask = await taskService.createTask(formData);

      // 2. Uploader les fichiers si présents
      let uploadedFilesResult: TaskFile[] = [];
      if (files.length > 0) {
        try {
          uploadedFilesResult = await uploadTaskFiles(createdTask.id);
          console.log("Fichiers uploadés:", uploadedFilesResult);
        } catch (fileError: any) {
          // On continue même si l'upload des fichiers échoue
          console.warn(
            "Upload des fichiers partiellement échoué:",
            fileError.message
          );
        }
      }

      // 3. Créer les commentaires si présents
      let createdCommentsResult: TaskComment[] = [];
      if (comments.length > 0) {
        try {
          createdCommentsResult = await createTaskComments(createdTask.id);
          console.log("Commentaires créés:", createdCommentsResult);
        } catch (commentError: any) {
          // On continue même si la création des commentaires échoue
          console.warn(
            "Création des commentaires partiellement échouée:",
            commentError.message
          );
        }
      }

      // 4. Combiner toutes les données pour le retour
      const taskWithExtras = {
        ...createdTask,
        files: uploadedFilesResult,
        comments: createdCommentsResult,
      };

      onSubmit(taskWithExtras);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création de la tâche"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Données pour les champs de la tâche - VERSION SIMPLIFIÉE
  const taskFields = [
    {
      label: "Status",
      value: formData.status, // CHANGEMENT: Utiliser la valeur API (ex: "backlog") pour correspondre aux options
      color: "bg-purple-100 text-purple-800",
      icon: CheckSquare,
      isPill: true,
      isSelect: true,
      options: [
        { value: "backlog", label: "En attente" },
        { value: "todo", label: "Ouvert" },
        { value: "doing", label: "En cours" }, // Note: L'option "À valider" a la même valeur API que "Ouvert". C'est peut-être voulu, mais peut prêter à confusion.
        { value: "todo", label: "À valider" },
        { value: "done", label: "Terminé" },
      ],
      onChange: (value: string) =>
        setFormData((prev) => ({
          ...prev,
          status: value as ApiTask["status"],
        })),
    },
    {
      label: "Assigné",
      value: formData.assigned_to?.toString() || "", // CHANGEMENT: Utiliser l'ID de l'assigné (converti en string ou chaine vide)
      color: "text-gray-600",
      icon: User,
      isSelect: true,
      options: [
        { value: "", label: "Non assigné" },
        ...availableUsers.map((user) => ({
          value: user.id.toString(),
          label: user.name,
        })),
      ],
      onChange: (value: string) =>
        setFormData((prev) => ({
          ...prev, // Le onChange de FieldDisplay enverra la valeur de l'option (l'ID en string)
          assigned_to: value ? parseInt(value) : undefined,
        })),
    },
    // CHAMP DATES DIRECTEMENT VISIBLE
    {
      label: "Dates",
      value: formatDateDisplay(),
      color: "text-gray-600",
      icon: Calendar,
      isDateInput: true,
      isButton: true,
      placeholder: "Début → Échéance",
      onDateChange: handleDateChange,
    },
    {
      label: "Priorité",
      value:
        formData.priority === "high"
          ? "Élevée"
          : formData.priority === "medium"
          ? "Moyenne"
          : formData.priority === "low"
          ? "Basse"
          : "Vide",
      color: "text-gray-600",
      icon: Zap,
      isSelect: true,
      options: [
        { value: "low", label: "Basse" },
        { value: "medium", label: "Moyenne" },
        { value: "high", label: "Élevée" },
      ],
      onChange: (value: string) =>
        setFormData((prev) => ({ ...prev, priority: value as any })),
    },
    {
      label: "Temps estimé",
      value: formData.estimated_time || "",
      color: "text-gray-600",
      icon: Clock,
      isNumberInput: true,
      placeholder: "Heures",
      onChange: (value: string) =>
        setFormData((prev) => ({
          ...prev,
          estimated_time: value ? parseInt(value) : undefined,
        })),
    },
    {
      label: "Suivre le temps",
      value: "Ajouter du temps",
      color: "text-blue-600",
      isButton: true,
    },
  ];

  const fieldGroups = [taskFields.slice(0, 3), taskFields.slice(3, 6)];

  const activityItems = [
    {
      user: "Utilisateur actuel",
      action: "créera cette tâche",
      time: "Maintenant",
      isCreator: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between h-14 border-b border-gray-300 px-6 text-xs text-gray-700 bg-white">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 border border-gray-300 rounded">
              Création de tâche
            </span>
            <span className="text-lg font-bold text-gray-900">
              Nouvelle tâche
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Corps principal */}
        <div className="flex flex-1 overflow-hidden">
          {/* Colonne Principale (Gauche) */}
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[calc(100%-384px)]">
            {/* Titre et IA */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Titre de la tâche"
                  className="text-2xl font-bold text-gray-900 w-full border-none focus:outline-none focus:ring-0"
                  autoFocus
                  required
                />
                <button className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">
                  <span>Demander à l'IA</span>
                </button>
              </div>

              {/* Action rapide */}
              <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-600 mr-3 mt-0.5">
                  <ListChecks size={18} />
                </span>
                <p className="text-xs text-blue-800 flex-1">
                  Demandez à l'IA de <strong>résumer</strong> des sous-tâches ou{" "}
                  <strong>trouver des tâches similaires</strong>
                </p>
                <button className="ml-4 p-1 text-blue-600 hover:text-blue-800 rounded-full">
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Propriétés de la tâche */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {fieldGroups.flat().map((field, index) => (
                <div key={index} className="col-span-1">
                  <FieldDisplay {...field} />
                </div>
              ))}
            </div>

            {/* Étiquettes et Relations */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="col-span-1">
                <div className="flex items-center space-x-1 mb-1">
                  <Tag size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Étiquettes
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {labels.map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs font-medium rounded-full flex items-center">
                      {label}
                      <button
                        onClick={() => handleRemoveLabel(label)}
                        className="ml-1 hover:text-gray-600">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Ajouter étiquette"
                      className="text-xs px-2 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
                    />
                    <button
                      onClick={handleAddLabel}
                      className="text-xs text-gray-500 hover:text-gray-700">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex items-center space-x-1 mb-1">
                  <LinkIcon size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Relations
                  </span>
                </div>
                <input
                  type="text"
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  placeholder="Ajouter une relation..."
                  className="text-xs text-gray-600 w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-900">
                  Description
                </span>
                <div className="flex items-center gap-2 text-gray-500">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <BoldIcon size={12} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ItalicIcon size={12} />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <ListIcon size={12} />
                  </button>
                </div>
              </div>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Décrivez la tâche en détail..."
              />
            </div>

            {/* Sous-tâches */}
            <div className="mb-8">
              <h4 className="text-xs font-semibold text-gray-900 mb-3">
                Sous-tâches ({subtasks.length})
              </h4>
              <div className="space-y-2 mb-3">
                {subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSubtask(subtask.id)}
                      className={`p-1 rounded ${
                        subtask.completed ? "text-green-600" : "text-gray-400"
                      }`}>
                      <CheckSquare size={14} />
                    </button>
                    <span
                      className={`text-xs ${
                        subtask.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Ajouter une sous-tâche..."
                  className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  Ajouter
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="flex items-center space-x-1 mb-2">
                <Tag size={14} className="text-gray-500" />
                <span className="text-xs font-semibold uppercase text-gray-500">
                  Tags
                </span>
              </div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Ajouter un tag..."
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                  <Plus size={12} />
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-blue-900">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Fichiers */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-gray-900 mb-3">
                Pièces jointes ({files.length})
              </h4>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-xs text-gray-500 hover:border-blue-500 transition-colors cursor-pointer">
                <Upload size={24} className="mb-2 text-gray-400" />
                <span className="text-blue-600 hover:underline">
                  Déposez vos fichiers ici pour charger
                </span>
                <p className="text-gray-400 mt-1">ou cliquez pour parcourir</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded text-xs">
                      <div className="flex items-center gap-2">
                        <File size={12} className="text-gray-500" />
                        <span className="text-gray-900 truncate">
                          {file.name}
                        </span>
                        <span className="text-gray-500">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-500 hover:text-red-600">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton de création */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 mb-4">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.title.trim()}
                className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus size={12} />
                    Créer la tâche
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Colonne Activité (Droite) */}
          <div className="w-96 border-l flex flex-col bg-gray-50 border-gray-300">
            {/* Header de la colonne d'activité */}
            <div className="flex items-center justify-between p-4 border-b bg-white border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900">Activité</h3>
              <div className="flex items-center space-x-2 text-gray-500">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <Search size={16} />
                </button>
                <button
                  onClick={() => setShowActivity(!showActivity)}
                  className="p-1 hover:bg-gray-100 rounded-full">
                  {showActivity ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Zone de fil de l'Activité */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${
                !showActivity && "hidden"
              }`}>
              <div className="space-y-4">
                {activityItems.map((item, index) => (
                  <div key={index} className="text-xs">
                    <p className="text-gray-900">
                      <span className="font-semibold">{item.user}</span>{" "}
                      {item.action}
                    </p>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="text-xs border-l-2 border-blue-200 pl-2">
                    <p className="text-gray-900">
                      <span className="font-semibold">{comment.user.name}</span>{" "}
                      a ajouté un commentaire
                    </p>
                    <p className="text-gray-600 mt-1">{comment.content}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleTimeString(
                        "fr-FR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone de Saisie de Commentaire */}
            <div className="p-4 border-t bg-white border-gray-300">
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrivez un commentaire..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[50px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3 text-gray-500">
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full">
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full">
                      <Paperclip size={14} />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full">
                      <Image size={14} />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                    Commentaire
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icônes supplémentaires
const BoldIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
  </svg>
);

const ItalicIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <line x1="19" y1="4" x2="10" y2="4"></line>
    <line x1="14" y1="20" x2="5" y2="20"></line>
    <line x1="15" y1="4" x2="9" y2="20"></line>
  </svg>
);

const ListIcon = ({ size }: { size: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

export default CreateTaskModal;
