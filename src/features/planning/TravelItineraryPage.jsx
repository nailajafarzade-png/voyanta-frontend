import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PlanningPage from "./PlanningPage";
import BudgetSummary from "./travelinfo/BudgetSummary";

function TravelItineraryPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const dispatch = useDispatch();

  const selectedPlace = useSelector((state) => state.information.selectedPlace);

  const currentTitle = selectedPlace.title;

  const currentImage = selectedPlace?.imageUrl;

  return (
    <div className="min-h-screen bg-[#F9FAFB] mt-12 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-md">
          <img
            src={currentImage}
            alt="Tbilisi & Sighnaghi"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div></div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  {currentTitle}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-white/90 font-medium">
                  <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    📅 12–16 May, 2026
                  </span>
                  <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    👨‍👩‍👧 Ailə · 2 böyük, 1 uşaq
                  </span>
                  <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                    💰 Orta büdcə · 650 AZN
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWizardOpen(true)}
                className="self-start sm:self-auto bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition-all duration-200 shadow-md active:scale-95 whitespace-nowrap"
              >
                Yenidən planla
              </button>

              <PlanningPage
                isOpen={isWizardOpen}
                onClose={() => setIsWizardOpen(false)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <h2 className="text-lg font-bold text-slate-900">1-ci gün</h2>
                <span className="text-xs text-slate-400 font-medium">
                  12 May, Bazar ertəsi
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span className="text-slate-400 text-xs font-medium w-10 shrink-0 mt-1">
                      14:00
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        Otelə giriş
                      </span>
                      <span className="text-xs text-slate-400">
                        Sighnaghi Boutique Hotel — mərkəzə 5 dəq piyada
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 shrink-0">
                    140 AZN
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span className="text-slate-400 text-xs font-medium w-10 shrink-0 mt-1">
                      15:30
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        Şəhər gəzintisi
                      </span>
                      <span className="text-xs text-slate-400">
                        Qədim divarlar və mənzərəli küçələr
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 shrink-0">
                    Pulsuz
                  </span>
                </div>

                {/* Maddə 3 */}
                <div className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span className="text-slate-400 text-xs font-medium w-10 shrink-0 mt-1">
                      19:00
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">
                        Axşam yeməyi
                      </span>
                      <span className="text-xs text-slate-400">
                        Pheasant's Tears restoranı — yerli mətbəx
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 shrink-0">
                    45 AZN
                  </span>
                </div>
              </div>
            </div>
          </div>
          <BudgetSummary />
        </div>
      </div>
    </div>
  );
}

export default TravelItineraryPage;
