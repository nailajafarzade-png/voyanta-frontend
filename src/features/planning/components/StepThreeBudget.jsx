import medium from "../../../assets/medium.png";
import comfort from "../../../assets/comfort.png";
import premium from "../../../assets/premium.png";
import OptionGrid from "./OptionGrid";
import StepShell from "./StepShell";

const BUDGETS = [
  { id: "medium", title: "Orta", subtitle: "800 – 1200 AZN", icon: medium },
  { id: "comfort", title: "Rahat", subtitle: "1200 – 2000 AZN", icon: comfort },
  { id: "premium", title: "Premium", subtitle: "2000+ AZN", icon: premium },
];

function StepThreeBudget({ formData, setFormData }) {
  // Dəqiq məbləğ yazılanda seçilmiş səviyyə ləğv olunur (backend-də CUSTOM büdcə)
  const handleCustomBudget = (value) => {
    setFormData({
      ...formData,
      customBudget: value,
      budgetType:
        value.trim() !== ""
          ? "custom"
          : formData.budgetType === "custom"
            ? ""
            : formData.budgetType,
    });
  };

  return (
    <StepShell
      title="Büdcən nə qədərdir?"
      description="Bu səyahət üçün nəzərdə tutduğun ümumi büdcəni seç (nəfər başına)."
    >
      <OptionGrid
        ariaLabel="Büdcə səviyyəsi"
        options={BUDGETS}
        value={formData.budgetType}
        onSelect={(id) =>
          setFormData({ ...formData, budgetType: id, customBudget: "" })
        }
      />

      <div className="mx-auto mt-6 w-full max-w-xl text-left">
        <label
          htmlFor="custom-budget"
          className="mb-1.5 block text-xs font-medium text-ink-500"
        >
          Və ya dəqiq məbləğ daxil et (AZN)
        </label>

        <div className="relative">
          <input
            id="custom-budget"
            type="text"
            inputMode="numeric"
            placeholder="Məsələn, 650"
            value={formData.customBudget}
            onChange={(e) => handleCustomBudget(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-ink-900 transition-all duration-200 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />

          {formData.customBudget && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-ink-400">
              AZN
            </span>
          )}
        </div>
      </div>
    </StepShell>
  );
}

export default StepThreeBudget;
