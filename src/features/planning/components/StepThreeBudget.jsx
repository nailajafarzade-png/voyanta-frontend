


function StepThreeBudget({ formData, setFormData }) {

  const budgets = [
    { id: "medium", label: "Orta", price: "800 - 1200 AZN", icon: "💰" },
    { id: "comfort", label: "Rahat", price: "1200 - 2000 AZN", icon: "💎" },
    { id: "premium", label: "Premium", price: "2000+ AZN", icon: "👑" },
  ];

  return (
  <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Büdcən nə qədərdir?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Bu səyahət üçün nəzərdə tutduğun ümumi büdcəni seç (nəfər başına).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl mb-4">
        {budgets.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setFormData({ ...formData, budgetType: b.id })}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
              formData.budgetType === b.id
                ? "border-[#5B8DEF] bg-blue-50/50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <span className="text-2xl mb-1">{b.icon}</span>
            <span className="text-sm font-bold text-slate-800">{b.label}</span>
            <span className="text-xs text-slate-400 mt-1">{b.price}</span>
          </button>
        ))}
      </div>

      <div className="w-full max-w-xl text-left">
        <label className="text-xs text-slate-500 mb-1.5 block">
          Və ya dəqiq məbləğ daxil et (AZN)
        </label>
        <input
          type="text"
          placeholder="Məsələn, 650"
          value={formData.customBudget}
          onChange={(e) =>
            setFormData({ ...formData, customBudget: e.target.value })
          }
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#5B8DEF]"
        />
      </div>
    </div>
  );
}

export default StepThreeBudget;
