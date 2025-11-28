import React from "react";
import { Search, Plus } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="bg-[#31b6b8] border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs text-white">
          <span className="text-white font-medium">Logo</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
          />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none text-white focus:ring-2 focus:ring-[#f3f4f6] focus:border-transparent"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-[#ab2283] text-white rounded-lg text-xs font-medium hover:bg-[#92216f]">
            <Plus size={16} />
            <span>Nouvelle tâche</span>
          </button>
        </div>

        {/* User */}
        <div className="w-8 h-8 bg-[#E1AF30] rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-medium">JD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
