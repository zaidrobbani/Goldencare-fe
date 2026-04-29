"use client"
import MainLayout from "@/layout/MainLayout";
import Dashboard from "../component/Dashboard";
import {useAuthStore} from "@/store/authStore";
import {redirect} from "next/navigation";

const DashboardContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "pengelola" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;

  return (
    <MainLayout withFooter={false} withNavbar={false} roles={role} withSidebar>
      <Dashboard />
    </MainLayout>
  );
};

export default DashboardContainer;
