import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.jpg";
import { LogIn, Menu, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#FFFCF7]/95 backdrop-blur-md shadow-xs border-b border-[#E8E3E1] px-4 sm:px-8 py-3.5 flex justify-between items-center z-50 transition-all duration-300">
      
      {/* LOGO / TITLE */}
      <div className="flex items-center gap-3.5">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden border border-[#E8E3E1] shadow-xs flex-shrink-0 cursor-pointer hover:scale-105 transition-transform bg-[#FFFCF7]" 
          onClick={() => navigate("/")}
          title="ZPPSU Home"
        >
          <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-lg md:text-xl font-extrabold text-[#1D1A1B] tracking-tight leading-none">
            ZPPSU Guidance
          </h1>
          <span className="text-[#6B1D2A] text-[10px] uppercase tracking-widest font-bold mt-1">
            Digital Archiving System
          </span>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#5F5A5C]">
        <Link
          to="home"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Home
        </Link>
        <Link
          to="features"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Features
        </Link>
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          About
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#6B1D2A] transition-colors py-1"
        >
          Contact
        </Link>
      </div>

      {/* LOGIN ACTION */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => navigate("/login")}
          className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] shadow-sm hover:shadow-md font-semibold px-5 py-2 rounded-xl transition-all flex items-center gap-2 text-sm"
        >
          <LogIn className="w-4 h-4 stroke-[2]" />
          <span>Login Portal</span>
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
            Home
          </Link>
          <Link
            to="features"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-[#F4E7EA] hover:text-[#6B1D2A] transition-colors"
          >
            Features
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