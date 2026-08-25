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
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-xs border-b border-gray-200/80 px-4 sm:px-8 py-3.5 flex justify-between items-center z-50 transition-all duration-300">
      
      {/* LOGO / TITLE */}
      <div className="flex items-center gap-3.5">
        <div 
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-xs flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" 
          onClick={() => navigate("/")}
          title="ZPPSU Home"
        >
          <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-lg md:text-xl font-extrabold text-[#1F2937] tracking-tight leading-none">
            ZPPSU Guidance
          </h1>
          <span className="text-[#800000] text-[10px] uppercase tracking-widest font-bold mt-1">
            Digital Archiving System
          </span>
        </div>
      </div>

      {/* DESKTOP NAVIGATION */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
        <Link
          to="home"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors py-1"
        >
          Home
        </Link>
        <Link
          to="features"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors py-1"
        >
          Features
        </Link>
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors py-1"
        >
          About
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors py-1"
        >
          Contact
        </Link>
      </div>

      {/* LOGIN ACTION */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => navigate("/login")}
          className="bg-[#800000] text-white hover:bg-[#660000] shadow-sm hover:shadow-md font-semibold px-5 py-2 rounded-xl transition-all flex items-center gap-2 text-sm"
        >
          <LogIn className="w-4 h-4 stroke-[2]" />
          <span>Login Portal</span>
        </Button>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileNavOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-lg flex flex-col gap-3 font-semibold text-gray-700">
          <Link
            to="home"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-[#800000] transition-colors"
          >
            Home
          </Link>
          <Link
            to="features"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-[#800000] transition-colors"
          >
            Features
          </Link>
          <Link
            to="about"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-[#800000] transition-colors"
          >
            About
          </Link>
          <Link
            to="contact"
            smooth={true}
            duration={500}
            onClick={() => setMobileNavOpen(false)}
            className="px-3 py-2 rounded-lg hover:bg-gray-50 hover:text-[#800000] transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;