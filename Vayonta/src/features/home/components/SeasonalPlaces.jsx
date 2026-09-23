import { useEffect, useState } from "react";
import { getFeaturedDestinations } from "../../../api/destinations";
import { apiErrorMessage } from "../../../api/errors";
import { toPlace } from "../../../utils/destinations";
import DestinationImage from "../../../components/common/DestinationImage";

function SeasonalPlaces() {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET /api/destinations/featured (açıq endpoint)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const destinations = await getFeaturedDestinations();
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
  }, []);

  return (
    <section className="bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-start">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#3DBE7A]" />
          <span className="text-xs font-semibold text-[#3DBE7A] tracking-wide">
            GÜNÜN İLHAMI
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
         Mövsümi seçimlər
        </h2>

        <p className="text-slate-500 text-sm sm:text-base mb-10">
         Bu mövsümə uyğunlaşdırılmış istiqamətlər — hər gün yenilənir.
        </p>

        {isLoading && (
          <p className="text-sm text-slate-400 mb-6">Yerlər yüklənir...</p>
        )}

        {!isLoading && error && (
          <p role="alert" className="text-sm text-slate-500 mb-6">
            {error}
          </p>
        )}

        <div className="w-full flex flex-col sm:flex-row flex-wrap md:flex-nowrap items-stretch justify-between gap-6">
          {places.map((place) => (
            <div
              key={place.id}
              className="flex-1 min-w-[240px] bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-slate-100 group"
            >
              <div className="w-full aspect-[16/10] bg-slate-200 overflow-hidden relative">
                <DestinationImage
                  src={place.imageUrl}
                  alt={place.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              <div className="p-5 flex flex-col items-start gap-1">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {place.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {place.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SeasonalPlaces;
