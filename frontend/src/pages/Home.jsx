import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, Database, Search, FileText, Lock, ChevronRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import heroImage from "../assets/image.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#1D1A1B] font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION - Minimalist & Modern Split Layout */}
      <section
        id="home"
        className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Clean Typography & Direct Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            
            {/* Minimalist Office Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4E7EA] border border-[#6B1D2A]/10 text-[#6B1D2A] text-xs font-semibold tracking-wide mb-6">
              <span>ZPPSU Guidance &amp; Counseling Office</span>
            </div>

            {/* Modern, Bold Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1D1A1B] leading-[1.12] mb-6">
              Records management, <br />
              <span className="text-[#6B1D2A]">simplified.</span>
            </h1>

            {/* Clean, Readable Narrative */}
            <p className="text-base sm:text-lg text-[#5F5A5C] max-w-lg mb-8 leading-relaxed font-normal">
              A centralized digital archive built for the ZPPSU Guidance Office to organize student guidance records, physical cabinet indexing, and institutional reports with speed and security.
            </p>

            {/* Clear Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-10">
              <Button
                onClick={() => navigate("/login")}
                className="px-6 py-6 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Access Archive</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-6 py-6 rounded-xl bg-transparent border border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] text-sm font-semibold transition-all shadow-xs flex items-center justify-center"
              >
                <span>Explore Capabilities</span>
              </Button>
            </div>

            {/* Understated Institutional Footnote */}
            <div className="pt-6 border-t border-[#E8E3E1] w-full flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#5F5A5C]">
              <div>
                <span className="font-semibold text-[#1D1A1B] block">NAP RA 9470</span>
                <span className="text-[11px] text-[#5F5A5C]">Compliant Archival Flow</span>
              </div>
              <div className="w-px h-6 bg-[#E8E3E1] hidden sm:block" />
              <div>
                <span className="font-semibold text-[#1D1A1B] block">Cabinet Tracking</span>
                <span className="text-[11px] text-[#5F5A5C]">Physical-to-Digital Sync</span>
              </div>
              <div className="w-px h-6 bg-[#E8E3E1] hidden sm:block" />
              <div>
                <span className="font-semibold text-[#1D1A1B] block">Confidentiality</span>
                <span className="text-[11px] text-[#5F5A5C]">Role-Based Protection</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Pure, Beautiful Framed Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Clean Framed Photograph */}
              <div className="rounded-2xl p-2 bg-[#FFFCF7] border border-[#E8E3E1] shadow-2xl shadow-black/5">
                <div className="rounded-xl overflow-hidden aspect-[16/11] bg-[#F4E7EA]">
                  <img
                    src={heroImage}
                    alt="ZPPSU Guidance & Counseling Office"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* Minimal Overlapping Status Card */}
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-5 bg-[#FFFCF7]/95 backdrop-blur-sm border border-[#E8E3E1] rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4E7EA] flex items-center justify-center text-[#6B1D2A] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1D1A1B]">Physical &amp; Digital Custody</p>
                  <p className="text-[11px] text-[#5F5A5C]">Cabinet A • File Box Indexing</p>
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
          <div className="w-16 h-1 bg-[#6B1D2A] mx-auto mb-6 rounded-full" />
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
