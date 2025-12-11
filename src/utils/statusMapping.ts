// Mapping entre les statuts API et UI
export const statusMapping = {
  // API → UI
  apiToUi: {
    backlog: "en-attente",
    todo: "ouvert",
    doing: "en-cours",
    done: "termine",
  },

  // UI → API
  uiToApi: {
    "en-attente": "backlog",
    ouvert: "todo",
    "en-cours": "doing",
    "a-valider": "todo", // Note: "À valider" est aussi "todo" dans l'API
    termine: "done",
  },

  // Affichage UI
  displayNames: {
    "en-attente": "En attente",
    ouvert: "Ouvert",
    "en-cours": "En cours",
    "a-valider": "À valider",
    termine: "Terminé",
  },

  // Couleurs UI
  colors: {
    "en-attente": "bg-gray-100 text-gray-800",
    ouvert: "bg-blue-100 text-blue-800",
    "en-cours": "bg-yellow-100 text-yellow-800",
    "a-valider": "bg-purple-100 text-purple-800",
    termine: "bg-green-100 text-green-800",
  },
};
