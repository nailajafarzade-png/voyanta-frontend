import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { getDestinationsByIds } from "../../../api/destinations";
import Reveal from "../../../components/common/Reveal";
import DestinationCard from "../../../components/common/DestinationCard";
import { ErrorState } from "../../../components/common/States";
import { TRENDING_IDS } from "../../../data/homeSections";

const MAX_ITEMS = 4;

/**
 * "İnsanlar bunu bəyənir" / Trending bölməsi.
 *
 * Məlumat siyahısı STATIK (src/data/homeSections.js), amma şəkillər
 * backend → Unsplash axını ilə təmin olunur.
 * Vizual tarazlıq üçün maksimum 4 kart göstərilir.
 */
function TrendingPlaces({ imagePlan }) {
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const ids = useMemo(() => TRENDING_IDS.slice(0, MAX_ITEMS), []);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        setError(null);

        getDestinationsByIds(ids)
            .then((destinations) => {
                if (!cancelled) {
                    setPlaces(destinations.filter(Boolean).slice(0, MAX_ITEMS));
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "İstiqamətlər yüklənmədi");
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [ids, reloadKey]);

    const reload = useCallback(() => {
        setReloadKey((key) => key + 1);
    }, []);

    const Backdrop = () => (
        <>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-brand-600/20 blur-3xl sm:h-80 sm:w-80"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-mint-500/15 blur-3xl sm:h-72 sm:w-72"
            />
        </>
    );

    // Mobildə: yan-yana sürüşən sıra. sm+: grid (4 kart bir cərgədə lg-də).
    const rowClasses =
        "mt-10 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 " +
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
        "sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 " +
        "lg:grid-cols-4";

    const cellClasses = "w-[78%] shrink-0 snap-start sm:w-auto sm:shrink";

    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-ink-900 py-16 sm:py-20 lg:py-24">
                <Backdrop />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-48 animate-pulse rounded-full bg-white/10" />
                    <div className={rowClasses}>
                        {Array.from({ length: MAX_ITEMS }).map((_, i) => (
                            <div key={i} className={cellClasses}>
                                <div className="aspect-[3/4] animate-pulse rounded-[28px] bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative overflow-hidden bg-ink-900 py-16 sm:py-20 lg:py-24">
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ErrorState message={error} onRetry={reload} />
                </div>
            </section>
        );
    }

    if (places.length === 0) return null;

    return (
        <section
            id="people-like-this"
            className="relative overflow-hidden bg-ink-900 py-16 sm:py-20 lg:py-24"
        >
            <Backdrop />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-sun-300">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-sun-400 opacity-70 animate-voy-pulse-ring" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sun-400" />
                        </span>
                        <span aria-hidden="true">🔥</span>
                        Trendlər
                    </span>
                </Reveal>

                <Reveal delay={70}>
                    <h2 className="mt-4 text-2xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-3xl lg:text-[2.65rem]">
                        İnsanlar bunu bəyənir
                    </h2>
                </Reveal>

                <Reveal delay={140}>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
                        Bu həftə ən çox baxılan və planlanan istiqamətlər. Reytinq
                        Voyanta istifadəçilərinin seçimlərinə görə yenilənir.
                    </p>
                </Reveal>

                <div className={rowClasses}>
                    {places.map((place, index) => (
                        <div key={place.id} className={cellClasses}>
                            <DestinationCard
                                place={place}
                                imagePlan={imagePlan}
                                sectionKey="trending"
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

TrendingPlaces.propTypes = {
    imagePlan: PropTypes.instanceOf(Map),
};

export default TrendingPlaces;