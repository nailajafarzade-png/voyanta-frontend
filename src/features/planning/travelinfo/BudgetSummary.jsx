import medium from "../../../assets/medium.png"
import hotel from "../../../assets/hotel.png"


function BudgetSummary() {
  return (
     <div className="w-full lg:w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5 sticky top-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={medium} alt="" />
                <h3 className="font-bold text-slate-900 text-base">
                  Büdcə xülasəsi
                </h3>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Orta büdcə
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Təxmini xərc: 650 AZN
                </span>
                <span className="text-slate-400">Büdcə: 650 AZN</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-[#3B82F6] w-[43%]" />
                <div className="h-full bg-[#EF4444] w-[23%]" />
                <div className="h-full bg-[#F59E0B] w-[12%]" />
                <div className="h-full bg-[#10B981] w-[22%]" />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 text-xs">
              {/* Otel */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏨</span>
                  <span className="text-slate-700 font-medium">
                    Qalma (otel)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3B82F6] w-[70%]" />
                  </div>
                  <span className="font-bold text-slate-900 w-14 text-right">
                    280 AZN
                  </span>
                </div>
              </div>

              {/* Yemək */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🍽️</span>
                  <span className="text-slate-700 font-medium">Yemək</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#EF4444] w-[45%]" />
                  </div>
                  <span className="font-bold text-slate-900 w-14 text-right">
                    150 AZN
                  </span>
                </div>
              </div>

              {/* Nəqliyyat */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🚗</span>
                  <span className="text-slate-700 font-medium">Nəqliyyat</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F59E0B] w-[25%]" />
                  </div>
                  <span className="font-bold text-slate-900 w-14 text-right">
                    80 AZN
                  </span>
                </div>
              </div>

              {/* Fəaliyyətlər */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎟️</span>
                  <span className="text-slate-700 font-medium">
                    Fəaliyyətlər
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-[40%]" />
                  </div>
                  <span className="font-bold text-slate-900 w-14 text-right">
                    140 AZN
                  </span>
                </div>
              </div>
            </div>
          </div>
  )
}

export default BudgetSummary