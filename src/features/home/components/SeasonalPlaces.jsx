import misir from "../../../assets/misir.png";
import maldiv from "../../../assets/maldiv.png";
import santorini from "../../../assets/santorini.png";
import ismayilli from "../../../assets/ismayıllı.png";

const SEASONAL_PLACES = [
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

function SeasonalPlaces() {
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

        <div className="w-full flex flex-col sm:flex-row flex-wrap md:flex-nowrap items-stretch justify-between gap-6">
          {SEASONAL_PLACES.map((place) => (
            <div
              key={place.id}
              className="flex-1 min-w-[240px] bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-slate-100 group"
            >
              <div className="w-full aspect-[16/10] bg-slate-200 overflow-hidden relative">
                {place.imageUrl ? (
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-400 via-slate-300 to-slate-200 group-hover:scale-105 transition-transform duration-500 ease-out" />
                )}
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
