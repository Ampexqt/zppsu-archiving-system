import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../../assets/logo.jpg";
import { LogIn } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100 px-6 py-3 flex justify-between items-center z-50 transition-all duration-300">
      
      {/* LOGO / TITLE */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full overflow-hidden border border-gray-100 shadow-sm flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate("/")}>
          <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1F2937] tracking-tight leading-none">
            ZPPSU Guidance
          </h1>
          <span className="text-[#800000] text-[10px] md:text-[11px] uppercase tracking-widest font-bold mt-1">
            Digital Archiving System
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
        <Link
          to="home"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors"
        >
          Home
        </Link>
        <Link
          to="about"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors"
        >
          About
        </Link>
        <Link
          to="contact"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-[#800000] transition-colors"
        >
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          onClick={() => navigate("/login")}
          className="bg-[#800000] text-white hover:bg-[#660000] shadow-md hover:shadow-lg font-semibold px-6 rounded-xl transition-all flex items-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          Login Portal
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;