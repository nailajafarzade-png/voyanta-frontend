import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useAuthModal } from "../../../context/authModalContext";
import { usePlanner } from "../../../context/plannerContext";
import { getDestinationDetails } from "../../../utils/destinationDetails";
import { getPlanImage } from "../../../utils/imageAssignment";
import { seasonStatus } from "../../../utils/season";
import SectionHeading from "../../../components/common/SectionHeading";
import PostcardCard from "../../../components/common/PostcardCard";
import Reveal from "../../../components/common/Reveal";
import { CardSkeleton, EmptyState, ErrorState } from "../../../components/common/States";
import { imagePlanShape, sectionStateShape } from "./PopularPlaces";

/**
 * "Sənin üçün seçilmiş yerlər" / "Sənə xüsusi təkliflər" bölməsi — YALNIZ daxil olmuşlar.
 *
 * Məlumat mənbəyi dəyişməyib: `GET /api/recommendations/personalized` (backend
 * `@PreAuthorize("isAuthenticated()")` ilə qorunur). React yalnız göstərir:
 *   • gonaq        → heç bir sorğu göndərilmir, qeydiyyat promptu (CTA: "Qeydiyyatdan keç")
 *   • daxil olmuş  → backend-in qaytardığı istiqamətlər + hər birinin `imageUrl`-i
 *   • 401/403      → sessiya bitibsə eyni qeydiyyat promptu
 *
 * Tövsiyə seçimi və şəkil seçimi tamamilə backend-dədir — burada hesablanmır.
 */
function PersonalizedPlaces({ state, imagePlan }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();
  const { openPlanner } = usePlanner();

  // Məlumat artıq HomePage tərəfindən `source: "personalized"` ilə gəlir
  const { places, isLoading, error, authRequired, reload } = state;

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
              authRequired
                ? "Maraq dairən və keçmiş seçimlərin əsasında hazırladığımız istiqamətlər üçün hesab yarat."
                : "Maraq dairən və keçmiş seçimlərin əsasında hazırladığımız istiqamətlər."
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

        {/* gonaq / sessiya bitib → qeydiyyat promptu */}
        {authRequired && (
          <div className="mt-12 overflow-hidden rounded-4xl border border-brand-100 bg-gradient-to-br from-white via-brand-50/60 to-mint-50/70 px-6 py-14 text-center shadow-soft sm:px-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl shadow-soft ring-1 ring-slate-100">
              <span aria-hidden="true">✨</span>
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-ink-900 sm:text-2xl">
              Sənin üçün seçilmiş yerlər
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
              Bu bölmə yalnız hesabına daxil olmuş istifadəçilər üçündür.
              Pulsuz qeydiyyatdan keç, maraq dairənə uyğun istiqamətləri gör.
            </p>

            <button
              type="button"
              onClick={openLogin}
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-ink-800 active:scale-95"
            >
              <span>Qeydiyyatdan keç</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </div>
        )}

        {/* xəta */}
        {!isLoading && !authRequired && error && (
          <ErrorState className="mt-12" message={error} onRetry={reload} />
        )}

        {/* backend boş siyahı qaytardı */}
        {!isLoading && !authRequired && !error && top.length === 0 && (
          <EmptyState
            className="mt-12"
            icon="🧭"
            title="Hələ istiqamət yoxdur"
            description="Bir az sonra qayıt — sənin üçün uyğun yerlər hazırlanır."
          />
        )}

        {/* kartlar */}
        {!isLoading && !authRequired && !error && top.length > 0 && (
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
                      image={getPlanImage(imagePlan, "personalized", place)}
                      zoomable
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

PersonalizedPlaces.propTypes = {
  state: sectionStateShape.isRequired,
  imagePlan: imagePlanShape,
};

export default PersonalizedPlaces;
