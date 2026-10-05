import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authContext";
import { useAuthModal } from "../../../context/authModalContext";
import { usePlanner } from "../../../context/plannerContext";
import { getPlanImage } from "../../../utils/imageAssignment";
import SectionHeading from "../../../components/common/SectionHeading";
import PostcardCard from "../../../components/common/PostcardCard";
import Reveal from "../../../components/common/Reveal";
import { CardSkeleton, EmptyState, ErrorState } from "../../../components/common/States";

/**
 * "Ən çox sevilənlər" / Popular bölməsi.
 *
 * Məlumat mənbəyi: `GET /api/destinations/popular` — ƏVVƏL bu bölmə YOXDU
 * və ana səhifədəki bütün bölmələr `featured`/`personalized` siyahısını
 * paylaşırdı, yəni eyni şəkillər təkrarlanırdı. İndi hər bölmə öz backend
 * reytinqini göstərir.
 *
 * Reytinqin hesablanması TAMAMILƏ backend-dədir (wishlist sətirləri).
 * Frontend heç bir populyarlıq ölçüsü hesablamır, sıranı qəbul edir.
 *
 * Eyni istiqamət Trending / "Sənə xüsusi" bölmələrində də varsa, `imagePlan`
 * onun FƏRQli şəkil namizədini seçir (bax: utils/imageAssignment.js).
 */
function PopularPlaces({ state, imagePlan }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { openLogin } = useAuthModal();
  const { openPlanner } = usePlanner();

  const { places, isLoading, error, reload } = state;
  const top = places.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-sun-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow={{ text: "Populyar", tone: "sun", icon: "⭐" }}
            title="Ən çox sevilən yerlər"
            description="Voyanta istifadəçilərinin ən çox planladığı və favoriləşdirdiyi istiqamətlər."
          />

          <Reveal delay={200}>
            <button
              type="button"
              onClick={isAuthenticated ? openPlanner : openLogin}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-ink-800 active:scale-95"
            >
              <span>Populyar olanı planla</span>
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </Reveal>
        </div>

        {isLoading && <CardSkeleton count={4} className="mt-12" />}

        {!isLoading && error && (
          <ErrorState className="mt-12" message={error} onRetry={reload} />
        )}

        {!isLoading && !error && top.length === 0 && (
          <EmptyState
            className="mt-12"
            icon="⭐"
            title="Hələ popular istiqamət yoxdur"
            description="İlk planını yaradın — sevdiyin yerlər burada görünəcək."
          />
        )}

        {!isLoading && !error && top.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top.map((place, index) => (
              <Reveal key={place.id} delay={index * 90}>
                <PostcardCard
                  place={place}
                  image={getPlanImage(imagePlan, "popular", place)}
                  zoomable
                  onOpenDetails={(id) => navigate(`/destination/${id}`)}
                  onPlan={isAuthenticated ? openPlanner : () => openLogin()}
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** `useDestinations` qaytardığı obyekt — bütün bölmələr bu formadan istifadə edir. */
export const sectionStateShape = PropTypes.shape({
  places: PropTypes.array.isRequired,
  allPlaces: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  authRequired: PropTypes.bool.isRequired,
  reload: PropTypes.func.isRequired,
});

/** `createImagePlan` qaytardığı Map — `getPlanImage` ilə oxunur. */
export const imagePlanShape = PropTypes.instanceOf(Map);

PopularPlaces.propTypes = {
  state: sectionStateShape.isRequired,
  imagePlan: imagePlanShape,
};

export default PopularPlaces;
