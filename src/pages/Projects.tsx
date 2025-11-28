import React from "react";
import MainLayout from "../components/layout/MainLayout";

export default function Projects() {
  return (
    <MainLayout>
      <div
        className="p-6 space-y-8 text-xs
">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-1">Gestion des projets</p>
        </div>

        {/* Top Sections */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 ">
          {/* Recent */}
          <div className="border border-gray-200 shadow-sm rounded-xl p-4 bg-white h-64 overflow-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-gray-700 border-b pb-2">
                <span>Hotel Thaïlande</span>
                <span className="text-gray-400">• dans Projets</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-700 border-b pb-2">
                <span>Graphiste</span>
                <span className="text-gray-400">• dans Projets</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-700 border-b pb-2">
                <span>WIZI-LEARN, web‑app</span>
                <span className="text-gray-400">• dans Projets</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-700 border-b pb-2">
                <span>Test</span>
                <span className="text-gray-400">• dans Projets</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-gray-700">
                <span>AOPIA & LIKEFORMATION</span>
                <span className="text-gray-400">• dans Projets</span>
              </li>
            </ul>
          </div>

          {/* Docs */}
          <div className="border border-gray-200 shadow-sm rounded-xl p-4 bg-white h-64 overflow-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Docs</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-xs text-gray-700">
                <span>Project 1</span>
                <span className="text-gray-400">• dans Projets</span>
              </li>
            </ul>
          </div>

          {/* Bookmarks */}
          <div className="border border-gray-200 shadow-sm rounded-xl p-6 bg-white h-64 flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 text-6xl mb-4">🔖</div>
            <p className="text-gray-500 text-xs mb-4">
              Les signets facilitent l’enregistrement d’éléments ClickUp ou
              d’URL du web.
            </p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg shadow">
              Ajouter un signet
            </button>
          </div>
        </div>

        {/* Lists section */}
        <div className="border border-gray-200 shadow-sm rounded-xl p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Lists</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left px-2 py-2">Nom</th>
                  <th className="text-left px-2 py-2">Couleur</th>
                  <th className="text-left px-2 py-2">Progression</th>
                  <th className="px-2 py-2">Début</th>
                  <th className="px-2 py-2">Fin</th>
                  <th className="px-2 py-2">Priorité</th>
                  <th className="px-2 py-2">Propriétaire</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    name: "AOPIA & LIKEFORMATION",
                    progress: "15/28",
                  },
                  {
                    name: "Hotel Thaïlande",
                    progress: "0/6",
                  },
                  {
                    name: "WIZI‑LEARN, web‑app",
                    progress: "7/31",
                  },
                  {
                    name: "Graphiste",
                    progress: "3/5",
                  },
                  {
                    name: "Test",
                    progress: "0/0",
                  },
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="px-2 py-3 text-gray-700">{item.name}</td>
                    <td className="px-2 py-3 text-gray-500">—</td>
                    <td className="px-2 py-3 text-gray-700">
                      <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-500 h-full"
                          style={{
                            width: `${
                              (parseInt(item.progress.split("/")[0]) /
                                parseInt(item.progress.split("/")[1])) *
                              100
                            }%`,
                          }}></div>
                      </div>
                      <span className="text-gray-500 text-xs ml-2">
                        {item.progress}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-center text-gray-400">📅</td>
                    <td className="px-2 py-3 text-center text-gray-400">📅</td>
                    <td className="px-2 py-3 text-center text-gray-400">⚑</td>
                    <td className="px-2 py-3 text-center text-gray-400">👤</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
