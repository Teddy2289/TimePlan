import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import HeaderFilterAction from "./HeaderFilterAction";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <HeaderFilterAction />
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
