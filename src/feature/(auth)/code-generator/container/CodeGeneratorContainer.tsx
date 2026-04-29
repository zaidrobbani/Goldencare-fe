'use client'
import Mainlayout from "@/layout/MainLayout";
import CodeGenerator from "../component/CodeGenerator";
import { useAuthStore } from "@/store/authStore";
import { redirect } from "next/navigation";

const CodeGeneratorContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "pengelola" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;

  return (
    <Mainlayout withFooter={false} withNavbar={false} roles={role} withSidebar>
      <CodeGenerator />
    </Mainlayout>
  );
};

export default CodeGeneratorContainer;
