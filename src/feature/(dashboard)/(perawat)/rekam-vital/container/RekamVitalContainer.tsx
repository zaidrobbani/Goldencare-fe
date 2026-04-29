import React from 'react'
import MainLayout from '@/layout/MainLayout'
import RekamVital from '../component/RekamVital'

const RekamVitalContainer = () => {
  return (
    <MainLayout withFooter={false} withNavbar={false} roles='perawat'>
      <RekamVital />
    </MainLayout>
  )
}

export default RekamVitalContainer
