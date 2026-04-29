"use client";
import MainLayout from "@/layout/MainLayout";
import PusatPengurus from "../component/PusatPengurus";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
const PusatPengurusContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "pengelola" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;

  return (
    <MainLayout withNavbar={false} withFooter={false} roles={role}>
      <PusatPengurus />
    </MainLayout>
  );
};

export default PusatPengurusContainer;
