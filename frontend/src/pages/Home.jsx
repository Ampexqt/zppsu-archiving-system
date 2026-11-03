import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, ShieldCheck, Database, Search, FileText, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import heroImage from "../assets/image.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#1D1A1B] font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center"
      >
        {/* Subtle Background Ambience */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-[#6B1D2A]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#E8E3E1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Authority & Navigation */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Institutional Sub-Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6B1D2A]/15 bg-[#F4E7EA]/70 px-3.5 py-1.5 text-xs font-semibold text-[#6B1D2A] mb-5 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#6B1D2A] animate-pulse" />
              <span className="tracking-wide uppercase">ZPPSU Guidance &amp; Counseling Office</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-extrabold text-[#1D1A1B] tracking-tight leading-[1.14] mb-5">
              Digital Archival &amp; <br />
              <span className="text-[#6B1D2A]">Records Governance</span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-base sm:text-lg text-[#5F5A5C] max-w-xl mb-8 leading-relaxed font-normal">
              The official institutional repository for student guidance records, accomplishment dossiers, and physical cabinet inventory at ZPPSU. Engineered for rapid indexing and certified compliance with National Archives (RA 9470) standards.
            </p>

            {/* Primary Calls to Action */}
            <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto items-stretch sm:items-center mb-10">
              <Button
                onClick={() => navigate("/login")}
                className="px-7 py-6 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] shadow-sm hover:shadow-md text-base font-semibold transition-all group flex items-center justify-center gap-2.5"
              >
                <span>Access Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-7 py-6 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] text-base font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#6B1D2A]" />
                <span>Explore Capabilities</span>
              </Button>
            </div>

            {/* Institutional Compliance Standards Bar */}
            <div className="pt-6 border-t border-[#E8E3E1] w-full grid grid-cols-3 gap-3 sm:gap-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#6B1D2A]">RA 9470</div>
                <div className="text-xs text-[#5F5A5C] mt-0.5 font-medium">National Archives Compliant</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#6B1D2A]">ISO 9001:2015</div>
                <div className="text-xs text-[#5F5A5C] mt-0.5 font-medium">Quality Management Standard</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#6B1D2A]">Dual Custody</div>
                <div className="text-xs text-[#5F5A5C] mt-0.5 font-medium">Physical &amp; Digital Indexing</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Realistic Photographic Archival Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-lg lg:max-w-none">
              {/* Archival Museum Frame */}
              <div className="relative rounded-2xl p-2 sm:p-2.5 bg-[#FFFCF7] border border-[#E8E3E1] shadow-xl group transition-all duration-300 hover:shadow-2xl hover:border-[#6B1D2A]/20">
                <div className="relative rounded-xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] bg-[#F4E7EA]">
                  <img
                    src={heroImage}
                    alt="ZPPSU Guidance Office Archival Facility and Dossier Management Desk"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  />

                  {/* Top Status Tag */}
                  <div className="absolute top-3.5 right-3.5 bg-[#1D1A1B]/80 backdrop-blur-md text-[#FFFCF7] border border-white/20 rounded-lg px-2.5 py-1 text-[11px] font-mono tracking-wider flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ACTIVE VAULT</span>
                  </div>
                </div>
              </div>

              {/* Floating Verified Physical Records Badge */}
              <div className="mt-3.5 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-5 bg-[#FFFCF7] border border-[#E8E3E1] rounded-xl p-3 sm:p-3.5 shadow-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F4E7EA] flex items-center justify-center text-[#6B1D2A] border border-[#6B1D2A]/15 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-[#1D1A1B]">Verified Archival Records</div>
                  <div className="text-[11px] text-[#5F5A5C] font-medium">Cabinet, Box &amp; Folder Synchronized</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section id="features" className="py-20 bg-[#FFFCF7] border-y border-[#E8E3E1] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-[#6B1D2A] uppercase mb-2">Core Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A1B] tracking-tight">Engineered for Daily Institutional Workflows</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 p-8 rounded-2xl border border-[#E8E3E1] bg-[#FFFCF7] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center mb-6 text-[#6B1D2A] shadow-xs">
                  <Database className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-[#1D1A1B]">Unified Document Center</h4>
                <p className="text-[#5F5A5C] leading-relaxed text-sm max-w-lg">
                  Securely store, organize, and manage thousands of student guidance records in one unified digital vault, categorized by cabinets and file boxes.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-[#6B1D2A] gap-1 group-hover:gap-2 transition-all">
                <span>Learn more about document workflows</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-[#E8E3E1] bg-[#FFFCF7] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center mb-6 text-[#6B1D2A]">
                  <Search className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-[#1D1A1B]">High-Speed Querying</h4>
                <p className="text-[#5F5A5C] leading-relaxed text-sm">
                  Locate any record in seconds using archive number, document type, academic year, and category filters.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-[#E8E3E1] bg-[#FFFCF7] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center mb-6 text-[#6B1D2A]">
                  <Lock className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-[#1D1A1B]">Compliant Security</h4>
                <p className="text-[#5F5A5C] leading-relaxed text-sm">
                  Role-based permissions and comprehensive activity logs provide an audit trail of every access and modification.
                </p>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 p-8 rounded-2xl border border-[#4A0E1C] bg-[#4A0E1C] text-[#FFFCF7] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-[#C99A2E]">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-[#FFFCF7]">Automated Reports & Physical Inventory</h4>
                <p className="text-white/80 leading-relaxed text-sm max-w-lg">
                  Generate official accomplishment reports, print-ready document summaries, and synchronize physical cabinet storage without manual duplicate entry.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-[#F2DFB0] gap-1">
                <span>Integrated with physical cabinet tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-20 flex flex-col items-center px-6 bg-[#FFFCF7]"
      >
        <div className="max-w-3xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xs border border-[#E8E3E1] bg-[#FFFCF7]">
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1D1A1B] mb-4 tracking-tight">
            Empowering the Guidance Office
          </h2>
          <div className="w-16 h-1 bg-[#6B1D2A] mx-auto mb-6 rounded-full"></div>
          <p className="text-base leading-relaxed text-[#5F5A5C] font-normal">
            Designed exclusively for the <strong className="text-[#1D1A1B] font-semibold">Zamboanga Peninsula Polytechnic State University</strong>, this archiving system streamlines document retention, simplifies physical cabinet indexing, and safeguards sensitive student guidance records.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
