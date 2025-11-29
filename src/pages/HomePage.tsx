import React from "react";
import MainLayout from "../components/layout/MainLayout";
import WelcomeHeader from "../components/Home/WelcomeHeader";
import RecentItems from "../components/Home/RecentItems";
import Agenda from "../components/Home/Agenda";

const HomaPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <WelcomeHeader />
          <div className="mt-8 space-x-8 flex">
  <div className="flex-1">
    <RecentItems />
  </div>
  <div className="flex-1">
    <Agenda />
  </div>
</div>

        </div>
      </div>
    </MainLayout>
  );
};

export default HomaPage;
