import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.jpg";
import { Lock, Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#FFFCF7]/95 backdrop-blur-md shadow-xs border-b border-[#E8E3E1] px-4 sm:px-8 py-3 flex justify-between items-center z-50 transition-all duration-300">
      
      {/* BRAND & INSTITUTIONAL CREST */}
      <div className="flex items-center gap-3.5">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden border border-[#E8E3E1] shadow-xs flex-shrink-0 cursor-pointer hover:scale-105 transition-transform bg-[#FFFCF7]" 
          onClick={() => navigate("/")}
          title="ZPPSU Guidance Archival Portal"
        >
          <img src={logo} alt="ZPPSU Seal" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center cursor-pointer" onClick={() => navigate("/")}>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold text-[#1D1A1B] tracking-tight leading-none">
              ZPPSU Guidance
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold bg-[#F4E7EA] text-[#6B1D2A] px-1.5 py-0.5 rounded border border-[#6B1D2A]/15">
              OGCS
            </span>
          </div>
          <span className="text-[#5F5A5C] text-[10px] uppercase tracking-wider font-semibold mt-0.5">
            Archival &amp; Records Management System
          </span>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#5F5A5C]">
        <Link
          to="home"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Overview
        </Link>
        <Link
          to="features"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Capabilities
        </Link>
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Mandate
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Directory
        </Link>
      </div>

      {/* HEADER UTILITY ACTIONS - ELIMINATING REDUNDANCY WITH HERO */}
      <div className="flex items-center gap-3">
        {/* Subtle Live Vault Health Chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F4E7EA]/60 border border-[#6B1D2A]/15 text-[11px] font-mono text-[#6B1D2A]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold tracking-wider">VAULT SECURED</span>
        </div>

        {/* Refined Staff Sign In (Utility Role, avoiding loud duplicate hero button) */}
        <Button 
          variant="outline"
          onClick={() => navigate("/login")}
          className="border border-[#6B1D2A]/30 bg-[#FFFCF7] text-[#6B1D2A] hover:bg-[#6B1D2A] hover:text-[#FFFCF7] font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs uppercase tracking-wider shadow-xs"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Staff Sign In</span>
        </Button>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-[#5F5A5C] hover:bg-[#F4E7EA] hover:text-[#1D1A1B] rounded-lg transition-colors"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileNavOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#FFFCF7] border-b border-[#E8E3E1] p-4 shadow-lg flex flex-col gap-3 font-semibold text-[#1D1A1B]">
          <Link
            to="home"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-[#F4E7EA] hover:text-[#6B1D2A] transition-colors"
          >
            Overview
          </Link>
          <Link
            to="features"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-[#F4E7EA] hover:text-[#6B1D2A] transition-colors"
          >
            Capabilities
          </Link>
          <Link
            to="about"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-[#F4E7EA] hover:text-[#6B1D2A] transition-colors"
          >
            Mandate
          </Link>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-[#F4E7EA] hover:text-[#6B1D2A] transition-colors"
          >
            Directory
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
