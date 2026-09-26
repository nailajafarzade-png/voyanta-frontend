import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useAuthModal } from "../../../context/authModalContext";
import { usePlanner } from "../../../context/plannerContext";
import { useDestinations } from "../../../hooks/useDestinations";
import { getDestinationDetails } from "../../../utils/destinationDetails";
import { seasonStatus } from "../../../utils/season";
import SectionHeading from "../../../components/common/SectionHeading";
import PostcardCard from "../../../components/common/PostcardCard";
import Reveal from "../../../components/common/Reveal";
import { CardSkeleton, ErrorState } from "../../../components/common/States";

/**
 * "Sənə xüsusi" tövsiyələr (PO tələbi #5).
 *
 * Əvvəl bu bölmə `GET /recommendations/personalized` (daxil olan) və ya
 * `GET /destinations/featured` (qonaq) çağırırdı. İndi `useDestinations`
 * paylaşılan yaddaşlı hook-dan istifadə edir — eyni endpoint-lər, amma
 * bütün ana səhifə üçün BİR sorğu.
 *
 * Kartlar 3D flip "səyahət poçt kartı" effekti ilə göstərilir.
 */
function PersonalizedPlaces() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { openPlanner } = usePlanner();

  const { places, isLoading, error, reload } = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
    limit: 4,
  });

  // Ən çox uyğun gələn 4 istiqamət
  const top = places.slice(0, 4);

  return (
    <section
      id="start-planning"
      className="relative overflow-hidden bg-canvas py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={{ text: "Sənə xüsusi", tone: "brand", icon: "✨" }}
            title="Sənə xüsusi təkliflər"
            description={
              isAuthenticated
                ? "Maraq dairən və keçmiş seçimlərin əsasında hazırladığımız istiqamətlər."
                : "Populyar və sevimli seçimlərimiz — sənə uyğun gələni kartı çevir."
            }
          />

          <Reveal delay={200}>
            <button
              type="button"
              onClick={openPlanner}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-ink-800 active:scale-95"
            >
              <span>Öz planımı yarat</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </Reveal>
        </div>

        {/* yüklənir */}
        {isLoading && <CardSkeleton count={4} className="mt-12" />}

        {/* xəta */}
        {!isLoading && error && (
          <ErrorState className="mt-12" message={error} onRetry={reload} />
        )}

        {/* kartlar */}
        {!isLoading && !error && top.length > 0 && (
          <>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {top.map((place, index) => {
                const status = seasonStatus(
                  getDestinationDetails(place).bestMonths
                );

                return (
                  <Reveal key={place.id} delay={index * 90}>
                    <PostcardCard
                      place={place}
                      onOpenDetails={(id) => navigate(`/destination/${id}`)}
                      onPlan={
                        isAuthenticated ? openPlanner : () => openLogin()
                      }
                      badge={
                        status.state === "peak" ? (
                          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-mint-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                            <span aria-hidden="true">✨</span>
                            Ən yaxşı vaxt
                          </span>
                        ) : null
                      }
                    />
                  </Reveal>
                );
              })}
            </div>

            {/* mobil üçün ipucu */}
            <p className="mt-8 text-center text-xs text-ink-400 sm:hidden">
              Kartı çevirmək üçün üzərinə toxun
            </p>
          </>
        )}
      </div>
    </section>
  );
}

export default PersonalizedPlaces;
