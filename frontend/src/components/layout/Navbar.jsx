import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Menu, X, Download, Smartphone, Laptop, Check, LogIn, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(
    typeof window !== "undefined" && window.deferredInstallPrompt ? window.deferredInstallPrompt : null
  );
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed & launched as PWA)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    ) {
      setIsInstalled(true);
    }

    // Sync if global listener captured it early
    if (window.deferredInstallPrompt) {
      setDeferredPrompt(window.deferredInstallPrompt);
    }

    const handlePromptAvailable = () => {
      if (window.deferredInstallPrompt) {
        setDeferredPrompt(window.deferredInstallPrompt);
      }
    };

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.deferredInstallPrompt = e;
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.deferredInstallPrompt = null;
      setShowPwaModal(false);
    };

    window.addEventListener("pwa-prompt-available", handlePromptAvailable);
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("pwa-prompt-available", handlePromptAvailable);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    const promptToUse = deferredPrompt || window.deferredInstallPrompt;
    if (promptToUse) {
      try {
        promptToUse.prompt();
        const choice = await promptToUse.userChoice;
        if (choice.outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
          window.deferredInstallPrompt = null;
          setShowPwaModal(false);
          return;
        }
      } catch (err) {
        console.warn("Native PWA prompt error:", err);
      }
    }
    // If native prompt is not directly available or dismissed, open clear PWA guide modal
    setShowPwaModal(true);
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-[#FFFCF7]/95 backdrop-blur-sm border-b border-[#E8E3E1] px-4 sm:px-6 lg:px-12 h-16 flex justify-between items-center z-50">
        
        {/* BRAND - Clean & Non-wrapping */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E3E1] shrink-0 bg-[#FFFCF7]">
            <img src={logo} alt="ZPPSU Seal" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#1D1A1B] tracking-tight leading-none truncate max-w-[200px] sm:max-w-none">
              ZPPSU Guidance Office
            </span>
            <span className="text-[10px] text-[#5F5A5C] uppercase tracking-wider font-mono mt-0.5">
              Digital Archiving System
            </span>
          </div>
        </div>

        {/* DESKTOP NAV LINKS (Hidden on mobile) */}
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

        {/* DESKTOP ACTIONS (Hidden on mobile to prevent navbar crowding) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={handleInstallClick}
            title="Install ZPPSU Archive as a Progressive Web App"
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
                <span>Install PWA</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-[#6B1B2E] text-[#FFFCF7] hover:bg-[#521322] rounded-[4px] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
          >
            Staff Sign In
          </button>
        </div>

        {/* MOBILE HAMBURGER BUTTON (Clean single icon) */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 text-[#1D1A1B] hover:bg-[#F4E7EA]/50 rounded-[4px] transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileNavOpen && (
          <div className="absolute top-16 left-0 w-full bg-[#FFFCF7] border-b border-[#E8E3E1] shadow-xl md:hidden px-6 py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-3 text-xs uppercase tracking-wider font-mono text-[#5F5A5C]">
              <Link
                to="home"
                smooth={true}
                duration={400}
                onClick={() => setMobileNavOpen(false)}
                className="py-2 hover:text-[#1D1A1B] transition-colors"
              >
                Overview
              </Link>
              <Link
                to="features"
                smooth={true}
                duration={400}
                onClick={() => setMobileNavOpen(false)}
                className="py-2 hover:text-[#1D1A1B] transition-colors"
              >
                Capabilities
              </Link>
              <Link
                to="about"
                smooth={true}
                duration={400}
                onClick={() => setMobileNavOpen(false)}
                className="py-2 hover:text-[#1D1A1B] transition-colors"
              >
                Mandate
              </Link>
              <Link
                to="contact"
                smooth={true}
                duration={400}
                onClick={() => setMobileNavOpen(false)}
                className="py-2 hover:text-[#1D1A1B] transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="pt-4 border-t border-[#E8E3E1] flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleInstallClick();
                }}
                className="w-full py-2.5 px-3 border border-[#6B1B2E]/30 bg-[#F4E7EA]/30 text-[#6B1B2E] rounded-[4px] flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer"
              >
                {isInstalled ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>PWA Installed</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Install PWA App</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  navigate("/login");
                }}
                className="w-full py-2.5 px-3 bg-[#6B1B2E] text-[#FFFCF7] rounded-[4px] flex items-center justify-center gap-2 font-bold cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff Sign In</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* PROGRESSIVE WEB APP (PWA) INSTALLATION MODAL */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FFFCF7] border border-[#E8E3E1] rounded-[4px] p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E8E3E1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E8E3E1] shrink-0 bg-[#FFFCF7]">
                  <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1A1B]">ZPPSU Archiving System</h3>
                  <span className="text-[10px] font-mono text-[#6B1B2E] uppercase tracking-wider block font-semibold">
                    Progressive Web Application (PWA)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="text-[#5F5A5C] hover:text-[#1D1A1B] p-1 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explanation */}
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              This system is built as a Progressive Web App (PWA). It installs directly to your device desktop or home screen with standalone windowing, offline asset caching, and zero background installation files.
            </p>

            {/* NATIVE PROMPT BUTTON (If browser event is active) */}
            {(deferredPrompt || (typeof window !== "undefined" && window.deferredInstallPrompt)) ? (
              <div className="p-4 border border-[#6B1B2E]/30 bg-[#F4E7EA]/40 rounded-[4px] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#6B1B2E]">
                  <Download className="w-4 h-4" />
                  <span>Browser Installation Ready</span>
                </div>
                <p className="text-xs text-[#1D1A1B]/80">
                  Your browser is ready to install the ZPPSU Archiving System to your operating system now.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleInstallClick();
                  }}
                  className="w-full py-2.5 bg-[#6B1B2E] text-[#FFFCF7] hover:bg-[#521322] rounded-[4px] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Application Now</span>
                </button>
              </div>
            ) : null}

            {/* PLATFORM INSTRUCTIONS */}
            <div className="space-y-2.5 text-xs">
              {/* Desktop Instructions */}
              <div className="border border-[#E8E3E1] bg-[#FAF7F2] p-3.5 rounded-[4px] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1D1A1B]">
                  <Laptop className="w-4 h-4 text-[#6B1B2E]" />
                  <span>Desktop (Chrome, Edge, Brave)</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-[#5F5A5C] space-y-1 font-mono">
                  <li>
                    Look at your browser&apos;s address bar (top-right, near the bookmark star).
                  </li>
                  <li>
                    Click the <strong className="text-[#1D1A1B]">Install App</strong> icon (or menu <span className="text-[#1D1A1B]">⋮</span> &rarr; <span className="text-[#1D1A1B]">&quot;Install ZPPSU Archive...&quot;</span>).
                  </li>
                  <li>
                    Confirm to add the standalone app to your Desktop and Start Menu.
                  </li>
                </ul>
              </div>

              {/* Mobile Instructions */}
              <div className="border border-[#E8E3E1] bg-[#FAF7F2] p-3.5 rounded-[4px] space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1D1A1B]">
                  <Smartphone className="w-4 h-4 text-[#6B1B2E]" />
                  <span>Mobile Devices (Android &amp; iOS)</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-[#5F5A5C] space-y-1 font-mono">
                  <li>
                    <strong className="text-[#1D1A1B]">Android (Chrome):</strong> Tap menu (⋮) &rarr; tap <strong className="text-[#1D1A1B]">&quot;Install App&quot;</strong> or &quot;Add to Home screen&quot;.
                  </li>
                  <li>
                    <strong className="text-[#1D1A1B]">iPhone / iPad (Safari):</strong> Tap Share (⎋) &rarr; scroll down and tap <strong className="text-[#1D1A1B]">&quot;Add to Home Screen&quot;</strong>.
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E3E1]">
              <span className="text-[11px] font-mono text-[#5F5A5C]">
                {isInstalled ? "Status: App Installed" : "Standard PWA Spec"}
              </span>
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="px-4 py-1.5 border border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-[4px] text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
