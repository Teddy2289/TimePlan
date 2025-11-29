import React from "react";

const WelcomeHeader: React.FC = () => {
  return (
    <header className="mb-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Bonjour, Teddy</h1>
      <p className="text-gray-600 text-xs">Bienvenue dans votre espace de travail</p>
    </header>
  );
};

export default WelcomeHeader;
