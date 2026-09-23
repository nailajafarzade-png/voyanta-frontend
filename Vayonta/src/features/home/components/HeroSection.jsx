import misir from "../../../assets/misir.png";
import maldiv from "../../../assets/maldiv.png";
import santorini from "../../../assets/santorini.png";
import ismayilli from "../../../assets/ismayıllı.png";
import { useEffect, useState } from "react";
import PlanningPage from "../../planning/PlanningPage";
import { getHomepageStats } from "../../../api/homepage";
import { formatCount, formatRating } from "../../../utils/format";

const HERO_DESTINATIONS = [
  { id: 1, title: "Maldiv adaları", imageUrl: maldiv },
  { id: 2, title: "Santorini, Yunanıstan", imageUrl: santorini },
  { id: 3, title: "Misir Piramidaları", imageUrl: misir },
  { id: 4, title: "Azərbaycan, İsmayıllı", imageUrl: ismayilli },
];
function HeroSection() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [stats, setStats] = useState(null);

  // GET /api/homepage/stats (açıq endpoint). Xəta olsa rəqəmlərin yerində "—" qalır.
  useEffect(() => {
    let cancelled = false;

    getHomepageStats()
      .then((loaded) => {
        if (!cancelled) setStats(loaded);
      })
      .catch((error) => {
        console.error("Ana səhifə statistikası yüklənmədi:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 font-sans antialiased selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#5B8DEF] text-xs font-semibold tracking-wide">
              <span>✨</span>
              <span>Süni intellektlə səyahət planlaması</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Növbəti səyahətini <br className="hidden sm:inline" />
              bir neçə sualla planla
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
              Tur şirkətlərini axtarmağa vaxt itirmə. Marağını, kiminlə
              getdiyini və büdcəni de, süni intellekt sənə uyğun plan
              hazırlasın.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="w-full sm:w-auto bg-[#5B8DEF] hover:bg-[#4A7CE0] active:bg-[#396BD0] text-white text-base font-semibold px-7 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Planlaşdırmaya başla</span>
                <span className="text-lg">→</span>
              </button>

              <PlanningPage
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
              />

              <span className="text-xs sm:text-sm text-slate-500 font-normal">
                Qeydiyyat tələb olunmur, ilk planı pulsuz gör
              </span>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/80 w-full max-w-md">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {formatCount(stats?.plansCreated)}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  hazırlanan səyahət planı
                </p>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {formatRating(stats?.avgRating)}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  istifadəçi məmnuniyyəti
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {HERO_DESTINATIONS.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3.5 sm:p-4">
                    <span className="text-white text-xs sm:text-sm font-medium tracking-wide drop-shadow-sm">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
