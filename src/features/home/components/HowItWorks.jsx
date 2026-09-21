import comment from "../../../assets/comment.png"
import star from "../../../assets/star.png"
import save from "../../../assets/save.png"


const STEPS = [
  {
    id: 1,
    title: "Suallara cavab ver",
    description:
      "Maraq dairən, kiminlə getdiyin və büdcən haqqında qısa sual-cavab",
    bgColor: "bg-[#EAF0FE]", 
    icon: comment
  },
  {
    id: 2,
    title: "AI planını hazırlayır",
    description: "Süni intellekt sənə uyğun fərdi səyahət planı yaradır",
    bgColor: "bg-[#F2C230]",
    icon: star,
  },
  {
    id: 3,
    title: "Planını yadda saxla",
    description: "Bəyəndiyini seçib hesabında saxla, istədiyin vaxt bax",
    bgColor: "bg-[#3DBE7A]",
    icon: save,
  },
];

function HowItWorks() {
  return (
    <section className="bg-[#F9FAFB] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12 text-center">
          Necə işləyir
        </h2>

        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-6">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex-1 bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-start justify-between min-h-[220px]"
            >
              <div className="flex flex-col items-start w-full">
                <div
                  className={`w-12 h-12 rounded-2xl ${step.bgColor} flex items-center justify-center mb-6 overflow-hidden`}
                >
                    <img src={step.icon} alt="" />
                 
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
