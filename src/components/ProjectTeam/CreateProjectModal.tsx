// src/components/projects/CreateProjectModal.tsx
import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Target,
  FileText,
  Clock,
  Check,
  Loader2,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import projectsTeamsService from "../../services/projectsTeamsService";
import { useToastContext } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string | number;
  onProjectCreated: (project: any) => void;
  teamName?: string;
}

interface ValidationErrors {
  [key: string]: string[];
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  teamId,
  onProjectCreated,
  teamName,
}) => {
  const { showToast } = useToastContext();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [formError, setFormError] = useState("");

  // Options de statut qui correspondent aux valeurs du backend
  const statusOptions = [
    {
      id: "active",
      label: "Actif",
      icon: Target,
      color: "text-green-600",
      description: "Le projet est en cours d'exécution",
    },
    {
      id: "on_hold",
      label: "En attente",
      icon: Clock,
      color: "text-yellow-600",
      description: "Le projet est temporairement suspendu",
    },
    {
      id: "completed",
      label: "Terminé",
      icon: Check,
      color: "text-blue-600",
      description: "Le projet est terminé avec succès",
    },
    {
      id: "cancelled",
      label: "Annulé",
      icon: AlertTriangle,
      color: "text-red-600",
      description: "Le projet a été annulé",
    },
  ];

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      if (end < start) {
        setDateError("La date de fin doit être postérieure à la date de début");
      } else {
        setDateError("");
      }
    }
  }, [formData.start_date, formData.end_date]);

  // Effacer les erreurs de validation quand l'utilisateur modifie un champ
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Effacer l'erreur de validation pour ce champ
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Effacer l'erreur générale du formulaire
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser les erreurs
    setValidationErrors({});
    setFormError("");

    // Validation des dates côté client
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      if (end < start) {
        showToast({
          type: "error",
          message: "La date de fin doit être postérieure à la date de début",
        });
        return;
      }
    }

    if (!formData.name.trim()) {
      showToast({
        type: "error",
        message: "Le nom du projet est requis",
      });
      return;
    }

    try {
      setLoading(true);
      const projectData = {
        team_id: typeof teamId === "string" ? parseInt(teamId, 10) : teamId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        status: formData.status,
      };

      const project = await projectsTeamsService.createProject(projectData);

      onProjectCreated(project);
      onClose();
      resetForm();

      showToast({
        type: "success",
        message: `Le projet "${project.name}" a été créé avec succès`,
        duration: 4000,
      });
    } catch (error: any) {
      console.error("Error creating project:", error);

      // Gestion des erreurs de validation du backend
      if (error.response?.status === 422) {
        const backendErrors = error.response.data.errors;
        if (backendErrors) {
          setValidationErrors(backendErrors);

          // Afficher un toast avec le message général
          if (error.response.data.message) {
            showToast({
              type: "error",
              message: error.response.data.message,
              duration: 5000,
            });
          }

          // Afficher la première erreur comme message général du formulaire
          const firstErrorKey = Object.keys(backendErrors)[0];
          if (firstErrorKey && backendErrors[firstErrorKey]?.[0]) {
            setFormError(backendErrors[firstErrorKey][0]);
          }
        }
      } else {
        // Gestion des autres erreurs
        let errorMessage = "Erreur lors de la création du projet";

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setFormError(errorMessage);
        showToast({
          type: "error",
          message: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "active",
    });
    setDateError("");
    setValidationErrors({});
    setFormError("");
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      resetForm();
    }
  };

  // Fonction pour afficher les erreurs d'un champ spécifique
  const renderFieldError = (fieldName: string) => {
    const errors = validationErrors[fieldName];
    if (!errors || errors.length === 0) return null;

    return (
      <div className="flex items-start mt-1.5 text-xs text-red-600">
        <AlertCircle size={12} className="mr-1 mt-0.5 flex-shrink-0" />
        <div>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Créer un nouveau projet
                </h2>
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Créez un nouveau projet pour organiser vos tâches, suivre la
                progression et collaborer avec votre équipe.
                <span className="block mt-1 font-medium">
                  {teamName && `Équipe : ${teamName}`}
                  {user && ` • Responsable : ${user.name}`}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Message d'erreur général */}
            {formError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle
                    size={16}
                    className="text-red-600 flex-shrink-0"
                  />
                  <p className="text-sm text-red-700 font-medium">
                    {formError}
                  </p>
                </div>
              </div>
            )}

            {/* Section Nom et description */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Informations du projet
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Nom du projet */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Nom du projet *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="ex. Wizi-Learn Platform, Refonte site web, Campagne marketing"
                      className={`w-full p-3.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                        validationErrors.name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      required
                      autoFocus
                      disabled={loading}
                    />
                    {renderFieldError("name")}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Description{" "}
                      <span className="text-gray-400">(facultatif)</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Décrivez les objectifs, livrables et contexte du projet..."
                      className={`w-full p-3.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-28 transition-colors disabled:opacity-50 ${
                        validationErrors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-400 mt-1.5">
                      Cette description aidera les membres à comprendre les
                      objectifs du projet.
                    </p>
                    {renderFieldError("description")}
                  </div>
                </div>
              </div>
            </div>

            {/* Ligne de séparation */}
            <div className="border-t border-gray-200"></div>

            {/* Section Dates et statut */}
            <div className="grid grid-cols-2 gap-8">
              {/* Colonne gauche - Dates */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    Calendrier
                  </h3>

                  <div className="space-y-4">
                    {/* Date de début */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Date de début *
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="date"
                          name="start_date"
                          value={formData.start_date}
                          onChange={handleChange}
                          required
                          min={today}
                          className={`w-full pl-10 pr-3 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                            validationErrors.start_date
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          disabled={loading}
                        />
                      </div>
                      {renderFieldError("start_date")}
                    </div>

                    {/* Date de fin */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Date de fin *
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="date"
                          name="end_date"
                          value={formData.end_date}
                          onChange={handleChange}
                          required
                          min={formData.start_date || today}
                          className={`w-full pl-10 pr-3 py-3 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 ${
                            validationErrors.end_date
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          disabled={loading}
                        />
                      </div>
                      {dateError && (
                        <div className="flex items-center mt-1.5 text-xs text-red-600">
                          <AlertCircle size={12} className="mr-1" />
                          {dateError}
                        </div>
                      )}
                      {renderFieldError("end_date")}
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-xs text-blue-700">
                        <span className="font-medium">Durée estimée : </span>
                        {formData.start_date && formData.end_date
                          ? calculateDuration(
                              formData.start_date,
                              formData.end_date
                            )
                          : "Sélectionnez les dates pour voir la durée"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Statut */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    Statut initial
                  </h3>

                  {validationErrors.status && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle size={14} className="text-red-600" />
                        <p className="text-xs text-red-700 font-medium">
                          {validationErrors.status[0]}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {statusOptions.map((status) => {
                      const Icon = status.icon;
                      return (
                        <label
                          key={status.id}
                          className={`flex items-start space-x-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                            formData.status === status.id
                              ? "border-blue-500 bg-blue-50"
                              : validationErrors.status
                              ? "border-red-200 bg-red-50"
                              : "border-gray-200 hover:bg-gray-50"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                          <div className="flex items-center h-5">
                            <input
                              type="radio"
                              name="status"
                              value={status.id}
                              checked={formData.status === status.id}
                              onChange={handleChange}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              disabled={loading}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Icon size={16} className={status.color} />
                                <span className="text-xs font-medium text-gray-900">
                                  {status.label}
                                </span>
                              </div>
                              {formData.status === status.id && (
                                <Check
                                  size={16}
                                  className="text-blue-600 flex-shrink-0"
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {status.description}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes supplémentaires */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-2">
                <FileText
                  size={16}
                  className="text-gray-500 mt-0.5 flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-700">
                    <span className="font-medium">Note : </span>
                    Le projet sera automatiquement associé à cette équipe. Vous
                    pourrez ultérieurement ajouter des membres, créer des tâches
                    et définir des jalons.
                  </p>
                </div>
              </div>
            </div>

            {/* Affichage des autres erreurs de validation */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-xs font-semibold text-red-800 mb-2">
                  Erreurs de validation à corriger :
                </h4>
                <ul className="text-xs text-red-700 space-y-1">
                  {Object.entries(validationErrors).map(([field, errors]) =>
                    errors.map((error, index) => (
                      <li
                        key={`${field}-${index}`}
                        className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>
                          <span className="font-medium">{field}</span>: {error}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </form>
        </div>

        {/* Footer avec boutons */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p>
                {user
                  ? `Vous serez automatiquement désigné comme responsable de ce projet.`
                  : "Vous devez être connecté pour créer un projet."}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-2.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() || loading || !user || !!dateError
                }
                className="px-8 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer le projet"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fonction utilitaire pour calculer la durée
const calculateDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays === 1) {
    return "1 jour";
  } else if (diffDays < 30) {
    return `${diffDays} jours`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} mois`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} an${years > 1 ? "s" : ""}${
      remainingMonths > 0 ? ` et ${remainingMonths} mois` : ""
    }`;
  }
};

export default CreateProjectModal;
