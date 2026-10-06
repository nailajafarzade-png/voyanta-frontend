import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getPlanImage } from "../../../utils/imageAssignment";
import SectionHeading from "../../../components/common/SectionHeading";
import Reveal from "../../../components/common/Reveal";
import DestinationCard from "../../../components/common/DestinationCard";
import { CardSkeleton, EmptyState, ErrorState } from "../../../components/common/States";

/**
 * "Ən çox sevilən yerlər" / Popular bölməsi.
 *
 * Məlumat mənbəyi: `GET /api/destinations/popular?limit=4`.
 * Tamamilə backend → Unsplash axını ilə şəkillər təmin olunur.
 */
function PopularPlaces({ state, imagePlan }) {
    const navigate = useNavigate();
    const { places, isLoading, error, reload } = state;
    const top = places.slice(0, 4);

    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-sun-100/40 blur-3xl"
                />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="h-8 w-48 rounded-full bg-slate-200" />
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-[28px] bg-slate-200" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ErrorState className="mt-12" message={error} onRetry={reload} />
                </div>
            </section>
        );
    }

    if (places.length === 0) {
        return (
            <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-sun-100/40 blur-3xl"
                />
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        eyebrow={{ text: "Populyar", tone: "sun", icon: "⭐" }}
                        title="Ən çox sevilən yerlər"
                        description="Voyanta istifadəçilərinin ən çox planladığı və favoriləşdirdiyi istiqamətlər."
                    />
                    <EmptyState
                        className="mt-12"
                        icon="⭐"
                        title="Hələ popular istiqamət yoxdur"
                        description="İlk planını yaradın — sevdiyin yerlər burada görünəcək."
                    />
                </div>
            </section>
        );
    }

    return (
        <section className="relative overflow-hidden bg-canvas py-20 lg:py-24">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-sun-100/40 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-3/4 h-80 w-80 rounded-full bg-brand-100/30 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Reveal>
                    <SectionHeading
                        eyebrow={{ text: "Populyar", tone: "sun", icon: "⭐" }}
                        title="Ən çox sevilən yerlər"
                        description="Voyanta istifadəçilərinin ən çox planladığı və favoriləşdirdiyi istiqamətlər."
                    />
                </Reveal>

                <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {top.map((place, index) => (
                        <DestinationCard
                            key={place.id}
                            place={place}
                            imagePlan={imagePlan}
                            sectionKey="popular"
                            index={index}
                        />
                    ))}
                </div>
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
