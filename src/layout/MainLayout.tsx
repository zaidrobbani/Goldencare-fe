"use client";

import type { ReactNode } from "react";
import Navbar from "@/shared/Navbar/Navbar";
import Footer from "@/shared/Footer/Footer";
import { Sidebar } from "@/shared/Sidebar/Sidebar";
import { Roles } from "@/repository/auth/dto";

type MainLayoutProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  withNavbar?: boolean;
  withFooter?: boolean;
  withSidebar?: boolean;
  roles?: Roles;
};

export default function MainLayout({
  children,
  className,
  contentClassName,
  withNavbar = true,
  withFooter = true,
  withSidebar = true,
  roles,
}: MainLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar — fixed viewport height, follows layout */}
      {withSidebar && <Sidebar roles={roles ?? "pengelola"} />}

      {/* Main content area */}
      <main className={`flex flex-col flex-1 min-w-0 overflow-y-auto ${className ?? ""}`}>
        {withNavbar && <Navbar />}

        <div className={`flex-1 ${contentClassName ?? ""}`}>{children}</div>

        {withFooter && <Footer />}
      </main>
    </div>
  );
}
