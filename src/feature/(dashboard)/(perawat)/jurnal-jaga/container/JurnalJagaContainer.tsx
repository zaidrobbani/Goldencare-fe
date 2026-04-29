'use client'
import MainLayout from '@/layout/MainLayout'
import JurnalJaga from '../component/JurnalJaga'
import { redirect } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const JurnalJagaContainer = () => {
  const { user } = useAuthStore();

  if (!user || (user.role !== "perawat" && user.role !== "superadmin")) {
    redirect("/login");
  }

  const role = user?.role;

  return (
    <MainLayout withFooter={false} withNavbar={false} roles={role}>
      <JurnalJaga/>
    </MainLayout>
  )
}

export default JurnalJagaContainer
