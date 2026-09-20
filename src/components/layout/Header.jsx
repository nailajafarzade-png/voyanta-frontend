import { useEffect, useState } from "react";
import voyanta from "../../assets/Logo Mark.png";
import { NavLink } from "react-router-dom";
import LoginForm from "../auth/LoginForm";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogin = () => {
    setIsMenuOpen(false);
    setIsAuthOpen(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md border-slate-200/80 shadow-sm py-3"
            : "bg-white/70 backdrop-blur-sm border-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <NavLink
              to="/"
              onClick={closeMenu}
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B8DEF] rounded-lg p-1"
            >
              <img
                className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-105"
                src={voyanta}
                alt="Voyanta Logo"
              />

              <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900">
                voyanta
              </span>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
              >
                Daxil ol
              </button>

              <NavLink
                to="/profil"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                Profil
              </NavLink>

              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`
                }
              >
                Bəyəndiklərim
              </NavLink>
            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
              aria-label="Menyunu aç"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6L6 18"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen
                ? "max-h-80 opacity-100 pt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-2 pb-2">
              <button
                type="button"
                onClick={handleLogin}
                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Daxil ol
              </button>

              <NavLink
                to="/profil"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Profil
              </NavLink>

              <NavLink
                to="/favorites"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                Bəyəndiklərim
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      <LoginForm
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
}

export default Header;