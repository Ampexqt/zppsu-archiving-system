import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderSearch, 
  Archive, 
  Tags, 
  Box, 
  Users, 
  Activity, 
  FileText, 
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  Shield,
  ShieldCheck
} from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useState } from "react";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = user?.role || "Staff";  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Files", path: "/files", icon: FolderSearch },
    { name: "Document Center", path: "/document-center", icon: Archive },
    ...(role === "Admin" ? [{ name: "Categories", path: "/categories", icon: Tags }] : []),
    { name: "Inventory", path: "/inventory", icon: Box },
    ...(role === "Admin" ? [
      { name: "Users", path: "/users", icon: Users },
      { name: "Activity Logs", path: "/logs", icon: Activity },
      { name: "Accomplishment Report", path: "/accomplishment-report", icon: FileText }
    ] : []),
  ];

  const currentTitle = navItems.find((item) => item.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] text-[#1F2937] transition-all duration-300 font-sans selection:bg-[#FFD700] selection:text-[#800000]">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        aria-label="Sidebar Navigation"
        className={`
          fixed top-0 left-0 h-[100dvh] bg-[#800000] text-white flex flex-col justify-between z-50 transition-all duration-300 shadow-2xl lg:shadow-none
          ${isCollapsed ? "lg:w-[80px]" : "w-[280px] lg:w-[260px]"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* COLLAPSE TOGGLE BUTTON (DESKTOP) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-3.5 top-7 z-50 w-7 h-7 bg-[#FFD700] border-2 border-[#800000] rounded-full items-center justify-center text-[#800000] hover:bg-yellow-400 shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 ml-0.5" /> : <ChevronLeft className="w-4 h-4 mr-0.5" />}
        </button>

        {/* SIDEBAR HEADER / BRAND */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
          <div className={`p-5 flex items-center justify-between border-b border-white/10 ${isCollapsed ? "lg:justify-center lg:px-2" : "gap-3"}`}>
            <div className={`flex items-center gap-3 cursor-pointer ${isCollapsed ? "lg:hidden" : ""}`} onClick={() => navigate("/dashboard")}>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white shrink-0 shadow-sm">
                <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
              </div>
              <div className="whitespace-nowrap overflow-hidden">
                <h2 className="text-lg font-bold tracking-tight text-white leading-tight">ZPPSU</h2>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Guidance Office</p>
              </div>
            </div>

            {/* Desktop collapsed icon */}
            {isCollapsed && (
              <div 
                className="hidden lg:flex w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white shrink-0 mx-auto cursor-pointer shadow-sm"
                onClick={() => navigate("/dashboard")}
                title="ZPPSU Guidance Office"
              >
                <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close mobile menu"
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="mt-5 flex flex-col gap-1 px-3" aria-label="Main Menu">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1">
                Main Menu
              </p>
            )}
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={isCollapsed ? item.name : ""}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 text-sm py-2.5 px-3 rounded-xl font-medium transition-all duration-200 ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-white text-[#800000] shadow-sm font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2] ${isActive ? "text-[#800000]" : "text-white/80"}`} />
                  <span className={`whitespace-nowrap truncate ${isCollapsed ? "lg:hidden" : ""}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDEBAR FOOTER / LOGOUT */}
        <div className="relative z-10 p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            aria-label="Log out of system"
            className={`w-full flex items-center justify-center gap-2 bg-white/10 text-white text-xs font-semibold py-2.5 rounded-xl hover:bg-[#660000] transition-all border border-white/10 ${isCollapsed ? "px-0" : "px-3"}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`${isCollapsed ? "lg:hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${isCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"}`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-3.5 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none">
                {currentTitle}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                ZPPSU Guidance Records Management System
              </p>
            </div>
          </div>
          
          {/* USER PROFILE INFO CHIP */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDFBF7] border border-gray-200 text-xs font-medium text-gray-700">
              <ShieldCheck className="w-3.5 h-3.5 text-[#800000]" />
              <span className="font-semibold text-gray-900">{user?.name || "User"}</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#800000]/10 text-[#800000]">
                {role}
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;