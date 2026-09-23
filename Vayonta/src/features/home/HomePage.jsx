import React from 'react'
import HeroSection from './components/HeroSection'
import HowItWorks from './components/HowItWorks'
import PersonalizedPlaces from './components/PersonalizedPlaces'
import SeasonalPlaces from './components/SeasonalPlaces'

function HomePage() {
  return (
    <main className='pt-32 pb-16 md:pt-40 md:pb-24'>
    <HeroSection/>
    <HowItWorks/>
    <PersonalizedPlaces/>
    <SeasonalPlaces/>
    </main>
  )
}

export default HomePage