import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.jpg";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#FFFCF7]/90 backdrop-blur-md border-b border-[#E8E3E1] px-4 sm:px-8 py-3.5 flex justify-between items-center z-50 transition-all">
      
      {/* BRAND */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#E8E3E1] shrink-0 bg-[#FFFCF7]">
          <img src={logo} alt="ZPPSU Seal" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#1D1A1B] tracking-tight leading-tight">
            ZPPSU Guidance
          </span>
          <span className="text-[10px] text-[#5F5A5C] uppercase tracking-wider font-medium">
            Digital Archiving System
          </span>
        </div>
      </div>

      {/* NAV LINKS */}
      <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5F5A5C]">
        <Link to="home" smooth={true} duration={500} className="cursor-pointer hover:text-[#6B1D2A] transition-colors">
          Overview
        </Link>
        <Link to="features" smooth={true} duration={500} className="cursor-pointer hover:text-[#6B1D2A] transition-colors">
          Capabilities
        </Link>
        <Link to="about" smooth={true} duration={500} className="cursor-pointer hover:text-[#6B1D2A] transition-colors">
          About
        </Link>
        <Link to="contact" smooth={true} duration={500} className="cursor-pointer hover:text-[#6B1D2A] transition-colors">
          Contact
        </Link>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        <Button 
          variant="outline"
          onClick={() => navigate("/login")}
          className="border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] hover:text-[#6B1D2A] text-xs font-semibold px-4 py-2 rounded-xl transition"
        >
          Staff Sign In
        </Button>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-[#5F5A5C] hover:text-[#1D1A1B] rounded-lg"
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
            About
          </Link>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-[#F4E7EA] hover:text-[#6B1D2A] transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
