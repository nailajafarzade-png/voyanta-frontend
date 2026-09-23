import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PlanningPage from "./PlanningPage";
import BudgetSummary from "./travelinfo/BudgetSummary";
import { getPlan, getPlanStatus } from "../../api/plans";
import { apiErrorMessage } from "../../api/errors";
import { useAuth } from "../../context/authContext";
import { useAuthModal } from "../../context/authModalContext";
import { COMPANION_LABELS } from "./labels";
import { claimAnonymousPlan } from "./claimAnonymousPlan";
import { getPendingPlanId } from "./storage";
import {
  dateForDayNumber,
  formatAzn,
  formatDateRange,
  formatDayLabel,
} from "../../utils/format";
import { resolveLocalImage } from "../../utils/localImages";

/** /travel/:planId — GET /api/plans/{id} ilə real planı göstərir. */
function TravelItineraryPage() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cancelled = useRef(false);
  const claimTried = useRef(false);

  const loadPlan = useCallback(async (id) => {
    const loaded = await getPlan(id);
    if (!cancelled.current) {
      setPlan(loaded);
      setIsLoading(false);
    }
  }, []);

  // Plan hələ hazırlanırsa gözləmə ekranına, hazırdırsa yükləməyə yönləndir
  useEffect(() => {
    cancelled.current = false;
    claimTried.current = false;
    setIsLoading(true);
    setError(null);
    setPlan(null);

    (async () => {
      try {
        const status = await getPlanStatus(planId);
        if (cancelled.current) return;

        if (status.status === "GENERATING") {
          navigate(`/loading/${planId}`, { replace: true });
          return;
        }

        if (status.status === "FAILED") {
          setError(status.message || "Plan yaradıla bilmədi.");
          setIsLoading(false);
          return;
        }

        await loadPlan(planId);
      } catch (caught) {
        if (!cancelled.current) {
          setError(apiErrorMessage(caught));
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled.current = true;
    };
  }, [planId, navigate, loadPlan]);

  // Daxil olmuş istifadəçi üçün anonim yaradılmış planı hesaba bağla, sonra planı YENİDƏN yüklə
  // (əks halda ekranda claim-dən əvvəlki kilidli cavab qalar).
  useEffect(() => {
    if (authLoading || !isAuthenticated || !plan) return;
    if (claimTried.current || getPendingPlanId() !== planId) return;

    claimTried.current = true;
    claimAnonymousPlan()
      .then(() => loadPlan(planId))
      .catch(() => {
        // Claim uğursuz olsa belə səhifə işləməyə davam edir
      });
  }, [authLoading, isAuthenticated, plan, planId, loadPlan]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <span className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-[#5B8DEF] animate-spin" />
          <p className="text-sm text-slate-500">Plan yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col items-center gap-3">
          <h2 className="text-xl font-bold text-slate-900">Plan yüklənə bilmədi</h2>
          <p role="alert" className="text-sm text-slate-500 leading-relaxed">
            {error ?? "Plan tapılmadı."}
          </p>
          <Link
            to="/"
            className="mt-2 px-7 py-2.5 rounded-full bg-[#5B8DEF] hover:bg-[#4A7CE0] text-white text-sm font-semibold transition-colors"
          >
            Ana səhifə
          </Link>
        </div>
      </div>
    );
  }

  const days = [...(plan.days ?? [])].sort((a, b) => a.dayNumber - b.dayNumber);
  const hasLockedDays = days.some((day) => day.locked);
  const currentTitle = plan.destination ?? "Səyahət planın";
  const currentImage = resolveLocalImage(null, plan.destination ?? "");
  const dateRange = formatDateRange(plan.startDate, plan.endDate);
  const companionLabel = plan.companion ? COMPANION_LABELS[plan.companion] : null;
  const total = plan.budgetSummary?.total;

  let itemCounter = 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] mt-12 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        <div className="relative w-full h-[280px] sm:h-[320px] rounded-3xl overflow-hidden shadow-md bg-gradient-to-tr from-slate-700 via-slate-500 to-slate-400">
          {currentImage && (
            <img
              src={currentImage}
              alt={currentTitle}
              className="w-full h-full object-cover"
            />
          )}

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
                  {dateRange && (
                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                      📅 {dateRange}
                    </span>
                  )}
                  {companionLabel && (
                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                      👨‍👩‍👧 {companionLabel}
                    </span>
                  )}
                  {total != null && (
                    <span className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
                      💰 Təxmini {formatAzn(total)}
                    </span>
                  )}
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

        {/* Kilidli günlər üçün qeydiyyat çağırışı */}
        {hasLockedDays && !isAuthenticated && (
          <div className="bg-blue-50/70 border border-blue-100 rounded-3xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-sm text-slate-700">
              İlk 2 gün pulsuz göstərilir. Planın qalan günlərini görmək üçün qeydiyyatdan keç.
            </p>
            <button
              type="button"
              onClick={openLogin}
              className="self-start sm:self-auto px-6 py-2 rounded-full bg-[#5B8DEF] hover:bg-[#4A7CE0] text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Google ilə davam et
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className="w-full lg:flex-1 flex flex-col gap-5">
            {days.length === 0 && (
              <p className="text-sm text-slate-500 bg-white border border-slate-100 rounded-3xl px-6 py-8 text-center">
                Bu plan üçün gün məlumatı tapılmadı.
              </p>
            )}

            {days.map((day) => {
              const dayLabel = formatDayLabel(dateForDayNumber(plan.startDate, day.dayNumber));

              return (
                <div
                  key={day.dayNumber}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                    <h2 className="text-lg font-bold text-slate-900">
                      {day.dayNumber}-ci gün
                    </h2>
                    {dayLabel && (
                      <span className="text-xs text-slate-400 font-medium">
                        {dayLabel}
                      </span>
                    )}
                  </div>

                  {day.locked ? (
                    <div className="relative">
                      {/* Kilidli günün məzmunu backend-dən gəlmir — yalnız bulanıq yer tutucu */}
                      <div
                        className="flex flex-col gap-4 blur-sm select-none pointer-events-none"
                        aria-hidden="true"
                      >
                        {[0, 1, 2].map((placeholder) => (
                          <div key={placeholder} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-slate-100 shrink-0" />
                            <span className="w-10 h-3 rounded bg-slate-100 shrink-0 mt-1.5" />
                            <div className="flex flex-col gap-1.5 flex-1">
                              <span className="h-3 w-2/3 rounded bg-slate-200" />
                              <span className="h-2.5 w-1/2 rounded bg-slate-100" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                        <span className="text-2xl">🔒</span>
                        <p className="text-sm font-semibold text-slate-800">Bu gün kilidlidir</p>
                        {!isAuthenticated && (
                          <button
                            type="button"
                            onClick={openLogin}
                            className="px-6 py-2 rounded-full bg-[#5B8DEF] hover:bg-[#4A7CE0] text-white text-xs font-semibold transition-colors shadow-sm"
                          >
                            Kilidi açmaq üçün daxil ol
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {(day.items ?? []).length === 0 && (
                        <p className="text-sm text-slate-400">Bu gün üçün məlumat yoxdur.</p>
                      )}

                      {(day.items ?? []).map((item, index) => {
                        itemCounter += 1;

                        return (
                          <div
                            key={`${day.dayNumber}-${index}`}
                            className="flex items-start justify-between gap-3 text-sm"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                                {itemCounter}
                              </span>
                              <span className="text-slate-400 text-xs font-medium w-10 shrink-0 mt-1">
                                {item.time ?? ""}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">
                                  {item.title}
                                </span>
                                {item.description && (
                                  <span className="text-xs text-slate-400">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.category && (
                              <span className="text-xs font-bold text-slate-800 shrink-0">
                                {item.category}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <BudgetSummary summary={plan.budgetSummary} />
        </div>
      </div>
    </div>
  );
}

export default TravelItineraryPage;
