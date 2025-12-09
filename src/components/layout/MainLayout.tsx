// src/components/layout/MainLayout.tsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import FloatingTimer from "../TimeSession/FloatingTimer";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto relative">
          {children}
          {/* Timer flottant sur toutes les pages */}
          <FloatingTimer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
