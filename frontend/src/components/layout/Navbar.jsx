import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Menu, X, Download, Smartphone, Check, Laptop } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        setShowPwaModal(true);
      }
    } else {
      setShowPwaModal(true);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-[#FFFCF7]/95 backdrop-blur-sm border-b border-[#E8E3E1] px-6 lg:px-12 py-3.5 flex justify-between items-center z-50">
        
        {/* BRAND */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E3E1] shrink-0 bg-[#FFFCF7]">
            <img src={logo} alt="ZPPSU Seal" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#1D1A1B] tracking-tight leading-none">
              ZPPSU Guidance Office
            </span>
            <span className="text-[10px] text-[#5F5A5C] uppercase tracking-wider font-mono mt-0.5">
              Digital Archiving System
            </span>
          </div>
        </div>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-7 text-xs uppercase tracking-wider font-medium text-[#5F5A5C]">
          <Link to="home" smooth={true} duration={400} className="cursor-pointer hover:text-[#1D1A1B] transition-colors">
            Overview
          </Link>
          <Link to="features" smooth={true} duration={400} className="cursor-pointer hover:text-[#1D1A1B] transition-colors">
            Capabilities
          </Link>
          <Link to="about" smooth={true} duration={400} className="cursor-pointer hover:text-[#1D1A1B] transition-colors">
            Mandate
          </Link>
          <Link to="contact" smooth={true} duration={400} className="cursor-pointer hover:text-[#1D1A1B] transition-colors">
            Contact
          </Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* PWA Download / Install Action */}
          <button
            type="button"
            onClick={handleInstallClick}
            title="Install ZPPSU Guidance System PWA"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-[#6B1B2E] border border-[#6B1B2E]/30 bg-[#F4E7EA]/40 hover:bg-[#6B1B2E] hover:text-[#FFFCF7] rounded-[4px] transition-colors cursor-pointer"
          >
            {isInstalled ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>PWA Installed</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download PWA</span>
              </>
            )}
          </button>

          {/* Staff Sign In */}
          <button 
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs uppercase tracking-wider font-medium text-[#1D1A1B] hover:text-[#6B1B2E] border border-[#E8E3E1] hover:border-[#6B1B2E] px-3.5 py-1.5 rounded-[4px] transition-colors cursor-pointer"
          >
            Staff Sign In
          </button>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-[#5F5A5C] hover:text-[#1D1A1B]"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE DROPDOWN */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FFFCF7] border-b border-[#E8E3E1] p-6 flex flex-col gap-4 text-xs uppercase tracking-wider font-medium text-[#1D1A1B]">
            <Link
              to="home"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="hover:text-[#6B1B2E] transition-colors"
            >
              Overview
            </Link>
            <Link
              to="features"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="hover:text-[#6B1B2E] transition-colors"
            >
              Capabilities
            </Link>
            <Link
              to="about"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="hover:text-[#6B1B2E] transition-colors"
            >
              Mandate
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="hover:text-[#6B1B2E] transition-colors"
            >
              Contact
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(false);
                handleInstallClick();
              }}
              className="flex items-center gap-2 pt-2 text-[#6B1B2E] font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Download / Install PWA App</span>
            </button>
          </div>
        )}
      </nav>

      {/* PWA INSTALLATION MODAL */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-[4px] p-6 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-[#E8E3E1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E8E3E1] shrink-0">
                  <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1A1B]">ZPPSU Archiving System</h3>
                  <span className="text-[10px] font-mono text-[#5F5A5C] uppercase tracking-wider">Progressive Web App (PWA)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="text-[#5F5A5C] hover:text-[#1D1A1B] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5F5A5C] leading-relaxed">
              <p>
                Install the official institutional archiving portal directly to your desktop or mobile device for instant offline access and native desktop windowing.
              </p>

              <div className="border border-[#E8E3E1] bg-[#FAF7F2] p-3 rounded-[4px] space-y-2 font-mono text-[11px]">
                <div className="flex items-start gap-2">
                  <Laptop className="w-4 h-4 text-[#6B1B2E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1D1A1B]">Desktop (Chrome / Edge):</strong>
                    <p className="text-[#5F5A5C]">Click the install icon in your address bar or browser menu.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-[#E8E3E1]">
                  <Smartphone className="w-4 h-4 text-[#6B1B2E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#1D1A1B]">Mobile (Android / iOS):</strong>
                    <p className="text-[#5F5A5C]">Tap browser menu (or Share on Safari) → &quot;Add to Home Screen&quot;.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="px-4 py-2 border border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-[4px] text-xs font-medium transition-colors"
              >
                Got It
              </button>
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={() => {
                    handleInstallClick();
                    setShowPwaModal(false);
                  }}
                  className="px-4 py-2 bg-[#6B1B2E] text-[#FFFCF7] hover:bg-[#521322] rounded-[4px] text-xs font-medium transition-colors"
                >
                  Install Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
