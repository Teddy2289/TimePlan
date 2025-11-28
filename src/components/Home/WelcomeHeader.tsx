import React from "react";

const WelcomeHeader: React.FC = () => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonjour, Teddy</h1>
      <p className="text-gray-600">Bienvenue dans votre espace de travail</p>
    </header>
  );
};

export default WelcomeHeader;
