"use client"
import React from 'react'
import MemoriTamu from '../component/MemoriTamu'
import MainLayout from "@/layout/MainLayout";
import { useAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';

const MemoriTamuContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "keluarga" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;
  return (
    <MainLayout withNavbar={false} withFooter={false} roles={role}>
      <MemoriTamu />
    </MainLayout>
  )
}

export default MemoriTamuContainer
