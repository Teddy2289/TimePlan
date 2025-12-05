// CreateSpaceModal.tsx - AMÉLIORÉ
import React, { useState } from "react";
import {
  X,
  Lock,
  Users,
  Briefcase,
  Check,
  Globe,
  FileText,
} from "lucide-react";

interface CreateSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSpace: (spaceData: {
    name: string;
    icon: string;
    description?: string;
    permission: string;
    isPrivate: boolean;
    useTemplates: boolean;
  }) => void;
}

const CreateSpaceModal: React.FC<CreateSpaceModalProps> = ({
  isOpen,
  onClose,
  onCreateSpace,
}) => {
  const [spaceName, setSpaceName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("briefcase");
  const [description, setDescription] = useState("");
  const [permission, setPermission] = useState("edit");
  const [isPrivate, setIsPrivate] = useState(false);
  const [useTemplates, setUseTemplates] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (spaceName.trim()) {
      onCreateSpace({
        name: spaceName,
        icon: selectedIcon,
        description: description.trim() || undefined,
        permission,
        isPrivate,
        useTemplates,
      });
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setSpaceName("");
    setSelectedIcon("briefcase");
    setDescription("");
    setPermission("edit");
    setIsPrivate(false);
    setUseTemplates(false);
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
        {/* Header compact */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  créer un espace
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Un espace représente des équipes, des services ou des groupes,
                chacun ayant ses propres listes, flux de travail et paramètres.
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
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all w-20 ${
                          selectedIcon === id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}>
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
                        Nom de l'espace
                      </label>
                      <input
                        type="text"
                        value={spaceName}
                        onChange={(e) => setSpaceName(e.target.value)}
                        placeholder="ex. Marketing, Ingénierie, RH"
                        className="w-full p-3.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                        autoFocus
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
                        className="w-full p-3.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-28 transition-colors"
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
                    permissions par défaut
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="permission"
                          value="edit"
                          checked={permission === "edit"}
                          onChange={(e) => setPermission(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-900">
                            Édition complète
                          </span>
                          {permission === "edit" && (
                            <Check
                              size={16}
                              className="text-blue-600 flex-shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Les membres peuvent modifier tous les éléments
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="permission"
                          value="comment"
                          checked={permission === "comment"}
                          onChange={(e) => setPermission(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-900">
                            Commenter uniquement
                          </span>
                          {permission === "comment" && (
                            <Check
                              size={16}
                              className="text-blue-600 flex-shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Peut commenter mais ne peut pas modifier
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="permission"
                          value="view"
                          checked={permission === "view"}
                          onChange={(e) => setPermission(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-900">
                            Lecture seule
                          </span>
                          {permission === "view" && (
                            <Check
                              size={16}
                              className="text-blue-600 flex-shrink-0"
                            />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Accès en visualisation seulement
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Colonne droite - Options */}
              <div className="space-y-6">
                {/* Option Rendre privé */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    confidentialité
                  </h3>

                  <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Lock size={16} className="text-gray-500" />
                        <span className="text-xs font-medium text-gray-900">
                          Rendre cet espace privé
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Uniquement vous et les membres que vous invitez auront
                        accès à cet espace.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Option Modèles */}
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-4">
                    configuration
                  </h3>

                  <label className="flex items-start space-x-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={useTemplates}
                        onChange={(e) => setUseTemplates(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <FileText size={16} className="text-gray-500" />
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
                Vous pourrez modifier ces paramètres plus tard dans les
                paramètres de l'espace.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                annuler
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={!spaceName.trim()}
                className="px-8 py-2.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]">
                continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSpaceModal;
