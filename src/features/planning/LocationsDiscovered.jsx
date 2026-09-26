import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { toggleFavorite } from "../../redux/wishlistThunks";
import { getDestinationDetails } from "../../utils/destinationDetails";
import { useDestinations } from "../../hooks/useDestinations";
import DestinationImage from "../../components/common/DestinationImage";
import { useAuth } from "../../context/authContext";
import { useAuthModal } from "../../context/authModalContext";
import { usePlanner } from "../../context/plannerContext";
import { CardSkeleton, EmptyState, ErrorState } from "../../components/common/States";

/**
 * "/location" — istiqamət kataloqu.
 *
 * Əvvəl ayrıca sorğu göndərirdi; indi `useDestinations` paylaşılan yaddaşını
 * istifadə edir (eyni endpoint-lər, azad şəbəkə sorğusu).
 * Hər kart istiqamət səhifəsinə (PO #3) aparır.
 */
function LocationsDiscovered() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { openPlanner } = usePlanner();

  const favorites = useSelector((state) => state.wishlist.favorites);

  const { places, isLoading, error, reload } = useDestinations({
    isAuthenticated,
    isAuthLoading: authLoading,
  });

  const handleToggleFavorite = (e, place) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    dispatch(toggleFavorite(place));
  };

  return (
    <section className="min-h-screen bg-canvas px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Sənin üçün seçilmiş yerlər
            </h1>

            <p className="mt-2 text-sm text-ink-400">
              Səyahət etmək istədiyin yerləri favoritlərinə əlavə et.
            </p>
          </div>

          <button
            type="button"
            onClick={isAuthenticated ? openPlanner : openLogin}
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-ink-800 active:scale-95"
          >
            <span>Plan qur</span>
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </button>
        </div>

        {isLoading && <CardSkeleton count={8} />}

        {!isLoading && error && <ErrorState message={error} onRetry={reload} />}

        {!isLoading && !error && places.length === 0 && (
          <EmptyState
            icon="🧭"
            title="Hələ istiqamət yoxdur"
            description="Yenidən cəhd et və ya bir az sonra qayıt."
            action={
              <button
                type="button"
                onClick={reload}
                className="rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ink-800 active:scale-95"
              >
                Yenidən yüklə
              </button>
            }
          />
        )}

        {!isLoading && !error && places.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {places.map((place) => {
              const isFavorite = favorites.some((item) => item.id === place.id);
              const details = getDestinationDetails(place);

              return (
                <div
                  key={place.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/destination/${place.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/destination/${place.id}`);
                    }
                  }}
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-200">
                    <DestinationImage
                      src={place.imageUrl}
                      alt={place.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
                    />

                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(e, place)}
                      aria-label={
                        isFavorite ? "Favoritlərdən sil" : "Favoritlərə əlavə et"
                      }
                      className={`absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white shadow-lg transition-all duration-300 active:scale-90 ${
                        isFavorite
                          ? "scale-105 bg-white text-red-500"
                          : "bg-white text-ink-500 hover:scale-110 hover:text-red-500"
                      }`}
                    >
                      {isFavorite ? (
                        <FaHeart className="h-5 w-5 transition-all duration-300" />
                      ) : (
                        <FaRegHeart className="h-5 w-5 transition-all duration-300" />
                      )}
                    </button>

                    {isFavorite && (
                      <span className="absolute left-3 top-3 rounded-full bg-ink-900/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md">
                        Favorit
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold leading-snug text-ink-900">
                      {place.title}
                    </h3>

                    <p className="mt-1 text-xs leading-relaxed text-ink-400">
                      {place.subtitle}
                    </p>

                    <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-500">
                      {details.headline}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3.5">
                      <span className="text-xs font-medium text-ink-400">
                        Daha ətraflı
                      </span>

                      <span
                        className="text-xs font-semibold text-brand-600 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default LocationsDiscovered;
