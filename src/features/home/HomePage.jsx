import { useMemo } from "react";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import TrendingPlaces from "./components/TrendingPlaces";
import PopularPlaces from "./components/PopularPlaces";
import PersonalizedPlaces from "./components/PersonalizedPlaces";
import SeasonalPlaces from "./components/SeasonalPlaces";
import { useAuth } from "../../context/authContext";
import { useDestinations, useImagePlan } from "../../hooks/useDestinations";
import { TRENDING_IDS, SEA_BEACH_IDS } from "../../data/homeSections";

/**
 * Ana səhifə — bütün tövsiyə bölmələri və ŞƏKİL PLANININ sahibi.
 *
 * Hər bölmə ÖZ mənbəsindən məlumat alır:
 *   Trending   — STATIK siyahı (src/data/homeSections.js), şəkillər backend → Unsplash
 *   Sea/Beach  — STATIK siyahı (src/data/homeSections.js), şəkillər backend → Unsplash
 *   Popular    → GET /api/destinations/popular
 *   Sənə xüsusi → GET /api/recommendations/personalized (daxil olmuşlar)
 *   Mövsüm   → GET /api/destinations?season=<season>&limit=4
 *
 * `imagePlan` bütün bölmələr üçün BİR YERDƏ qurulur ki, eyni istiqamət
 * müxtəlif bölmələrdə FƏRQli şəkil göstərsin və eyni URL səhifədə
 * təkrarlanmasın (bax: utils/imageAssignment.js).
 */
function HomePage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const popular = useDestinations({
        isAuthenticated,
        isAuthLoading: authLoading,
        source: "popular",
        limit: 4,
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

    const hero = useDestinations({
        isAuthenticated,
        isAuthLoading: authLoading,
        source: "featured",
        limit: 4,
    });

    // Hardcoded sections do not go through useDestinations, but they still
    // participate in the imagePlan so cards in those sections can pick
    // unique images via getPlanImage().
    const imagePlan = useImagePlan(
        useMemo(
            () => [
                { key: "hero", places: hero.allPlaces },
                { key: "trending", places: TRENDING_IDS.map((id) => ({ id })) },
                { key: "sea", places: SEA_BEACH_IDS.map((id) => ({ id })) },
                { key: "popular", places: popular.allPlaces },
                { key: "personalized", places: personalized.allPlaces },
                { key: "seasonal", places: seasonal.allPlaces },
            ],
            [hero.allPlaces, popular.allPlaces, personalized.allPlaces, seasonal.allPlaces]
        )
    );

    return (
        <main className="pb-20 md:pb-28">
            <HeroSection state={hero} imagePlan={imagePlan} />
            <HowItWorks />
            <TrendingPlaces imagePlan={imagePlan} />
            <PopularPlaces state={popular} imagePlan={imagePlan} />
            <PersonalizedPlaces state={personalized} imagePlan={imagePlan} />
            <SeasonalPlaces imagePlan={imagePlan} />
        </main>
    );
}

export default HomePage;
