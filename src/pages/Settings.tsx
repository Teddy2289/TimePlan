import React from "react";
import MainLayout from "../components/layout/MainLayout";

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-2">Configuration de l'application</p>
      </div>
    </MainLayout>
  );
};

export default Settings;
