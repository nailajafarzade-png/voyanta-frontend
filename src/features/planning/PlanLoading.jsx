import star from "../../assets/star.png";
import coffe from "../../assets/coffe.png";
import accept from "../../assets/accept.png";

function PlanLoading() {
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
          <div className="flex items-center gap-2.5">
            <img src={accept} alt="" />
            <span>Maraq dairən təhlil olundu</span>
          </div>

          <div className="flex items-center gap-2.5">
             <img src={accept} alt="" />
            <span>Uyğun məkanlar seçildi</span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-900 font-semibold">
            <span className="text-lg animate-spin">⏳</span>
            <span>Gündəlik marşrut qurulur...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanLoading;
