import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import KeyFeatures from '../components/KeyFeatures'
import WorkingSection from '../components/WorkingSection'
import FaqSection from '../components/FaqSection'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <>
        <Navbar/>
        <HeroSection/>
        <KeyFeatures/>
        <WorkingSection/>
        <FaqSection/>
        <Footer/>
    </>
  )
}

export default HomePage