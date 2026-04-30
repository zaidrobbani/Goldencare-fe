'use client'
import MainLayout from "@/layout/MainLayout";
import RekamVital from "../component/RekamVital";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

const RekamVitalContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "pengurus" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;
  return (
    <MainLayout withFooter={false} withNavbar={false} roles={role}>
      <RekamVital />
    </MainLayout>
  );
};

export default RekamVitalContainer;
