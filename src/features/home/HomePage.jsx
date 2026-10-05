import { useMemo } from "react";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import PersonalizedPlaces from "./components/PersonalizedPlaces";
import PopularPlaces from "./components/PopularPlaces";
import TrendingPlaces from "./components/TrendingPlaces";
import SeasonalPlaces from "./components/SeasonalPlaces";
import { useAuth } from "../../context/authContext";
import { useDestinations, useImagePlan } from "../../hooks/useDestinations";

/**
 * Ana səhifə — bütün tövsiyə bölmələri və ŞƏKİL PLANININ sahibi.
 *
 * Hər bölmə ÖZ backend endpoint-indən məlumat alır:
 *   Trending  → GET /api/destinations/trending
 *   Popular   → GET /api/destinations/popular
 *   Sənə xüsusi → GET /api/recommendations/personalized (daxil olmuşlar)
 *   Mövsüm   → GET /api/destinations/featured
 *
 * `imagePlan` bütün bölmələr üçün BİR YERDƏ qurulur ki, eyni istiqamət
 * müxtəlif bölmələrdə FƏRQli şəkil göstərsin və eyni URL səhifədə
 * təkrarlanmasın (bax: utils/imageAssignment.js).
 *
 * Plan `useMemo` ilə hesablanır — React yenidən render etsə də şəkillər
 * DƏYİŞMİR (təsadüfi seçim yoxdur).
 */
function HomePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const trending = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
    source: "trending",
    limit: 6,
  });

  const popular = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
    source: "popular",
    limit: 6,
  });

  const personalized = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
    source: "personalized",
    limit: 4,
  });

  const seasonal = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
    source: "featured",
  });

  // Hero kolajı da eyni featured siyahısından göstərir → o da planda iştirak edir
  const hero = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
    source: "featured",
    limit: 4,
  });

  // Ekran sırası = plan sırası: yuxarıdakı bölmə ən yaxşı şəkilləri alır
  const imagePlan = useImagePlan(
    useMemo(
      () => [
        { key: "hero", places: hero.allPlaces },
        { key: "trending", places: trending.allPlaces },
        { key: "popular", places: popular.allPlaces },
        { key: "personalized", places: personalized.allPlaces },
        { key: "seasonal", places: seasonal.allPlaces },
      ],
      [hero.allPlaces, trending.allPlaces, popular.allPlaces, personalized.allPlaces, seasonal.allPlaces]
    )
  );

  return (
    <main className="pb-20 md:pb-28">
      <HeroSection imagePlan={imagePlan} />
      <HowItWorks />
      <TrendingPlaces state={trending} imagePlan={imagePlan} />
      <PopularPlaces state={popular} imagePlan={imagePlan} />
      <PersonalizedPlaces state={personalized} imagePlan={imagePlan} />
      <SeasonalPlaces state={seasonal} imagePlan={imagePlan} />
    </main>
  );
}

export default HomePage;
