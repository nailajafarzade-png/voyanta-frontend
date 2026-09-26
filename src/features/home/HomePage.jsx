import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import PersonalizedPlaces from "./components/PersonalizedPlaces";
import TrendingPlaces from "./components/TrendingPlaces";
import SeasonalPlaces from "./components/SeasonalPlaces";

function HomePage() {
  return (
    <main className="pb-20 md:pb-28">
      <HeroSection />
      <HowItWorks />
      <TrendingPlaces />
      <PersonalizedPlaces />
      <SeasonalPlaces />
    </main>
  );
}

export default HomePage;