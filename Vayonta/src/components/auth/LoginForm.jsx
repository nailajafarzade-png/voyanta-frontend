import { useCallback, useEffect, useState } from "react";
import voyanta from "../../assets/Logo Mark.png";
import { useAuth } from "../../context/authContext";
import { apiErrorMessage, messageForCode } from "../../api/errors";
import { GOOGLE_CLIENT_ID, useGoogleSignIn } from "../../hooks/useGoogleSignIn";

function LoginForm({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginWithOAuth } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setError(null);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Google-dan gələn ID token backend-ə göndərilir: POST /api/auth/oauth/google.
  // Backend-də email/şifrə söndürülüb — giriş və qeydiyyat YALNIZ Google ilədir,
  // ilk dəfə daxil olan hesab avtomatik yaranır.
  const handleIdToken = useCallback(
    async (idToken) => {
      setError(null);
      setIsSubmitting(true);

      try {
        await loginWithOAuth("google", idToken);
        onClose();
      } catch (caught) {
        setError(apiErrorMessage(caught));
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginWithOAuth, onClose]
  );

  const { hiddenButtonRef, triggerSignIn } = useGoogleSignIn(handleIdToken);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError(messageForCode("OAUTH_NOT_CONFIGURED"));
      return;
    }

    setError(null);
    triggerSignIn();
  };

  return (
    <>
      {/* Google-un öz düyməsi görünməz şəkildə həmişə DOM-dadır (modal bağlı olsa da);
          aşağıdakı stilli düymə click-i buna ötürür (bax hooks/useGoogleSignIn). */}
      <div
        ref={hiddenButtonRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          height: 0,
          overflow: "hidden",
        }}
      />

      {shouldRender && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-[620px] min-h-96 bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 text-center flex flex-col items-center justify-center gap-6 transform transition-all duration-300 ease-out ${
              animate
                ? "translate-y-0 opacity-100 scale-100"
                : "-translate-y-12 opacity-0 scale-95"
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Bağla"
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-2">
              <div className="mb-1">
                <img src={voyanta} alt="" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Hesab yarat
              </h2>

              <p className="text-sm text-slate-500 max-w-sm">
                Planlarını yaddasaxlamaq üçün pulsuz qeydiyyatdan keç
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="w-full max-w-md text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-2.5 leading-relaxed"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSubmitting}
              className="w-full max-w-md flex items-center justify-center gap-3 py-3.5 px-6 bg-white border border-slate-200 rounded-full text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm active:scale-98"
            >
              <span className="text-base">
                {isSubmitting ? "Daxil olunur..." : "Google ilə davam et"}
              </span>
            </button>

            {!GOOGLE_CLIENT_ID && (
              <p className="text-[11px] text-amber-600 max-w-xs leading-relaxed">
                Google ilə giriş hələ konfiqurasiya edilməyib (VITE_GOOGLE_CLIENT_ID boşdur).
              </p>
            )}

            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Davam etməklə{" "}
              <a href="#" className="underline hover:text-slate-600">
                İstifadə şərtləri
              </a>{" "}
              və{" "}
              <a href="#" className="underline hover:text-slate-600">
                Məxfilik siyasətini
              </a>{" "}
              qəbul edirsən.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;
