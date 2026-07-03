import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function DashboardLayout({ children }) {

  const location = useLocation();

  const navigate = useNavigate();

  const user = JSON.parse(
  localStorage.getItem("user")
);

const role = user?.role;  

  // LOGOUT FUNCTION
  const handleLogout = () => {

    // REMOVE SAVED DATA
    localStorage.removeItem("token");

    localStorage.removeItem("user");


    // REDIRECT TO LANDING PAGE
    navigate("/");

  };

  return (

    <div className="flex min-h-screen bg-gray-100 transition-all duration-300">

      {/* SIDEBAR */}
     <div
  className="
    fixed
    top-0
    left-0
    h-screen
    w-[220px]
    bg-[#8B0000]
    text-white
    flex
    flex-col
    justify-between
  "
>

        <div>

          {/* LOGO */}
          <div className="p-6 text-3xl font-bold">

            ZPPSU

          </div>

          {/* NAVIGATION */}
          <nav className="mt-6 flex flex-col gap-2 px-4">

            <Link
              to="/dashboard"
              className={`text-lg py-2 px-4 rounded-xl transition ${
                location.pathname === "/dashboard"
                  ? "bg-white text-[#8B0000]"
                  : "hover:bg-red-900"
              }`}
            >

              Dashboard

            </Link>

            <Link
              to="/files"
              className={`text-lg py-2 px-4 rounded-xl transition ${
                location.pathname === "/files"
                  ? "bg-white text-[#8B0000]"
                  : "hover:bg-red-900"
              }`}
            >

              Files

            </Link>

            <Link
              to="/document-center"
              className={`text-lg py-2 px-4 rounded-xl transition ${
                location.pathname ===
                "/document-center"

                  ? "bg-white text-[#8B0000]"

                  : "hover:bg-red-900"
              }`}
            >

              Document Center

            </Link>

            {role === "Admin" && (

              <Link
                to="/categories"
                className={`text-lg py-2 px-4 rounded-xl transition ${
                  location.pathname === "/categories"
                    ? "bg-white text-[#8B0000]"
                    : "hover:bg-red-900"
                }`}
              >

                Categories

              </Link>

            )}

            { <Link
              to="/inventory"
              className={`text-lg py-2 px-4 rounded-xl transition ${
                location.pathname === "/inventory"
                  ? "bg-white text-[#8B0000]"
                  : "hover:bg-red-900"
              }`}
            >

              Inventory

            </Link>}

            {role === "Admin" && (

              <Link
                to="/users"
                className={`text-lg py-2 px-4 rounded-xl transition ${
                  location.pathname === "/users"
                    ? "bg-white text-[#8B0000]"
                    : "hover:bg-red-900"
                }`}
              >

                Users

              </Link>

            )}
            {role === "Admin" && (

            <Link
              to="/logs"
              className={`text-lg py-2 px-4 rounded-xl transition ${
                location.pathname === "/logs"
                  ? "bg-white text-[#8B0000]"
                  : "hover:bg-red-900"
              }`}
            >

              Activity Logs

            </Link>
          )}

          {role === "Admin" && (

        <Link
          to="/accomplishment-report"
          className={`text-lg py-2 px-4 rounded-xl transition ${
            location.pathname === "/accomplishment-report"
              ? "bg-white text-[#8B0000]"
              : "hover:bg-red-900"
          }`}
        >

          Accomplishment Report

        </Link>

)}
          </nav>

        </div>

        {/* LOGOUT */}
        <div className="p-4">

          <button
            onClick={handleLogout}
            className="w-full bg-white text-[#8B0000] text-lg font-bold py-3 rounded-2xl hover:bg-gray-200 transition"
          >

            Logout

          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-[220px]">

        {/* TOPBAR */}
        <div className="flex items-center justify-between bg-white shadow-md px-6 py-4">

          <h1 className="text-3xl font-bold text-black">

            

          </h1>

          <div className="flex items-center gap-4">

            <h2 className="text-xl font-semibold text-black">

            Welcome {user?.name}

          </h2>
          </div>

        </div>

        {/* PAGE CONTENT */}
        <div className="p-6">

          {children}

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;