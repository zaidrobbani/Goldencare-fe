import React from 'react'
import MainLayout from '@/layout/MainLayout'
import Hero from '../section/Hero'
import CoreRole from '../section/CoreRole'
import Aesthetic from '../section/Aesthetic'
import CTA from '../section/CTA'

const LandingPage = () => {
  return (
    <MainLayout withSidebar={false}>
      <Hero />
      <CoreRole />
      <Aesthetic />
      <CTA />
    </MainLayout>
  )
}

export default LandingPage
