import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import { removeFromWishlist } from "../../redux/slice/wishlistSlice";
import { setSelectedPlace } from "../../redux/slice/informationSlice";

function YourFavorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = useSelector(
    (state) => state.wishlist.favorites
  );

  const handleSelectPlace = (place) => {
    dispatch(setSelectedPlace(place));
    navigate("/travel");
  };

  const handleRemoveFavorite = (e, id) => {
    e.stopPropagation();
    dispatch(removeFromWishlist(id));
  };

  return (
    <section className="min-h-screen bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8 md:pt-30 md:pb-24">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Favorilərim
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Səyahət üçün yadda saxladığın yerlər burada görünəcək.
          </p>
        </div>

        {favorites.length === 0 ? (
          <div
            className="
              min-h-[400px]
              bg-white
              rounded-3xl
              border
              border-slate-100
              shadow-sm
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
            "
          >
            <div
              className="
                w-20
                h-20
                rounded-full
                bg-red-50
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <FaHeart className="w-9 h-9 text-red-400" />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Hələ favorit yerin yoxdur
            </h2>

            <p className="max-w-md mt-2 text-sm text-slate-400 leading-relaxed">
              Bəyəndiyin səyahət məkanlarını ürək işarəsinə klikləyərək burada
              saxlaya bilərsən.
            </p>

            <button
              type="button"
              onClick={() => navigate("/location")}
              className="
                mt-6
                px-6
                py-3
                rounded-full
                bg-slate-900
                text-white
                text-sm
                font-semibold
                hover:bg-slate-800
                transition-colors
                active:scale-95
              "
            >
              Yerlərə bax
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {favorites.length} favorit məkan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((place) => (
                <div
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="
                    group
                    bg-white
                    rounded-3xl
                    overflow-hidden
                    border
                    border-slate-100
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
                      onClick={(e) =>
                        handleRemoveFavorite(e, place.id)
                      }
                      aria-label="Favoritdən sil"
                      className="
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
                        bg-white
                        border
                        border-white
                        text-red-500
                        shadow-lg
                        transition-all
                        duration-300
                        hover:scale-110
                        active:scale-90
                      "
                    >
                      <FaHeart className="w-5 h-5 fill-current" />
                    </button>

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
                        Səyahətə bax
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
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default YourFavorites;