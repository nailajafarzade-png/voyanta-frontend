import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../redux/wishlistThunks";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // RegHeart əlavə olundu

import { getFeaturedDestinations } from "../../api/destinations";
import { getPersonalizedDestinations } from "../../api/recommendations";
import { apiErrorMessage } from "../../api/errors";
import { toPlace } from "../../utils/destinations";
import DestinationImage from "../../components/common/DestinationImage";
import { useAuth } from "../../context/authContext";
import { useAuthModal } from "../../context/authModalContext";

function LocationsDiscovered() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();

  const favorites = useSelector((state) => state.wishlist.favorites);

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Daxil olmuş istifadəçi üçün fərdi təkliflər (auth tələb edir), digərləri üçün açıq siyahı
  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const destinations = isAuthenticated
          ? await getPersonalizedDestinations()
          : await getFeaturedDestinations();
        if (!cancelled) {
          setPlaces(destinations.map(toPlace));
          setError(null);
        }
      } catch (caught) {
        if (!cancelled) setError(apiErrorMessage(caught));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, authLoading]);

  const handleToggleFavorite = (e, place) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    dispatch(toggleFavorite(place));
  };

  return (
    <section className="bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8 md:pt-30 md:pb-24">
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sənin üçün seçilmiş yerlər
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Səyahət etmək istədiyin yerləri favoritlərinə əlavə et.
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-slate-400 mb-6">Yerlər yüklənir...</p>
        )}

        {!isLoading && error && (
          <p role="alert" className="text-sm text-slate-500 mb-6">
            {error}
          </p>
        )}

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {places.map((place) => {
            const isFavorite = favorites.some((item) => item.id === place.id);

            return (
              <div
                key={place.id}
                className="
                  group
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border border-slate-100
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-200">
                  <DestinationImage
                    src={place.imageUrl}
                    alt={place.title}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/20
                      via-transparent
                      to-transparent
                      pointer-events-none
                    "
                  />

                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(e, place)}
                    aria-label={
                      isFavorite ? "Favoritlərdən sil" : "Favoritlərə əlavə et"
                    }
                    className={`
                      absolute
                      top-3
                      right-3
                      z-10
                      w-11
                      h-11
                      rounded-full
                      flex
                      items-center
                      justify-center
                      border
                      shadow-lg
                      transition-all
                      duration-300
                      active:scale-90
                      ${
                        isFavorite
                          ? "bg-white border-white text-red-500 scale-105" // Click vuranda ağ fonda qırmızı ürək
                          : "bg-white border-white text-slate-600 hover:text-red-500 hover:scale-110" // Normal halda ağ fonda boz, hoverdə qırmızı ürək
                      }
                    `}
                  >
                    {isFavorite ? (
                      <FaHeart className="w-5 h-5 transition-all duration-300" />
                    ) : (
                      <FaRegHeart className="w-5 h-5 transition-all duration-300" />
                    )}
                  </button>

                  {isFavorite && (
                    <span
                      className="
                        absolute
                        top-3
                        left-3
                        bg-black/50
                        backdrop-blur-md
                        text-white
                        text-[11px]
                        font-semibold
                        px-3
                        py-1.5
                        rounded-full
                      "
                    >
                      Favorit
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {place.title}
                  </h3>

                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {place.subtitle}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">
                      Daha ətraflı
                    </span>

                    <span
                      className="
                        text-xs
                        font-semibold
                        text-slate-700
                        group-hover:translate-x-1
                        transition-transform
                        duration-200
                      "
                    >
                      →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default LocationsDiscovered;