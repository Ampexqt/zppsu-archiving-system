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
  X
} from "lucide-react";
import logo from "../../assets/logo.jpg";
import { useState } from "react";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;  

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

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] transition-all duration-300 font-sans selection:bg-[#FFD700] selection:text-[#800000]">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-[100dvh] bg-[#800000] text-white flex flex-col justify-between z-50 transition-transform duration-300 shadow-2xl lg:shadow-none lg:transition-all
          ${isCollapsed ? "lg:w-[80px]" : "w-[280px] lg:w-[260px]"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-4 top-8 z-50 w-8 h-8 bg-[#FFD700] border-2 border-[#800000] rounded-full items-center justify-center text-[#800000] hover:bg-yellow-400 shadow-md cursor-pointer transition-transform hover:scale-110"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 ml-0.5" /> : <ChevronLeft className="w-5 h-5 mr-0.5" />}
        </button>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
          {/* LOGO */}
          <div className={`p-6 flex items-center justify-between border-b border-white/10 relative ${isCollapsed ? "lg:justify-center lg:px-0" : "gap-3"}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? "lg:hidden" : ""}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white shrink-0">
                <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
              </div>
              <div className="whitespace-nowrap transition-opacity duration-300">
                <h2 className="text-xl font-extrabold tracking-tight">ZPPSU</h2>
                <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Guidance Office</p>
              </div>
            </div>
            {/* Desktop collapsed icon */}
            {isCollapsed && (
              <div className="hidden lg:flex w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-white shrink-0 mx-auto">
                <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
              </div>
            )}
            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1 hover:bg-white/10 rounded-md transition-colors text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="mt-6 flex flex-col gap-1.5 px-3">
            {!isCollapsed && (
              <p className="px-4 text-xs font-bold uppercase tracking-wider text-white/50 mb-2 whitespace-nowrap">Main Menu</p>
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
                  className={`flex items-center gap-3 text-sm py-3 px-3 rounded-xl font-medium transition-all duration-200 ${
                    isCollapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-white text-[#800000] shadow-md shadow-black/10 scale-[1.02]"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-[#800000]" : "text-white/70"}`} />
                  <span className={`whitespace-nowrap ${isCollapsed ? "lg:hidden" : ""}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* USER PROFILE & LOGOUT */}
        <div className="relative z-10 p-4 border-t border-white/10">
          <div className={`flex items-center gap-3 mb-4 px-2 ${isCollapsed ? "lg:hidden" : ""}`}>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">{user?.name}</span>
              <span className="text-xs text-white/70">{role}</span>
            </div>
          </div>
          {isCollapsed && (
            <div className="hidden lg:flex justify-center mb-4">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm shrink-0" title={user?.name}>
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : ""}
            className={`w-full flex items-center justify-center gap-2 bg-white/10 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#660000] transition-colors border border-white/20 ${isCollapsed ? "px-0" : ""}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`${isCollapsed ? "lg:hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${isCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"}`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight hidden sm:block">
              {navItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-900 leading-none">Welcome back,</span>
              <span className="text-xs text-gray-500">{user?.name}</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 bg-gray-50 flex items-center justify-center font-bold text-[#800000] shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
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