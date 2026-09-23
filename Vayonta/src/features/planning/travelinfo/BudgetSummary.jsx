import medium from "../../../assets/medium.png"
import { formatAzn } from "../../../utils/format"

// Backend BudgetSummary: accommodation, food, transport, activities, total
const ROWS = [
  { key: "accommodation", label: "Qalma (otel)", icon: "🏨", color: "#3B82F6" },
  { key: "food", label: "Yemək", icon: "🍽️", color: "#EF4444" },
  { key: "transport", label: "Nəqliyyat", icon: "🚗", color: "#F59E0B" },
  { key: "activities", label: "Fəaliyyətlər", icon: "🎟️", color: "#10B981" },
]

function BudgetSummary({ summary }) {
  const rows = ROWS.map((row) => ({ ...row, value: summary?.[row.key] ?? 0 }))
  const partsTotal = rows.reduce((sum, row) => sum + row.value, 0)
  const total = summary?.total ?? partsTotal
  const base = partsTotal > 0 ? partsTotal : 1

  return (
     <div className="w-full lg:w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5 sticky top-24">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={medium} alt="" />
                <h3 className="font-bold text-slate-900 text-base">
                  Büdcə xülasəsi
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Təxmini xərc: {formatAzn(total)}
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className="h-full"
                    style={{
                      width: `${(row.value / base) * 100}%`,
                      backgroundColor: row.color,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 text-xs">
              {rows.map((row) => (
                <div key={row.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{row.icon}</span>
                    <span className="text-slate-700 font-medium">
                      {row.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(row.value / base) * 100}%`,
                          backgroundColor: row.color,
                        }}
                      />
                    </div>
                    <span className="font-bold text-slate-900 w-16 text-right">
                      {formatAzn(row.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
  )
}

export default BudgetSummary
