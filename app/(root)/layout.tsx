import LeftSidebar from "@/components/shared/LeftSidebar";
import Navbar from "@/components/shared/navbar/Navbar";
import SidebarContainer from "@/components/SidebarContainer";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        <section className="min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full">{children}</div>
        </section>
        {/* <RightSidebar /> */}
        <SidebarContainer />
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
