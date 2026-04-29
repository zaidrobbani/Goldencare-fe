'use client'
import MainLayout from "@/layout/MainLayout"
import KelolaObat from "../component/KelolaObat"
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";
const KelolaObatContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "perawat" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;

  return (
    <MainLayout withFooter={false} withNavbar={false} roles={role}>
      <KelolaObat />
    </MainLayout>
  )
}

export default KelolaObatContainer
