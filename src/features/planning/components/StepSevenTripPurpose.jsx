

const PURPOSES = [
  { id: "honeymoon", label: "Bal ayı", icon: "💍" },
  { id: "instagram", label: "İnstagram üçün kontent", icon: "📷" },
  { id: "relaxation", label: "Rahatlıq", icon: "🧘" },
  { id: "adventure", label: "Macəra", icon: "🧗" },
];

function StepSevenTripPurpose({ formData, setFormData }) {

    const togglePurpose = (id) => {
    const exists = formData.tripPurpose.includes(id);
    const updated = exists
      ? formData.tripPurpose.filter((item) => item !== id)
      : [...formData.tripPurpose, id];
    setFormData({ ...formData, tripPurpose: updated });
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
        Səyahətinin məqsədi nədir? 🎯
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Bir və ya bir neçə seçim edə bilərsən.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PURPOSES.map((item) => {
          const isSelected = formData.tripPurpose.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => togglePurpose(item.id)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50/40 text-blue-600"
                  : "border-slate-100 bg-white hover:border-slate-200 text-slate-700"
              }`}
            >
              <span className="text-3xl mb-2">{item.icon}</span>
              <span className="text-sm font-medium text-center">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default StepSevenTripPurpose