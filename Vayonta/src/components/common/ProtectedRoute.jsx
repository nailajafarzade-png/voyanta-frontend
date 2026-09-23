import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useAuthModal } from "../../context/authModalContext";

/**
 * /profil və /favorites yalnız daxil olmuş istifadəçi üçündür.
 * Token bərpa olunarkən yönləndirmə etmir — əks halda səhifə yenilənəndə
 * daxil olmuş istifadəçi də giriş pəncərəsi görərdi.
 */
function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogin } = useAuthModal();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-[#5B8DEF] animate-spin" />
          <p className="text-sm text-slate-500">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900">Bu səhifə üçün daxil ol</h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Profilini və bəyəndiyin yerləri görmək üçün Google hesabınla daxil ol.
          </p>
          <button
            type="button"
            onClick={openLogin}
            className="mt-2 px-7 py-2.5 rounded-full bg-[#5B8DEF] hover:bg-[#4A7CE0] text-white text-sm font-semibold transition-colors"
          >
            Daxil ol
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;
