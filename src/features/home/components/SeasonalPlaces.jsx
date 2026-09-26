import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useAuthModal } from "../../../context/authModalContext";
import { usePlanner } from "../../../context/plannerContext";
import { useDestinations } from "../../../hooks/useDestinations";
import { getDestinationDetails } from "../../../utils/destinationDetails";
import { getSeason, seasonStatus } from "../../../utils/season";
import DestinationImage from "../../../components/common/DestinationImage";
import SectionHeading from "../../../components/common/SectionHeading";
import Reveal from "../../../components/common/Reveal";
import { CardSkeleton, ErrorState } from "../../../components/common/States";

/**
 * Mövsümə uyğun istiqamətlər (PO tələbi #1).
 *
 * Əvvəl bu bölmə ayrıca `GET /destinations/featured` sorğusu göndərirdi.
 * İndi `useDestinations` ilə paylaşılan yaddaşdan oxunur — eyni endpoint,
 * amma bütün ana səhifə üçün yalnız bir şəbəkə sorğusu.
 *
 * Şəkillər mövsüm rəng tənzimləyicisi (`.voy-grade-*`) ilə mövsümə uyğun
 * görünür və hər istiqamət üçün "indi ən yaxşı vaxtdır" işarəsi göstərilir.
 *
 * Kartların üzərinə mouse gətirildikdə kart 3D formada fırlanır (flip) və
 * arxa üzdə həmin istiqamətlə bağlı ətraflı məlumat (təsvir, qalma müddəti,
 * büdcə, ən yaxşı aylar) görünür.
 */
function SeasonalPlaces() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { openLogin } = useAuthModal();
    const { openPlanner } = usePlanner();

    const { places, isLoading, error, reload } = useDestinations({
        isAuthenticated,
        isAuthLoading: authLoading,
    });

    const season = useMemo(() => getSeason(), []);

    // Əvvəlcə "indi ən yaxşı vaxt" olanlar, sonra qalanlar
    const sorted = useMemo(() => {
        const rank = { peak: 0, good: 1, off: 2, unknown: 3 };
        return [...places].sort(
            (a, b) =>
                rank[seasonStatus(getDestinationDetails(a).bestMonths).state] -
                rank[seasonStatus(getDestinationDetails(b).bestMonths).state]
        );
    }, [places]);

    const inSeason = sorted.filter(
        (place) =>
            seasonStatus(getDestinationDetails(place).bestMonths).state === "peak"
    );

    return (
        <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-mint-100/50 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    eyebrow={{
                        text: `Günün mövsümü — ${season.label}`,
                        tone: "mint",
                        icon: season.icon,
                    }}
                    title="Mövsümə uyğun seçimlər"
                    description={
                        inSeason.length > 0
                            ? `${season.label} mövsümü üçün ən uyğun istiqamətlər. Şəkillər və tövsiyələr cari dövrə uyğunlaşdırılır.`
                            : "Bu mövsüm üçün uyğun istiqamətlər aşağıdadır — şəkillər mövsümün göz rənginə uyğunlaşdırılıb."
                    }
                />

                {/* yüklənir */}
                {isLoading && <CardSkeleton count={4} className="mt-10" />}

                {/* xəta */}
                {!isLoading && error && (
                    <ErrorState className="mt-10" message={error} onRetry={reload} />
                )}

                {/* kartlar */}
                {!isLoading && !error && sorted.length > 0 && (
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {sorted.map((place, index) => {
                            const details = getDestinationDetails(place);
                            const status = seasonStatus(details.bestMonths);

                            return (
                                <Reveal key={place.id} delay={index * 90} variant="zoom">
                                    {/* Flip konteyner: 3D perspektiv burada təyin olunur */}
                                    <div className="group relative aspect-[4/5] w-full [perspective:1600px]">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/destination/${place.id}`)}
                                            className="relative h-full w-full rounded-3xl text-left outline-none [transform-style:preserve-3d] transition-transform duration-700 ease-out focus-visible:ring-2 focus-visible:ring-mint-500 group-hover:[transform:rotateY(180deg)]"
                                        >
                                            {/* ÖN ÜZ */}
                                            <div className="absolute inset-0 overflow-hidden rounded-3xl bg-ink-900 shadow-soft ring-1 ring-slate-200/70 transition-shadow duration-500 group-hover:shadow-lift [backface-visibility:hidden]">
                                                <DestinationImage
                                                    src={place.imageUrl}
                                                    alt={place.title}
                                                    className="h-full w-full"
                                                    season
                                                />

                                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/25 to-transparent" />

                                                {/* mövsüm statusu */}
                                                <span
                                                    className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold backdrop-blur-md ${
                                                        status.state === "peak"
                                                            ? "bg-mint-500/90 text-white"
                                                            : status.state === "good"
                                                                ? "bg-white/85 text-mint-700"
                                                                : "bg-white/70 text-ink-600"
                                                    }`}
                                                >
                          <span aria-hidden="true">
                            {status.state === "peak" ? "✨" : "🕒"}
                          </span>
                                                    {status.label}
                        </span>

                                                <div className="absolute inset-x-0 bottom-0 p-5">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">
                                                        {place.subtitle}
                                                    </p>

                                                    <h3 className="mt-1.5 text-lg font-bold leading-tight text-white">
                                                        {place.title}
                                                    </h3>

                                                    <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-white/80">
                                                        <span>{details.stayLength}</span>
                                                        <span className="h-1 w-1 rounded-full bg-white/40" />
                                                        <span>{details.budget}</span>
                                                        <span
                                                            className="ml-auto transition-transform duration-500 group-hover:translate-x-1"
                                                            aria-hidden="true"
                                                        >
                              →
                            </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* ARXA ÜZ — ətraflı məlumat */}
                                            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-3xl bg-ink-900 p-5 shadow-soft ring-1 ring-slate-200/70 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/55">
                                                    {place.subtitle}
                                                </p>

                                                <h3 className="mt-1.5 text-lg font-bold leading-tight text-white">
                                                    {place.title}
                                                </h3>

                                                <p className="mt-3 flex-1 overflow-y-auto text-xs leading-relaxed text-white/75">
                                                    {details.headline}
                                                </p>

                                                <div className="mt-4 space-y-1.5 border-t border-white/10 pt-3 text-[11px] text-white/70">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/45">Qalma müddəti</span>
                                                        <span className="font-semibold text-white">
                              {details.stayLength}
                            </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/45">Büdcə</span>
                                                        <span className="font-semibold text-white">
                              {details.budget}
                            </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white/45">Ən yaxşı aylar</span>
                                                        <span className="font-semibold text-white">
                              {details.bestMonths?.join?.(", ") ?? "—"}
                            </span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-mint-300">
                                                    <span>Ətraflı bax</span>
                                                    <span aria-hidden="true">→</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </Reveal>
                            );
                        })}
                    </div>
                )}

                {/* alt CTA */}
                {!isLoading && !error && sorted.length > 0 && (
                    <Reveal delay={300} className="mt-14 flex flex-col items-center gap-4">
                        <p className="text-center text-sm text-ink-500">
                            Mövsüm fərq etmir — Voyanta sənin üçün ən uyğun planı tapır.
                        </p>

                        <button
                            type="button"
                            onClick={isAuthenticated ? openPlanner : openLogin}
                            className="group inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-ink-800 active:scale-95"
                        >
                            <span>Planlaşdırmaya başla</span>
                            <span
                                className="transition-transform duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                →
              </span>
                        </button>
                    </Reveal>
                )}
            </div>
        </section>
    );
}

export default SeasonalPlaces;