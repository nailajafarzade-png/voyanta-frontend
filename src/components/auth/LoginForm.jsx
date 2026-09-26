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
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-title"
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-opacity duration-300 ${
            animate ? "bg-ink-900/60 opacity-100" : "bg-ink-900/0 opacity-0"
          }`}
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md overflow-hidden rounded-4xl border border-slate-100 bg-white p-8 shadow-lift sm:p-10 ${
              animate
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-8 scale-95 opacity-0"
            } transition-all duration-400 ease-out`}
          >
            {/* dekorativ üst qat */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-50 to-transparent"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Bağla"
              className="absolute right-5 top-5 z-10 rounded-full p-2 text-ink-400 transition-all duration-200 hover:bg-slate-100 hover:text-ink-700 active:scale-90"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="relative flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-slate-100">
                <img src={voyanta} alt="" className="h-9 w-9" />
              </div>

              <h2
                id="login-title"
                className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl"
              >
                Hesab yarat
              </h2>

              <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-500">
                Planlarını yadda saxlamaq üçün pulsuz qeydiyyatdan keç
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="mt-6 w-full rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-600"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSubmitting}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white px-6 py-4 text-sm font-semibold text-ink-700 shadow-soft transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-ink-700" />
                  <span>Daxil olunur…</span>
                </>
              ) : (
                <>
                  {/* Google rəngli işarəsi */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51Z"
                    />
                  </svg>
                  <span>Google ilə davam et</span>
                </>
              )}
            </button>

            {!GOOGLE_CLIENT_ID && (
              <p className="mt-4 max-w-xs text-[11px] leading-relaxed text-amber-600">
                Google ilə giriş hələ konfiqurasiya edilməyib (VITE_GOOGLE_CLIENT_ID
                boşdur).
              </p>
            )}

            <p className="mt-7 max-w-xs text-[11px] leading-relaxed text-ink-400">
              Davam etməklə{" "}
              <a href="#" className="underline hover:text-ink-600">
                İstifadə şərtləri
              </a>{" "}
              və{" "}
              <a href="#" className="underline hover:text-ink-600">
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
