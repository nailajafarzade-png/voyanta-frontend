import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import star from "../../assets/star.png";
import coffe from "../../assets/coffe.png";
import accept from "../../assets/accept.png";
import { getPlanStatus } from "../../api/plans";
import { apiErrorMessage } from "../../api/errors";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 90; // ~3 dəqiqə

// Backend GenerationStage → hansı sətir hazırda icra olunur (0, 1, 2)
const STAGE_INDEX = {
  ANALYZING_INTERESTS: 0,
  SELECTING_PLACES: 1,
  BUILDING_ITINERARY: 2,
  DONE: 3,
};

const STEPS = [
  { done: "Maraq dairən təhlil olundu", active: "Maraq dairən təhlil olunur..." },
  { done: "Uyğun məkanlar seçildi", active: "Uyğun məkanlar seçilir..." },
  { done: "Gündəlik marşrut quruldu", active: "Gündəlik marşrut qurulur..." },
];

/** GET /api/plans/{id}/status ilə planın hazır olmasını gözləyir, sonra /travel/:planId-yə keçir. */
function PlanLoading() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timer = null;
    let attempts = 0;

    const poll = async () => {
      if (cancelled) return;

      try {
        const status = await getPlanStatus(planId);
        if (cancelled) return;

        if (status.status === "READY") {
          navigate(`/travel/${planId}`, { replace: true });
          return;
        }

        if (status.status === "FAILED") {
          setError(status.message || "Plan hazırlanarkən xəta baş verdi.");
          return;
        }

        if (status.stage && STAGE_INDEX[status.stage] !== undefined) {
          setActiveIndex(STAGE_INDEX[status.stage]);
        }

        attempts += 1;
        if (attempts >= MAX_POLL_ATTEMPTS) {
          setError("Plan hazırlanması çox uzun çəkdi. Bir az sonra yenidən yoxla.");
          return;
        }

        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (caught) {
        if (!cancelled) setError(apiErrorMessage(caught));
      }
    };

    poll();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [planId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">Plan hazırlana bilmədi</h1>
          <p role="alert" className="text-sm text-slate-500 leading-relaxed">
            {error}
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-2 px-7 py-2.5 rounded-full bg-[#5B8DEF] hover:bg-[#4A7CE0] text-white text-sm font-semibold transition-colors"
          >
            Ana səhifəyə qayıt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4 font-sans">
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="w-20 h-20 bg-blue-50/80 rounded-full flex items-center justify-center mb-8 shadow-sm">
          <img src={star} alt="" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          AI sənin planını hazırlayır...
        </h1>

        <img src={coffe} className=" mb-10" alt="" />

        <div className="flex flex-col gap-3.5 items-start text-sm sm:text-base text-slate-600 font-medium">
          {STEPS.map((step, index) => {
            if (index < activeIndex) {
              return (
                <div key={step.done} className="flex items-center gap-2.5">
                  <img src={accept} alt="" />
                  <span>{step.done}</span>
                </div>
              );
            }

            if (index === activeIndex) {
              return (
                <div
                  key={step.done}
                  className="flex items-center gap-2.5 text-slate-900 font-semibold"
                >
                  <span className="text-lg animate-spin">⏳</span>
                  <span>{step.active}</span>
                </div>
              );
            }

            return (
              <div key={step.done} className="flex items-center gap-2.5 text-slate-400">
                <span className="w-5 h-5 rounded-full border-2 border-slate-200" />
                <span>{step.active}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PlanLoading;
