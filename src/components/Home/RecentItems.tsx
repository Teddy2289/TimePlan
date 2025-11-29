import React from "react";

const RecentItems: React.FC = () => {
  const recentItems = [
    {
      name: "WD1-LEARN, web-app",
      location: "dans Projets",
    },
    {
      name: "Pâpourt au quiz",
      location: "dans WD1-LEARN, web-app",
    },
    {
      name: "Gestion des contacts : formateur",
      location: "dans WD1-LEARN, web-app",
    },
    {
      name: "Gestion des contacts : commercial et polo relation client",
      location: "dans WD1-LEARN, web-app",
    },
    {
      name: "LOGO Hotel Thalands",
      location: "dans Graphiste",
    },
    {
      name: "Quiz stagiaire",
      location: "dans WD1-LEARN, web-app",
    },
    {
      name: "Test",
      location: "dans Projets",
    },
    {
      name: "Graphiste",
      location: "dans Projets",
    },
  ];

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-80 overflow-auto">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recente</h2>
      <ul className="space-y-3">
        {recentItems.map((item, index) => (
          <li key={index} className="flex flex-col p-2 rounded-lg
 bg-gray-100" >
            <span className="text-gray-900 text-sm">{item.name}</span>
            <span className="text-gray-500 text-xs">{item.location}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentItems;
