import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-[#8B0000] shadow-md px-10 py-5 flex justify-between items-center z-50">
      
      {/* LOGO / TITLE */}
      <h1 className="text-3xl font-bold text-white">
        ZPPSU Guidance
      </h1>

      {/* NAVIGATION */}
      <div className="flex gap-10 text-lg font-medium text-white">
        
        <Link
          to="home"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-gray-300 transition"
        >
          Home
        </Link>

        <Link
          to="about"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-gray-300 transition"
        >
          About
        </Link>

        <Link
          to="contact"
          smooth={true}
          duration={500}
          className="cursor-pointer hover:text-gray-300 transition"
        >
          Contact
        </Link>

        <button
          onClick={() => navigate("/login")}
          className="hover:text-gray-300 transition"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;