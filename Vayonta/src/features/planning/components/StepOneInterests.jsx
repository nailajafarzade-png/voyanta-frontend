const INTERESTS = [
  { id: "nature", label: "Təbiət", icon: "🖼️" },
  { id: "sea", label: "Dəniz", icon: "🌊" },
  { id: "culture", label: "Tarix və mədəniyyət", icon: "🏛️" },
];

function StepOneInterests({ formData, setFormData }) {
  const toggleInterest = (id) => {
    const list = formData.interests.includes(id)
      ? formData.interests.filter((item) => item !== id)
      : [...formData.interests, id];
    setFormData({ ...formData, interests: list });
  };

  return (
    <div className="flex flex-col items-center text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Nəyə maraqlısan?
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Bir neçəsini seçə bilərsən — planını buna görə fərdiləşdirəcəyik.
      </p>

      <div className="flex flex-wrap justify-center gap-3 max-w-lg">
        {INTERESTS.map((item) => {
          const selected = formData.interests.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleInterest(item.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
                selected
                  ? "bg-[#5B8DEF] text-white border-[#5B8DEF]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all">
          <span>📍</span>
          <span>Görməli yerlər</span>
        </button>
      </div>
    </div>
  );
}

export default StepOneInterests;
