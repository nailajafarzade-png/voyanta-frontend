

function Footer() {
  return (
    <footer className="w-full font-sans">
      <div className="bg-[#1D1E22] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-snug mb-8">
            Növbəti səyahətin bir neçə sual <br className="hidden sm:inline" />
            uzaqlığındadır
          </h2>

          <button
            type="button"
            className="bg-[#5B8DEF] hover:bg-[#4A7CE0] active:bg-[#396BD0] text-white font-medium text-base px-8 py-3.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D1E22]"
          >
            İndi planlaşdır
          </button>
        </div>
      </div>

      <div className="bg-[#F9FAFB] border-t border-slate-200/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-500 text-center sm:text-left">
            © Voyanta 2026. Bütün hüquqlar qorunur.
          </p>

          <div className="flex items-center gap-6 text-xs sm:text-sm text-slate-600">
            <a
              href="#"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:underline"
            >
              Əlaqə
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:underline"
            >
              Məxfilik siyasəti
            </a>
            <a
              href="#"
              className="hover:text-slate-900 transition-colors focus:outline-none focus-visible:underline"
            >
              İstifadə şərtləri
            </a>

            
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
