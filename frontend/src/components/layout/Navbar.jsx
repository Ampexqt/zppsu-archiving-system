import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Menu, X, Download, Smartphone, Laptop, Check, LogIn } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  // Universal Desktop Shortcut Download (.url file that works in ANY browser: Brave, Firefox, Chrome, Edge, Safari)
  const downloadDesktopShortcut = () => {
    const currentOrigin = window.location.origin;
    const shortcutContent = `[InternetShortcut]\r\nURL=${currentOrigin}/\r\nIconIndex=0\r\nIconFile=${currentOrigin}/logo.jpg\r\n`;
    const blob = new Blob([shortcutContent], { type: 'application/internet-shortcut' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ZPPSU_Guidance_Archive.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return;
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
    // If not Chrome with native prompt, open universal modal with instant download
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
            title="Download or Install ZPPSU Archive PWA"
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

          <button 
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs uppercase tracking-wider font-medium text-[#1D1A1B] hover:text-[#6B1B2E] border border-[#E8E3E1] hover:border-[#6B1B2E] px-3.5 py-1.5 rounded-[4px] transition-colors cursor-pointer"
          >
            Staff Sign In
          </button>
        </div>

        {/* MOBILE ONLY TOGGLE (Clean, single button on the right) */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-[4px] transition-colors"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER (Houses all actions cleanly without horizontal squishing) */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#FFFCF7] border-b border-[#E8E3E1] p-5 shadow-lg flex flex-col gap-4 text-xs font-mono uppercase tracking-wider text-[#1D1A1B]">
            <Link
              to="home"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="py-1.5 hover:text-[#6B1B2E] transition-colors"
            >
              Overview
            </Link>
            <Link
              to="features"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="py-1.5 hover:text-[#6B1B2E] transition-colors"
            >
              Capabilities
            </Link>
            <Link
              to="about"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="py-1.5 hover:text-[#6B1B2E] transition-colors"
            >
              Mandate
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={400}
              onClick={() => setMobileNavOpen(false)}
              className="py-1.5 hover:text-[#6B1B2E] transition-colors"
            >
              Contact
            </Link>

            <div className="pt-3 border-t border-[#E8E3E1] flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleInstallClick();
                }}
                className="w-full py-2.5 px-3 border border-[#6B1B2E]/30 bg-[#F4E7EA]/40 text-[#6B1B2E] rounded-[4px] flex items-center justify-center gap-2 font-bold cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download / Install PWA</span>
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

      {/* UNIVERSAL PWA DOWNLOAD & INSTALL MODAL */}
      {showPwaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FFFCF7] border border-[#E8E3E1] rounded-[4px] p-5 sm:p-6 shadow-2xl space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E8E3E1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-[#E8E3E1] shrink-0 bg-[#FFFCF7]">
                  <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1D1A1B]">ZPPSU Archiving System</h3>
                  <span className="text-[10px] font-mono text-[#5F5A5C] uppercase tracking-wider block">
                    Direct PWA Download &amp; Installation
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="text-[#5F5A5C] hover:text-[#1D1A1B] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Install the archiving system to your device for instant offline access, standalone desktop windowing, and 0ms latency.
            </p>

            {/* DIRECT 1-CLICK DOWNLOAD ACTION (Solves unsupported browser issue) */}
            <div className="border border-[#E8E3E1] bg-[#FAF7F2] p-3.5 rounded-[4px] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-[#6B1B2E]" />
                  <span className="text-xs font-bold text-[#1D1A1B]">Desktop Launcher (.URL)</span>
                </div>
                <span className="text-[10px] font-mono text-[#5F5A5C]">Any Browser</span>
              </div>
              <p className="text-[11px] text-[#5F5A5C]">
                Works immediately on Brave, Firefox, Chrome, Edge, and Safari without requiring browser store prompts.
              </p>
              <button
                type="button"
                onClick={downloadDesktopShortcut}
                className="w-full py-2 bg-[#6B1B2E] text-[#FFFCF7] hover:bg-[#521322] rounded-[4px] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadSuccess ? "Downloaded Successfully!" : "Download Desktop Shortcut"}</span>
              </button>
            </div>

            {/* MOBILE INSTRUCTIONS */}
            <div className="border border-[#E8E3E1] bg-[#FFFCF7] p-3 rounded-[4px] text-[11px] font-mono space-y-1.5 text-[#5F5A5C]">
              <div className="flex items-center gap-2 text-[#1D1A1B] font-bold">
                <Smartphone className="w-3.5 h-3.5 text-[#6B1B2E]" />
                <span>Mobile (Android / iPhone):</span>
              </div>
              <p>On Chrome: Tap menu (⋮) → <strong className="text-[#1D1A1B]">&quot;Install App&quot;</strong></p>
              <p>On Safari: Tap Share (⎋) → <strong className="text-[#1D1A1B]">&quot;Add to Home Screen&quot;</strong></p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowPwaModal(false)}
                className="px-4 py-2 border border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-[4px] text-xs font-medium transition-colors cursor-pointer"
              >
                Close
              </button>
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={() => {
                    handleInstallClick();
                    setShowPwaModal(false);
                  }}
                  className="px-4 py-2 bg-[#1D1A1B] text-[#FFFCF7] hover:bg-[#333] rounded-[4px] text-xs font-medium transition-colors cursor-pointer"
                >
                  Native Browser Install
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
