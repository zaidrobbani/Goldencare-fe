'use client'
import MainLayout from '@/layout/MainLayout'
import PindaiRaga from '../component/PindaiRaga'
import { useAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';

const PindaiRagaContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "perawat" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;
  return (
    <MainLayout withNavbar={false} withFooter={false} roles={role}>
      <PindaiRaga />
    </MainLayout>
  )
}

export default PindaiRagaContainer
