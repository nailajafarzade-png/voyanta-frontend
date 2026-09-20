import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../redux/slice/wishlistSlice";
import { setSelectedPlace } from "../../redux/slice/informationSlice";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // RegHeart əlavə olundu

import misir from "../../assets/misir.png";
import maldiv from "../../assets/maldiv.png";
import santorini from "../../assets/santorini.png";
import ismayilli from "../../assets/ismayıllı.png";

const PERSONALIZED_PLACES = [
  {
    id: 1,
    title: "Kapadokya, Türkiyə",
    subtitle: "Təbiət həvəskarları üçün",
    imageUrl: misir,
  },
  {
    id: 2,
    title: "Roma, İtaliya",
    subtitle: "Tarix və mədəniyyət",
    imageUrl: maldiv,
  },
  {
    id: 3,
    title: "Krit adası, Yunanıstan",
    subtitle: "Dəniz və günəş",
    imageUrl: ismayilli,
  },
  {
    id: 4,
    title: "Santorini, Yunanıstan",
    subtitle: "Romantik gün batımları və vulkan mənzərələri",
    imageUrl: santorini, 
  },
];

function LocationsDiscovered() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = useSelector((state) => state.wishlist.favorites);

  const handleSelectPlace = (place) => {
    dispatch(setSelectedPlace(place));
    navigate("/travel");
  };

  const handleToggleFavorite = (e, place) => {
    e.stopPropagation();
    dispatch(toggleWishlist(place));
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

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PERSONALIZED_PLACES.map((place) => {
            const isFavorite = favorites.some((item) => item.id === place.id);

            return (
              <div
                key={place.id}
                onClick={() => handleSelectPlace(place)}
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
                  cursor-pointer
                "
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-200">
                  <img
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