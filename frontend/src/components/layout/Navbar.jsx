import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#FFFCF7]/95 backdrop-blur-sm border-b border-[#E8E3E1] px-6 lg:px-12 py-4 flex justify-between items-center z-50">
      
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
      <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-medium text-[#5F5A5C]">
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
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/login")}
          className="text-xs uppercase tracking-wider font-medium text-[#1D1A1B] hover:text-[#6B1B2E] border border-[#E8E3E1] hover:border-[#6B1B2E] px-3.5 py-1.5 rounded-[4px] transition-colors"
        >
          Staff Sign In
        </button>

        {/* MOBILE TOGGLE */}
        <button
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
        </div>
      )}
    </nav>
  );
}

export default Navbar;
