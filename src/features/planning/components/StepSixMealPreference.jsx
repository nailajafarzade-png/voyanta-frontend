
const MEALS = [
  { id: "none", label: "Yemək olmasın", icon: "🚫" },
  { id: "breakfast", label: "Səhər yeməyi daxil", icon: "🥐" },
  { id: "all_inclusive", label: "Hər şey daxil", icon: "🍹" },
];

function StepSixMealPreference({ formData, setFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
        Yemək üstünlüyün nədir? 🍽️
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Otel paketinə daxil olan yemək tipini seç.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MEALS.map((item) => {
          const isSelected = formData.mealPreference === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFormData({ ...formData, mealPreference: item.id })}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50/40 text-blue-600"
                  : "border-slate-100 bg-white hover:border-slate-200 text-slate-700"
              }`}
            >
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default StepSixMealPreference