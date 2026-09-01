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
  FileBarChart,
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
import { useModal } from "../../context/ModalContext";

function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isAdmin = user?.role === "Admin";
  const displayRole = isAdmin ? "Admin" : "Staff";

  const modal = useModal();

  const handleLogout = async () => {
    const isConfirmed = await modal.confirm({
      title: "Logout Confirmation",
      message: "Are you sure you want to log out of the system?",
      variant: "primary",
      confirmText: "Log Out",
      cancelText: "Cancel"
    });

    if (isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Files", path: "/files", icon: FolderSearch },
    { name: "Document Center", path: "/document-center", icon: Archive },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Inventory", path: "/inventory", icon: Box },
    ...(isAdmin ? [
      { name: "Users", path: "/users", icon: Users },
      { name: "Audits & Trails", path: "/logs", icon: Activity },
      { name: "Masterlist Reports", path: "/masterlist-reports", icon: FileBarChart },
    ] : []),
  ];

  const currentTitle = navItems.find((item) => item.path === location.pathname)?.name || "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#FFFCF7] text-[#1D1A1B] transition-all duration-300 font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C]">
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#1D1A1B]/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        aria-label="Sidebar Navigation"
        className={`
          fixed top-0 left-0 h-[100dvh] bg-[#4A0E1C] text-[#FFFCF7] flex flex-col justify-between z-50 transition-all duration-300 shadow-2xl lg:shadow-none
          ${isCollapsed ? "lg:w-[80px]" : "w-[280px] lg:w-[260px]"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* COLLAPSE TOGGLE BUTTON (DESKTOP) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-3.5 top-7 z-50 w-7 h-7 bg-[#C99A2E] border-2 border-[#4A0E1C] rounded-full items-center justify-center text-[#1D1A1B] hover:bg-[#A87818] hover:text-white shadow-md cursor-pointer transition-transform hover:scale-110 active:scale-95"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4 ml-0.5" /> : <ChevronLeft className="w-4 h-4 mr-0.5" />}
        </button>

        {/* SIDEBAR HEADER / BRAND */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
          <div className={`p-5 flex items-center justify-between border-b border-white/10 ${isCollapsed ? "lg:justify-center lg:px-2" : "gap-3"}`}>
            <div className={`flex items-center gap-3 cursor-pointer ${isCollapsed ? "lg:hidden" : ""}`} onClick={() => navigate("/dashboard")}>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-[#FFFCF7] shrink-0 shadow-sm">
                <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
              </div>
              <div className="whitespace-nowrap overflow-hidden">
                <h2 className="text-lg font-bold tracking-tight text-[#FFFCF7] leading-tight">ZPPSU</h2>
                <p className="text-[10px] text-[#F2DFB0] uppercase tracking-widest font-semibold">Guidance Office</p>
              </div>
            </div>

            {/* Desktop collapsed icon */}
            {isCollapsed && (
              <div 
                className="hidden lg:flex w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-[#FFFCF7] shrink-0 mx-auto cursor-pointer shadow-sm"
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
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#F2DFB0]/70 mb-1">
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
                      ? "bg-[#FFFCF7] text-[#4A0E1C] shadow-sm font-bold"
                      : "text-white/80 hover:bg-[#6B1D2A] hover:text-[#FFFCF7]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 stroke-[2] ${isActive ? "text-[#4A0E1C]" : "text-white/80"}`} />
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
            className={`w-full flex items-center justify-center gap-2 bg-white/10 text-[#FFFCF7] text-xs font-semibold py-2.5 rounded-xl hover:bg-[#6B1D2A] transition-all border border-white/10 ${isCollapsed ? "px-0" : "px-3"}`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className={`${isCollapsed ? "lg:hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${isCollapsed ? "lg:ml-[80px]" : "lg:ml-[260px]"}`}>
        {/* TOPBAR */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#FFFCF7]/95 backdrop-blur-md border-b border-[#E8E3E1] px-6 py-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-[#5F5A5C] hover:bg-[#F4E7EA] hover:text-[#1D1A1B] rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#1D1A1B] tracking-tight leading-none">
                {currentTitle}
              </h1>
              <p className="text-xs text-[#5F5A5C] mt-0.5 hidden sm:block">
                ZPPSU Guidance Records Management System
              </p>
            </div>
          </div>
          
          {/* USER PROFILE INFO CHIP */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFCF7] border border-[#E8E3E1] text-xs font-medium text-[#1D1A1B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#6B1D2A]" />
              <span className="font-semibold text-[#1D1A1B]">{user?.name || "User"}</span>
              <span className="text-[#E8E3E1]">|</span>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                {displayRole}
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