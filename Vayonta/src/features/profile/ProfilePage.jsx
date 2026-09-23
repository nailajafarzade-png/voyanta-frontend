import { useState } from "react"
import { useNavigate } from "react-router-dom"
import account from "../../assets/account.png"
import profil from "../../assets/profil.png"
import { useAuth } from "../../context/authContext"
import { updateMe } from "../../api/user"
import { apiErrorMessage } from "../../api/errors"
import { formatDate, initialsOf } from "../../utils/format"

function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  const [showDetails, setShowDetails] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  if (!user) {
    return null // ProtectedRoute istifadəçi olmadan bu səhifəni açmır
  }

  const startEditing = () => {
    setFullName(user.fullName)
    setPhone(user.phone ?? "")
    setError(null)
    setSaved(false)
    setShowDetails(true)
    setIsEditing(true)
  }

  // PUT /api/users/me — yalnız ad və telefon dəyişdirilə bilir (e-poçt yox)
  const handleSave = async (event) => {
    event.preventDefault()
    if (isSaving) return

    const trimmedName = fullName.trim()
    if (trimmedName.length < 2) {
      setError("Ad ən azı 2 simvol olmalıdır.")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const updated = await updateMe({
        fullName: trimmedName,
        phone: phone.trim() === "" ? null : phone.trim(),
      })
      setUser(updated)
      setIsEditing(false)
      setSaved(true)
    } catch (caught) {
      setError(apiErrorMessage(caught))
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/", { replace: true })
  }

  const memberSince = formatDate(user.createdAt)

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mt-10 mx-auto flex flex-col md:flex-row items-start gap-8">

        <div className="w-full md:w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">

          <div className="w-24 h-24 rounded-full bg-blue-50 text-[#5B8DEF] font-bold text-2xl flex items-center justify-center mb-4">
            {initialsOf(user.fullName)}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1 break-words max-w-full">
            {user.fullName}
          </h2>

          <p className="text-xs text-slate-400 mb-6 font-normal break-all">
            {user.email}
          </p>

          {memberSince && (
            <div className="w-full flex items-center justify-center gap-8 py-3 border-t border-slate-100 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-slate-900">
                  {memberSince}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  üzv olub
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={startEditing}
            className="w-full border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-xs py-3 rounded-full transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Profili redaktə et</span>
            <svg
              className="w-3.5 h-3.5 text-slate-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>

        </div>

        <div className="flex-1 w-full flex flex-col gap-8">

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 px-1">
              Hesab
            </span>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">

              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                aria-expanded={showDetails}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                 <img src={profil} alt="" />
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                    Şəxsi məlumatlar
                  </span>
                </div>

                <span
                  className={`text-slate-400 group-hover:text-slate-600 text-sm transition-transform ${
                    showDetails ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>

              {showDetails && (
                <div className="px-5 py-5 bg-white">
                  {isEditing ? (
                    <form onSubmit={handleSave} className="flex flex-col gap-4">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-slate-500">Ad və soyad</span>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          maxLength={100}
                          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#5B8DEF]"
                        />
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-slate-500">E-poçt</span>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-400 cursor-not-allowed"
                        />
                        <span className="text-xs text-slate-400">E-poçt dəyişdirilə bilməz.</span>
                      </label>

                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold text-slate-500">Telefon</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+994 50 000 00 00"
                          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#5B8DEF]"
                        />
                      </label>

                      {error && (
                        <p
                          role="alert"
                          className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-2.5"
                        >
                          {error}
                        </p>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="bg-[#5B8DEF] hover:bg-[#4A7CE0] disabled:bg-slate-300 text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
                        >
                          {isSaving ? "Saxlanılır..." : "Yadda saxla"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false)
                            setError(null)
                          }}
                          className="border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-6 py-2.5 rounded-full transition-colors"
                        >
                          Ləğv et
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-x-6 gap-y-3 text-sm">
                        <dt className="text-slate-400">Ad və soyad</dt>
                        <dd className="text-slate-900 font-medium break-words">{user.fullName}</dd>

                        <dt className="text-slate-400">E-poçt</dt>
                        <dd className="text-slate-900 font-medium break-all">{user.email}</dd>

                        <dt className="text-slate-400">Telefon</dt>
                        <dd className="text-slate-900 font-medium">
                          {user.phone ? user.phone : <span className="text-slate-400 font-normal">Əlavə edilməyib</span>}
                        </dd>
                      </dl>

                      {saved && (
                        <p role="status" className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5">
                          Məlumatlar yadda saxlanıldı.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={startEditing}
                        className="self-start text-sm font-medium text-[#5B8DEF] hover:text-[#4A7CE0] transition-colors"
                      >
                        Məlumatları dəyiş
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          <div className="flex flex-col gap-2">

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden">

              <button
                type="button"
                onClick={handleLogout}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <img src={account} alt="" />
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                    Hesabdan çıxış
                  </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 text-sm">
                  ›
                </span>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ProfilePage
