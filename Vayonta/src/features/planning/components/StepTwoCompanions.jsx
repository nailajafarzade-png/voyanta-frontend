import solo from "../../../assets/solo.png"
import couple from "../../../assets/couple.png"
import friends from "../../../assets/friends.png"
import family from "../../../assets/family.png"


function StepTwoCompanions({ formData, setFormData }) {
  const options = [
    { id: "solo", label: "Tək", icon: solo },
    { id: "couple", label: "Cütlük", icon: couple },
    { id: "friends", label: "Dostlar", icon: friends },
    { id: "family", label: "Ailə", icon: family },
  ];

  const handleCompanionChange = (id) => {
    setFormData({
      ...formData,
      companion: id,
      peopleCount:
        id === "solo"
          ? 1
          : id === "couple"
          ? 2
          : formData.peopleCount || 2,
    });
  };

  const decreasePeople = () => {
    setFormData({
      ...formData,
      peopleCount: Math.max(2, formData.peopleCount - 1),
    });
  };

  const increasePeople = () => {
    setFormData({
      ...formData,
      peopleCount: formData.peopleCount + 1,
    });
  };

  const decreaseAdults = () => {
    setFormData({
      ...formData,
      adults: Math.max(1, formData.adults - 1),
      peopleCount: Math.max(1, formData.adults - 1) + formData.children,
    });
  };

  const increaseAdults = () => {
    setFormData({
      ...formData,
      adults: formData.adults + 1,
      peopleCount: formData.adults + 1 + formData.children,
    });
  };

  const decreaseChildren = () => {
    setFormData({
      ...formData,
      children: Math.max(0, formData.children - 1),
      peopleCount: formData.adults + Math.max(0, formData.children - 1),
    });
  };

  const increaseChildren = () => {
    setFormData({
      ...formData,
      children: formData.children + 1,
      peopleCount: formData.adults + formData.children + 1,
    });
  };

  const showPeopleCounter =
    formData.companion === "friends" ||
    formData.companion === "family";

  return (
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
        Bu səyahətə kiminlə gedirsən?
      </h2>

      <p className="text-sm text-slate-500 mb-6">
        Planı sənə uyğun fərdiləşdirmək üçün seç.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl mb-4">
        {options.map((opt) => {
          const isSelected = formData.companion === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleCompanionChange(opt.id)}
              className={`
                flex
                flex-col
                items-center
                justify-center
                p-4
                rounded-2xl
                border
                transition-all
                duration-200
                ${
                  isSelected
                    ? "border-[#5B8DEF] bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                }
              `}
            >

              <img src={opt.icon} className="mb-2" alt="" />

              <span className="text-xs font-semibold text-slate-800">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {showPeopleCounter && (
        <>
          {formData.companion === "family" ? (
            <div className="w-full max-w-xl bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mt-2">
              <div className="flex flex-col gap-4">

                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-800">
                      👨 Böyüklər
                    </span>

                    <span className="text-xs text-slate-400 mt-1">
                      18 yaş və yuxarı
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={decreaseAdults}
                      disabled={formData.adults <= 1}
                      className="
                        w-7
                        h-7
                        rounded-full
                        bg-slate-100
                        text-slate-700
                        font-bold
                        hover:bg-slate-200
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        transition
                      "
                    >
                      −
                    </button>

                    <span className="min-w-[24px] text-center text-sm font-bold text-slate-900">
                      {formData.adults}
                    </span>

                    <button
                      type="button"
                      onClick={increaseAdults}
                      className="
                        w-7
                        h-7
                        rounded-full
                        bg-slate-100
                        text-slate-700
                        font-bold
                        hover:bg-slate-200
                        transition
                      "
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-800">
                      👶 Uşaqlar
                    </span>

                    <span className="text-xs text-slate-400 mt-1">
                      18 yaşdan kiçik
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-100">
                    <button
                      type="button"
                      onClick={decreaseChildren}
                      disabled={formData.children <= 0}
                      className="
                        w-7
                        h-7
                        rounded-full
                        bg-slate-100
                        text-slate-700
                        font-bold
                        hover:bg-slate-200
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        transition
                      "
                    >
                      −
                    </button>

                    <span className="min-w-[24px] text-center text-sm font-bold text-slate-900">
                      {formData.children}
                    </span>

                    <button
                      type="button"
                      onClick={increaseChildren}
                      className="
                        w-7
                        h-7
                        rounded-full
                        bg-slate-100
                        text-slate-700
                        font-bold
                        hover:bg-slate-200
                        transition
                      "
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    Ümumi səyahətçi
                  </span>

                  <span className="text-sm font-bold text-[#5B8DEF]">
                    {formData.adults + formData.children} nəfər
                  </span>
                </div>

              </div>
            </div>
          ) : (
            <div className="w-full max-w-xl bg-blue-50/50 border border-blue-100 rounded-2xl p-4 mt-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-slate-800">
                    👥 Neçə nəfərsiniz?
                  </span>

                  <span className="text-xs text-slate-400 mt-1">
                    Səyahət planını buna uyğun hazırlayacağıq.
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-slate-100">
                  <button
                    type="button"
                    onClick={decreasePeople}
                    disabled={formData.peopleCount <= 2}
                    className="
                      w-7
                      h-7
                      rounded-full
                      bg-slate-100
                      text-slate-700
                      font-bold
                      hover:bg-slate-200
                      disabled:opacity-40
                      disabled:cursor-not-allowed
                      transition
                    "
                  >
                    −
                  </button>

                  <span className="min-w-[24px] text-center text-sm font-bold text-slate-900">
                    {formData.peopleCount}
                  </span>

                  <button
                    type="button"
                    onClick={increasePeople}
                    className="
                      w-7
                      h-7
                      rounded-full
                      bg-slate-100
                      text-slate-700
                      font-bold
                      hover:bg-slate-200
                      transition
                    "
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default StepTwoCompanions;