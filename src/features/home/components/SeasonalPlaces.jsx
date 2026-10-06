import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getDestinationsBySeason } from "../../../api/destinations";
import { getPlanImage } from "../../../utils/imageAssignment";
import { getSeason } from "../../../utils/season";
import SectionHeading from "../../../components/common/SectionHeading";
import Reveal from "../../../components/common/Reveal";
import DestinationCard from "../../../components/common/DestinationCard";
import { CardSkeleton, EmptyState, ErrorState } from "../../../components/common/States";

const SEASONS = [
    { key: "winter", label: "Qış" },
    { key: "spring", label: "Yaz" },
    { key: "summer", label: "Yay" },
    { key: "autumn", label: "Payız" },
];

/**
 * Mövsümə uyğun seçimlər — sekmeli bölmə.
 *
 * Məlumat mənbəyi: `GET /api/destinations?season=<season>&limit=4`.
 * Hər mövsüm üçün 4 kart, bir sətir.
 */
function SeasonalPlaces({ imagePlan }) {
    const currentSeason = useMemo(() => getSeason(), []);
    const [activeSeason, setActiveSeason] = useState(currentSeason.key);
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getDestinationsBySeason(activeSeason, 4)
            .then((destinations) => {
                if (!cancelled) {
                    setPlaces(destinations.filter(Boolean));
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Mövsüm istiqamətləri yüklənmədi");
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [activeSeason]);

    const reload = () => {
        setPlaces([]);
        setIsLoading(true);
        setError(null);
    };

    return (
        <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-mint-100/50 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow={{
                        text: `Mövsüm — ${currentSeason.label}`,
                        tone: "mint",
                        icon: currentSeason.icon,
                    }}
                    title="Mövsümə uyğun seçimlər"
                    description="Hər mövsümün ən uyğun istiqamətlərini kəşf et."
                />

                {/* Tabs */}
                <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Mövsüm sekmələri">
                    {SEASONS.map((s) => {
                        const isActive = activeSeason === s.key;
                        return (
                            <button
                                key={s.key}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveSeason(s.key)}
                                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? "bg-ink-900 text-white shadow-soft"
                                        : "bg-white text-ink-500 hover:bg-slate-100"
                                }`}
                            >
                                {s.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content with min-height to prevent layout jump */}
                <div className="mt-10 min-h-[480px]">
                    {isLoading && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="aspect-[3/4] rounded-[28px] bg-slate-200" />
                            ))}
                        </div>
                    )}

                    {!isLoading && error && (
                        <ErrorState className="mt-10" message={error} onRetry={reload} />
                    )}

                    {!isLoading && !error && places.length === 0 && (
                        <EmptyState
                            className="mt-10"
                            icon="🗓️"
                            title="Bu mövsüm üçün istiqamət yoxdur"
                            description="Başqa mövsümü seç və yeni imkanları kəşf et."
                        />
                    )}

                    {!isLoading && !error && places.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {places.map((place, index) => (
                                <DestinationCard
                                    key={place.id}
                                    place={place}
                                    imagePlan={imagePlan}
                                    sectionKey="seasonal"
                                    index={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

SeasonalPlaces.propTypes = {
    imagePlan: PropTypes.instanceOf(Map),
};

export default SeasonalPlaces;
