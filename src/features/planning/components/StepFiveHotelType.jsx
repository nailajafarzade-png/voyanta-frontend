
const HOTELS = [
  { id: "3star", label: "3★", stars: "⭐⭐⭐" },
  { id: "4star", label: "4★", stars: "⭐⭐⭐⭐" },
  { id: "5star", label: "5★", stars: "⭐⭐⭐⭐⭐" },
  { id: "boutique", label: "Boutique", icon: "🏡" },
  { id: "villa", label: "Villa", icon: "🏖️" },
];

function StepFiveHotelType({ formData, setFormData }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-1">
        Hansı otel tipini seçirsən? 🏨
      </h2>
      <p className="text-sm text-slate-400 mb-6">
        Qalacağın yerin səviyyəsini müəyyən edir.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {HOTELS.map((item) => {
          const isSelected = formData.hotelType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFormData({ ...formData, hotelType: item.id })}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50/40 text-blue-600"
                  : "border-slate-100 bg-white hover:border-slate-200 text-slate-700"
              }`}
            >
              {item.stars ? (
                <span className="text-lg mb-1">{item.stars}</span>
              ) : (
                <span className="text-3xl mb-1">{item.icon}</span>
              )}
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default StepFiveHotelType