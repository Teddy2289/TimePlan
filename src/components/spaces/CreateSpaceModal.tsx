// src/components/spaces/CreateSpaceModal.tsx
import React, { useState } from "react";
import {
  X,
  Lock,
  Users,
  Briefcase,
  Check,
  Globe,
  FileText,
  Loader2,
} from "lucide-react";
import teamService from "../../services/teamService";
import { useToastContext } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext"; // Import du contexte d'authentification
import type { CreateTeamRequest } from "../../types";

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpaceCreated?: (team: any) => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  onSpaceCreated,
}) => {
  const [spaceName, setSpaceName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("briefcase");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState("edit");
  const [isPrivate, setIsPrivate] = useState(false);
  const [useTemplates, setUseTemplates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { showToast } = useToastContext();
  const { user } = useAuth(); // Récupérer l'utilisateur connecté

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!spaceName.trim()) {
      showToast({
        type: "error",
        message: "Le nom de l'espace est requis",
      });
      return;
    }

    // Vérifier que l'utilisateur est connecté
    if (!user) {
      showToast({
        type: "error",
        message: "Vous devez être connecté pour créer un espace",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Formater les données pour l'API
      // Le backend récupérera automatiquement l'owner_id depuis le token JWT
      const teamData: CreateTeamRequest = teamService.formatTeamRequest(
        {
          name: spaceName,
          icon: selectedIcon,
          description,
          permission,
          isPrivate,
          useTemplates,
        },
        user.id
      );

      console.log("Création de l'équipe avec les données:", teamData);
      console.log("Utilisateur connecté:", user.id, user.name);

      // Appeler le service pour créer l'équipe
      const createdTeam = await teamService.createTeam(teamData);

      // Log l'équipe créée
      console.log("Équipe créée:", createdTeam);

      // Si on utilise des templates, on peut ajouter d'autres logiques ici
      if (useTemplates) {
        // Logique pour appliquer des templates si nécessaire
        console.log("Template applied to team:", createdTeam.id);
      }

      // Afficher le toast de succès
      showToast({
        type: "success",
        message: `L'espace "${createdTeam.name}" a été créé avec succès !`,
        duration: 4000,
      });

      // Ajouter automatiquement l'utilisateur comme membre de l'équipe
      try {
        // L'utilisateur est déjà le propriétaire, mais on peut l'ajouter explicitement comme membre
        // ou laisser le backend le faire automatiquement
        await teamService.addMember(createdTeam.id, user.id);
        console.log("Utilisateur ajouté comme membre de l'équipe");
      } catch (memberError) {
        console.warn(
          "Impossible d'ajouter l'utilisateur comme membre:",
          memberError
        );
        // Ce n'est pas critique, continuer
      }

      // Appeler le callback si fourni
      if (onSpaceCreated) {
        onSpaceCreated({
          ...createdTeam,
          // Ajouter des propriétés supplémentaires pour la compatibilité avec le frontend
          icon: selectedIcon,
          permission,
          isPrivate,
        });
      }

      // Fermer la modal et réinitialiser le formulaire
      onClose();
      resetForm();
    } catch (error: any) {
      console.error("Erreur lors de la création de l'espace:", error);

      let errorMessage =
        "Une erreur est survenue lors de la création de l'espace";

      // Gestion spécifique des erreurs d'authentification
      if (error.response?.status === 401) {
        errorMessage = "Votre session a expiré. Veuillez vous reconnecter.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      showToast({
        type: "error",
        message: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSpaceName("");
    setSelectedIcon("briefcase");
    setDescription("");
    setPermission("edit");
    setIsPrivate(false);
    setUseTemplates(false);
    setIsLoading(false);
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  const icons = [
    {
      id: "briefcase",
      label: "Entreprise",
      icon: Briefcase,
      color: "text-blue-600",
    },
    { id: "users", label: "Équipe", icon: Users, color: "text-green-600" },
    { id: "lock", label: "Privé", icon: Lock, color: "text-red-600" },
    { id: "globe", label: "Public", icon: Globe, color: "text-purple-600" },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header avec info utilisateur */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  Créer un espace
                </h2>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Un espace représente des équipes, des services ou des groupes,
                chacun ayant ses propres listes, flux de travail et paramètres.
                <span className="block mt-1 font-medium">
                  Propriétaire : {user?.name || "Utilisateur"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Section Icône et nom */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Icône et nom
                  </span>
                  <span className="text-xs text-gray-500">
                    (ex. Marketing, Ingénierie, RH)
                  </span>
                </div>

                <div className="flex items-start gap-6">
                  {/* Icônes sur le côté */}
                  <div className="space-y-2">
                    {icons.map(({ id, label, icon: Icon, color }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setSelectedIcon(id)}
                        disabled={isLoading}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all w-20 ${
                          selectedIcon === id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <Icon
                          size={20}
                          className={
                            selectedIcon === id ? "text-blue-600" : color
                          }
                        />
                        <span className="text-[10px] text-gray-600 mt-1.5 truncate w-full text-center">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Champ nom en plein largeur */}
                  <div className="flex-1">
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Nom de l'espace *
                      </label>
                      <input
                        type="text"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        placeholder="ex. Marketing, Ingénierie, RH"
                        className="w-full p-3.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50"
                        required
                        autoFocus
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Description{" "}
                        <span className="text-gray-400">(facultatif)</span>
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ajoutez une description pour cet espace..."
                        className="w-full p-3.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-28 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-gray-400 mt-1.5">
                        Cette description apparaîtra dans la liste des espaces.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ligne de séparation */}
            <div className="border-t border-gray-200"></div>

            {/* Section Configuration */}
            <div className="grid grid-cols-2 gap-8">
              {/* Colonne gauche - Permissions */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    Permissions par défaut
                  </h3>

                  <div className="space-y-3">
                    {["edit", "comment", "view"].map((perm) => (
                      <label
                        key={perm}
                        className={`flex items-start space-x-3 p-4 border rounded-xl cursor-pointer transition-colors ${
                          permission === perm
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <div className="flex items-center h-5">
                          <input
                            type="radio"
                            name="permission"
                            value={perm}
                            checked={permission === perm}
                            onChange={(e) => setPermission(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-900">
                              {perm === "edit" && "Édition complète"}
                              {perm === "comment" && "Commenter uniquement"}
                              {perm === "view" && "Lecture seule"}
                            </span>
                            {permission === perm && (
                              <Check
                                size={16}
                                className="text-blue-600 flex-shrink-0"
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {perm === "edit" &&
                              "Les membres peuvent modifier tous les éléments"}
                            {perm === "comment" &&
                              "Peut commenter mais ne peut pas modifier"}
                            {perm === "view" &&
                              "Accès en visualisation seulement"}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne droite - Options */}
              <div className="space-y-6">
                {/* Option Confidentialité */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    Confidentialité
                  </h3>

                  <label
                    className={`flex items-start space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer transition-colors ${
                      isPrivate
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Lock
                          size={16}
                          className={
                            isPrivate ? "text-blue-600" : "text-gray-500"
                          }
                        />
                        <span className="text-xs font-medium text-gray-900">
                          Rendre cet espace privé
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {isPrivate
                          ? "Seuls vous et les membres que vous invitez auront accès à cet espace."
                          : "L'espace sera public et visible par tous les utilisateurs."}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Option Modèles */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    Configuration
                  </h3>

                  <label
                    className={`flex items-start space-x-3 p-4 border border-gray-200 rounded-xl cursor-pointer transition-colors ${
                      useTemplates
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-gray-50"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={useTemplates}
                        onChange={(e) => setUseTemplates(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <FileText
                          size={16}
                          className={
                            useTemplates ? "text-blue-600" : "text-gray-500"
                          }
                        />
                        <span className="text-xs font-medium text-gray-900">
                          Utiliser des modèles
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Créez cet espace à partir d'un modèle prédéfini avec des
                        listes et des paramètres configurés.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer avec boutons */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <p>
                {user
                  ? `Vous serez automatiquement désigné comme propriétaire de cet espace.`
                  : "Vous devez être connecté pour créer un espace."}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-2.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!spaceName.trim() || isLoading || !user}
                className="px-8 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Continuer"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpaceModal;
