import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useAuthModal } from "../../../context/authModalContext";
import { usePlanner } from "../../../context/plannerContext";
import { useDestinations } from "../../../hooks/useDestinations";
import { getDestinationDetails } from "../../../utils/destinationDetails";
import { likeRatio, sortByTrending } from "../../../utils/trending";
import DestinationImage from "../../../components/common/DestinationImage";
import Reveal from "../../../components/common/Reveal";
import { CardSkeleton, ErrorState } from "../../../components/common/States";

/**
 * "İnsanlar bunu bəyənir" / Trend bölməsi (PO tələbi #2).
 *
 * Mövcud `GET /destinations/featured` məlumatından istifadə edir; yeni
 * endpoint yoxdur. Reytinq UUID-dən hesablanan sabit hash ilə verilir
 * (`utils/trending.js`) — hər yükləmədə eyni sıra qalır, təsadüfi
 * "sürüşmə" olmur. Ölçülər (bəyənmə %/likes) eyni hash-dən gəlir.
 *
 * #1 istiqamət böyük "podium" kartı, qalanları yan xəttdəki siyahıdır.
 *
 * Responsivlik qeydi: podium kartı və siyahı eyni `lg:grid-cols-12`
 * grid-inin İKİ QARDAŞ elementi olmalıdır ki, `lg:col-span-*` işləsin —
 * əvvəlki versiyada bunlar səhvən fərqli konteynerlərdə idi və nəticədə
 * masaüstündə də bir sütuna yığılırdı.
 */
function TrendingPlaces() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { openPlanner } = usePlanner();

  const { places, isLoading, error, reload } = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
  });

  // sabit reytinq
  const ranked = useMemo(() => sortByTrending(places), [places]);

  if (isLoading) {
    return (
        <section className="bg-canvas py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CardSkeleton count={4} />
          </div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="bg-canvas py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ErrorState message={error} onRetry={reload} />
          </div>
        </section>
    );
  }

  if (ranked.length === 0) return null;

  const [top, ...rest] = ranked;

  return (
      <section
          id="people-like-this"
          className="relative overflow-hidden bg-ink-900 py-16 sm:py-20 lg:py-24"
      >
        {/* arxa plan işıqları */}
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-brand-600/20 blur-3xl sm:h-80 sm:w-80"
        />
        <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full bg-mint-500/15 blur-3xl sm:h-72 sm:w-72"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ============ BAŞLIQ SIRASI ============ */}
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
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
            </div>

            <Reveal delay={200} className="w-full sm:w-auto">
              <button
                  type="button"
                  onClick={isAuthenticated ? openPlanner : openLogin}
                  className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-ink-900 transition-all duration-300 hover:bg-brand-50 active:scale-95 sm:w-auto"
              >
                <span>Trendlərə görə planla</span>
                <span
                    className="transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                >
                →
              </span>
              </button>
            </Reveal>
          </div>

          {/* ============ GRID: PODIUM + SİYAHI (qardaş elementlər) ============ */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-12">
            {/* ============ #1 PODIUM KARTI ============ */}
            <Reveal variant="zoom" className="lg:col-span-5">
              <button
                  type="button"
                  onClick={() => navigate(`/destination/${top.id}`)}
                  className="group relative block h-full min-h-[320px] w-full overflow-hidden rounded-[28px] text-left shadow-lift ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.015] sm:min-h-[380px] sm:rounded-[32px] lg:min-h-[420px]"
              >
                <DestinationImage
                    src={top.imageUrl}
                    alt={top.title}
                    className="absolute inset-0 h-full w-full"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-2.5 sm:left-5 sm:top-5 sm:gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sun-300 to-sun-500 text-lg font-extrabold text-ink-900 shadow-lift sm:h-12 sm:w-12 sm:text-xl">
                  1
                </span>
                  <span className="rounded-full bg-ink-900/60 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md sm:px-3 sm:text-[11px]">
                  Bu həftənin #1
                </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/55">
                    {top.subtitle}
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl lg:text-3xl">
                    {top.title}
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                    {getDestinationDetails(top).headline}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                    <span aria-hidden="true">🔥</span>
                    {Math.round(82 + likeRatio(top.id) * 17)}% bəyəndi
                  </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                    <span aria-hidden="true">⭐</span>
                      {(4.2 + likeRatio(top.id)).toFixed(1)}
                  </span>
                  </div>
                </div>
              </button>
            </Reveal>

            {/* ============ QALANLAR: SİYAHI ============ */}
            <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-7">
              {rest.slice(0, 4).map((place, index) => {
                const details = getDestinationDetails(place);
                const ratio = likeRatio(place.id);
                const score = Math.round(82 + ratio * 17);

                return (
                    <Reveal key={place.id} delay={index * 90} variant="right">
                      <button
                          type="button"
                          onClick={() => navigate(`/destination/${place.id}`)}
                          className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/10 active:scale-[0.99] sm:gap-5 sm:rounded-3xl sm:p-4"
                      >
                    <span className="hidden w-6 shrink-0 text-center text-sm font-extrabold text-white/35 xs:block sm:block">
                      {index + 2}
                    </span>

                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-ink-800 sm:h-20 sm:w-20 sm:rounded-2xl">
                      <DestinationImage
                          src={place.imageUrl}
                          alt={place.title}
                          className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </span>

                        <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-white sm:text-base">
                          {place.title}
                        </span>
                        <span className="hidden shrink-0 text-[10px] font-bold uppercase tracking-wider text-white/40 sm:inline">
                          {place.subtitle}
                        </span>
                      </span>

                      <span className="mt-1.5 hidden truncate text-xs text-white/50 xs:block sm:block">
                        {details.headline}
                      </span>

                      <span className="mt-2 flex items-center gap-2 sm:mt-2.5">
                        <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                          <span
                              className="block h-full rounded-full bg-gradient-to-r from-brand-400 to-mint-400 transition-all duration-700"
                              style={{ width: `${score}%` }}
                          />
                        </span>
                        <span className="shrink-0 text-[10px] font-bold text-white/60">
                          {score}%
                        </span>
                      </span>
                    </span>

                        <span
                            className="shrink-0 text-white/30 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                            aria-hidden="true"
                        >
                      →
                    </span>
                      </button>
                    </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>
  );
}

export default TrendingPlaces;