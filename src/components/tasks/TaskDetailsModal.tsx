import React, { useState } from "react";
import { type Task } from "../../types"; // Assurez-vous que le type Task est correctement défini
import {
  X,
  Paperclip,
  Clock,
  User,
  CheckSquare,
  Plus,
  Calendar,
  ListChecks,
  Link,
  ChevronDown,
  ChevronUp,
  Tag,
  Zap,
} from "lucide-react";

interface TaskDetailsModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (updates: Partial<Task>) => void;
}

// --- Données Statiques Simulant la Capture ---
const getSimulatedDetails = (taskId: string) => {
  return {
    header: {
      taskName: "Gestion des contacts : formateur",
      taskNumber: "669BNN6M8",
    },
    quickAction: {
      text: "Demandez à Brain de **résumer** des sous-tâches ou **trouver des tâches similaires**",
    },
    fields: [
      {
        label: "Status",
        value: "À VALIDER",
        color: "bg-purple-100 text-purple-800",
        icon: CheckSquare,
        isPill: true,
      },
      { label: "Assigné", value: "Vide", color: "text-gray-600", icon: User },
      {
        label: "Dates",
        value: "Début → Échéance",
        color: "text-gray-600",
        icon: Calendar,
      },
      { label: "Priorité", value: "Vide", color: "text-gray-600", icon: Zap },
      {
        label: "Temps estimé",
        value: "Vide",
        color: "text-gray-600",
        icon: Clock,
      },
      {
        label: "Suivre le temps",
        value: "Ajouter du temps",
        color: "text-blue-600",
        isButton: true,
      },
    ],
    labels: ["admin"],
    relations: "Vide",
    entity: {
      title: "Entité à modifier : ajouter une relation avec formation",
      description: "Intégrer un module pour l'importation (traitement lot)",
    },
    tabs: ["Détails", "Sous-tâches", "Éléments d'action"],
    customFields: [{ label: "Demandeur", value: "Vide" }],
    attachments: {
      label: "Pièces jointes",
      placeholder: "Déposez vos fichiers ici pour charger",
    },
    activity: [
      {
        user: "MBL IT Project Manager",
        action: "a créé cette tâche",
        time: "8 avr. à 9:43 am",
        isCreator: true,
      },
      {
        user: "MBL IT Project Manager",
        action: "a abonné : un abonné",
        time: "11 avr. à 4:12 pm",
        details: "Vous",
      },
    ],
  };
};

// Composant pour afficher les champs/propriétés
const FieldDisplay: React.FC<{
  label: string;
  value: any;
  color?: string;
  isButton?: boolean;
  icon?: React.ElementType;
  isPill?: boolean;
}> = ({
  label,
  value,
  color = "text-gray-900",
  isButton = false,
  icon: Icon,
  isPill = false,
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-1 mb-1">
        {Icon && <Icon size={14} className="text-gray-500" />}
        <span className="text-xs font-semibold uppercase text-gray-500">
          {label}
        </span>
      </div>
      <div className="min-h-[24px]">
        {isPill ? (
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

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("Détails");
  const [showActivity, setShowActivity] = useState(true);

  if (!isOpen) return null;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      console.log("Nouveau commentaire:", comment);
      setComment("");
    }
  };

  const details = getSimulatedDetails(task.id);

  // Filtrer les champs pour les colonnes (2x3 grid)
  const taskFields = details.fields;

  // Séparer les champs pour la grille 2x3
  const fieldGroups = [
    taskFields.slice(0, 3), // Status, Assigné, Dates
    taskFields.slice(3, 6), // Priorité, Temps estimé, Suivre le temps
  ];

  return (
    // Conteneur de la modale: Fond sombre et centrage - OPACITÉ AUGMENTÉE
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4

">
      {" "}
      {/* Contenu de la modale: Largeur et hauteur max, fond blanc */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header de la modale (incluant le titre et le bouton de fermeture) */}
        <div className="flex items-center justify-between h-14 border-b border-gray-300 px-6 text-xs text-gray-700 bg-white">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 border border-gray-300 rounded">
              Tâche
            </span>
            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 border border-gray-300 rounded">
              #{details.header.taskNumber}
            </span>
            <span className="text-lg font-bold text-gray-900">
              {details.header.taskName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Corps principal : Colonne de Contenu (Gauche) et Colonne d'Activité (Droite) */}
        <div className="flex flex-1 overflow-hidden">
          {/* Colonne Principale (Gauche) - Défilement indépendant */}
          <div className="flex-1 overflow-y-auto p-6 lg:max-w-[calc(100%-384px)]">
            {" "}
            {/* Ajusté pour la sidebar de 384px (96 * 4) */}
            {/* Titre et Bouton "Demander à l'IA" */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {details.header.taskName}
                </h2>
                <button className="flex items-center space-x-1 px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">
                  <span>Demander à l'IA</span>
                </button>
              </div>
            </div>
            {/* Action rapide/Description courte */}
            <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <span className="text-blue-600 mr-3 mt-0.5">
                <ListChecks size={18} />
              </span>
              <p className="text-xs text-blue-800 flex-1">
                {details.quickAction.text.split("**").map((part, index) =>
                  index % 2 === 1 ? (
                    <strong key={index} className="font-bold">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>
              <button className="ml-4 p-1 text-blue-600 hover:text-blue-800 rounded-full">
                <X size={14} />
              </button>
            </div>
            {/* Propriétés de la tâche (Fields) - Grille 2x4 pour 8 champs comme dans la capture */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              {fieldGroups.flat().map((field, index) => (
                <div key={index} className="col-span-1">
                  <FieldDisplay {...field} />
                </div>
              ))}
            </div>
            {/* Étiquettes et Relations (Séparés pour la mise en page de l'image) */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="col-span-2">
                <div className="flex items-center space-x-1 mb-1">
                  <Tag size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Étiquettes
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {details.labels.map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-gray-200 text-gray-800 text-xs font-medium rounded-full flex items-center">
                      {label}
                    </span>
                  ))}
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center space-x-1 mb-1">
                  <Link size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Relations
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {details.relations}
                </span>
              </div>
            </div>
            {/* Entité à modifier (Zone de texte) */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-gray-900 mb-2">
                {details.entity.title}
              </p>
              <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] text-xs text-gray-700">
                {details.entity.description}
              </div>
            </div>
            {/* Onglets */}
            <div className="border-b mb-6 border-gray-300">
              <nav className="flex space-x-6 -mb-px">
                {details.tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 text-xs font-medium ${
                      activeTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}>
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
            {/* Contenu de l'onglet actif (Détails) */}
            <div className="space-y-6">
              {/* Champs personnalisés */}
              <div>
                <h4 className="text-xs font-semibold text-gray-900 mb-3">
                  Champs personnalisés
                </h4>
                <div className="space-y-3">
                  {details.customFields.map((field, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">
                        {field.label}
                      </span>
                      <span className="text-xs font-medium text-gray-900">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pièces jointes */}
              <div>
                <h4 className="text-xs font-semibold text-gray-900 mb-3">
                  {details.attachments.label}
                </h4>
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-xs text-gray-500 hover:border-blue-500 transition-colors cursor-pointer">
                  <span className="text-blue-600 hover:underline">
                    Déposez vos fichiers ici pour charger
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne Activité (Droite) - Largeur fixe */}
          <div className="w-96 border-l flex flex-col bg-gray-50 border-gray-300">
            {/* Header de la colonne d'activité */}
            <div className="flex items-center justify-between p-4 border-b bg-white border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900">Activité</h3>
              <div className="flex items-center space-x-2 text-gray-500">
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  {/* Icône de recherche/filtre */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-search">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
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

            {/* Zone de fil de l'Activité - Défilement indépendant */}
            <div
              className={`flex-1 overflow-y-auto p-4 ${
                !showActivity && "hidden"
              }`}>
              <div className="space-y-4">
                {details.activity.map((item, index) => (
                  <div key={index} className="text-xs">
                    <p className="text-gray-900">
                      <span className="font-semibold">{item.user}</span>{" "}
                      {item.action}
                    </p>
                    {item.details && (
                      <p className="text-gray-600">
                        <span className="text-xs text-blue-600">
                          Afficher plus
                        </span>
                      </p>
                    )}
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone de Saisie de Commentaire */}
            <div className="p-4 border-t bg-white border-gray-300">
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Écrivez un commentaire..."
                  className="w-full p-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[50px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3 text-gray-500">
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full">
                      <Plus size={18} />
                    </button>
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full">
                      <Paperclip size={18} />
                    </button>
                    {/* Icônes d'édition */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-image text-gray-400 hover:text-gray-600">
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:bg-gray-400"
                    disabled={!comment.trim()}>
                    <span>Commentaire</span>
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

export default TaskDetailsModal;
