import { useEffect, useState } from "react";
import voyanta from "../../assets/Logo Mark.png";

function LoginForm({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setAnimate(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-[620px] h-96 bg-white rounded-3xl p-10 shadow-2xl border border-slate-100 text-center flex flex-col items-center justify-center gap-6 transform transition-all duration-300 ease-out ${
          animate
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-12 opacity-0 scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
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

        <button
          type="button"
          onClick={() => {
          }}
          className="w-full max-w-md flex items-center justify-center gap-3 py-3.5 px-6 bg-white border border-slate-200 rounded-full text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all duration-200 shadow-sm active:scale-98"
        >
         
          <span className="text-base">Google ilə davam et</span>
        </button>

        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Davam etməklə
          <a href="#" className="underline hover:text-slate-600">
            İstifadə şərtləri
          </a>
          və
          <a href="#" className="underline hover:text-slate-600">
            Məxfilik siyasətini
          </a>
          qəbul edirsən.
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
