"use client";
import MainLayout from "@/layout/MainLayout";
import PusatWreda from "../component/PusatWreda";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

const PuatWredaContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "pengelola" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;
  return (
    <MainLayout withNavbar={false} withFooter={false} roles={role}>
      <PusatWreda />
    </MainLayout>
  );
};

export default PuatWredaContainer;
