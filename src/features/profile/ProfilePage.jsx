
function ProfilePage() {
    const user = {
    name: 'Aysel Məmmədova',
    initials: 'AM',
    email: 'aysel.m@gmail.com',
    travelPlansCount: 6,
    countriesCount: 3,
  };

  const handleLogout = () => {
    console.log('Hesabdan çıxış edildi');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mt-10 mx-auto flex flex-col md:flex-row items-start gap-8">
        
        <div className="w-full md:w-80 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center">
          
          <div className="w-24 h-24 rounded-full bg-blue-50 text-[#5B8DEF] font-bold text-2xl flex items-center justify-center mb-4">
            {user.initials}
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {user.name}
          </h2>

          <p className="text-xs text-slate-400 mb-6 font-normal">
            {user.email}
          </p>

          <div className="w-full flex items-center justify-center gap-8 py-3 border-t border-slate-100 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900">
                {user.travelPlansCount}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                səyahət planı
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-slate-900">
                {user.countriesCount}
              </span>
              <span className="text-xs text-slate-400 mt-0.5">
                ölkə
              </span>
            </div>
          </div>

          <button
            type="button"
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
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                    Şəxsi məlumatlar
                  </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 text-sm">
                  ›
                </span>
              </button>

              <button
                type="button"
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔒</span>
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-slate-900">
                    Şifrə və təhlükəsizlik
                  </span>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 text-sm">
                  ›
                </span>
              </button>

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
                  <span className="text-lg">🚪</span>
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