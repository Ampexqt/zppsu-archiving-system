import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, ShieldCheck, Database, Search, FileText, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#1D1A1B] font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden flex flex-col justify-center items-center text-center px-4"
      >
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#6B1D2A]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#E8E3E1_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        {/* Institutional Trust Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#6B1D2A]/20 bg-[#FFFCF7]/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-[#6B1D2A] mb-6 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#6B1D2A]" />
          <span>Official Institutional Archiving Portal</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#6B1D2A] tracking-tight mb-4 max-w-4xl leading-[1.15]">
          Digital Archiving System <br />
          <span className="text-[#1D1A1B] font-bold text-3xl sm:text-4xl md:text-5xl block mt-2">
            ZPPSU Guidance Office
          </span>
        </h1>

        <p className="text-base sm:text-lg text-[#5F5A5C] max-w-2xl mb-8 leading-relaxed font-normal">
          A secure, high-performance platform engineered for seamless student records management, instant retrieval, and strict institutional compliance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto items-center">
          <Button 
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-7 py-6 rounded-xl bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] shadow-sm hover:shadow-md text-base font-semibold transition-all group"
          >
            <span>Access Portal</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              const el = document.getElementById("features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-7 py-6 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1] text-[#1D1A1B] hover:bg-[#F4E7EA] text-base font-semibold transition-all shadow-xs"
          >
            <span>Explore Capabilities</span>
          </Button>
        </div>
        
        {/* System Overview Visual Box */}
        <div className="mt-14 w-full max-w-4xl mx-auto rounded-2xl border border-[#E8E3E1] bg-[#FFFCF7] p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1]">
              <div className="w-10 h-10 rounded-lg bg-[#F4E7EA] flex items-center justify-center text-[#6B1D2A] mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1D1A1B] text-base mb-1">Central Repository</h3>
              <p className="text-xs text-[#5F5A5C] leading-relaxed">Organized storage across academic, administrative, and financial classifications.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1]">
              <div className="w-10 h-10 rounded-lg bg-[#F4E7EA] flex items-center justify-center text-[#6B1D2A] mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1D1A1B] text-base mb-1">Instant Retrieval</h3>
              <p className="text-xs text-[#5F5A5C] leading-relaxed">Search through thousands of student records with rapid keyword indexing.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFCF7] border border-[#E8E3E1]">
              <div className="w-10 h-10 rounded-lg bg-[#F4E7EA] flex items-center justify-center text-[#6B1D2A] mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#1D1A1B] text-base mb-1">Role-Based Access</h3>
              <p className="text-xs text-[#5F5A5C] leading-relaxed">Strict authorization controls ensuring confidentiality of student documents.</p>
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