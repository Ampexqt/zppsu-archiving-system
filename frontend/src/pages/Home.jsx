import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, ShieldCheck, Database, Search, FileText, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F2937] font-sans selection:bg-[#FFD700] selection:text-[#800000] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden flex flex-col justify-center items-center text-center px-4"
      >
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-[#800000]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        {/* Institutional Trust Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#800000]/20 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-[#800000] mb-6 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#800000]" />
          <span>Official Institutional Archiving Portal</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#800000] tracking-tight mb-4 max-w-4xl leading-[1.15]">
          Digital Archiving System <br />
          <span className="text-[#1F2937] font-bold text-3xl sm:text-4xl md:text-5xl block mt-2">
            ZPPSU Guidance Office
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed font-normal">
          A secure, high-performance platform engineered for seamless student records management, instant retrieval, and strict institutional compliance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto items-center">
          <Button 
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-7 py-6 rounded-xl bg-[#800000] text-white hover:bg-[#660000] shadow-sm hover:shadow-md text-base font-semibold transition-all group"
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
            className="w-full sm:w-auto px-7 py-6 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-base font-semibold transition-all shadow-xs"
          >
            <span>Explore Capabilities</span>
          </Button>
        </div>
        
        {/* System Overview Visual Box */}
        <div className="mt-14 w-full max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000] mb-3">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Central Repository</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Organized storage across academic, administrative, and financial classifications.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000] mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Instant Retrieval</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Search through thousands of student records with rapid keyword indexing.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FDFBF7] border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-[#800000]/10 flex items-center justify-center text-[#800000] mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Role-Based Access</h3>
              <p className="text-xs text-gray-600 leading-relaxed">Strict authorization controls ensuring confidentiality of student documents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section id="features" className="py-20 bg-white border-y border-gray-200/80 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-[#800000] uppercase mb-2">Core Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Engineered for Daily Institutional Workflows</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 p-8 rounded-2xl border border-gray-200 bg-[#FDFBF7] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center mb-6 text-[#800000] shadow-xs">
                  <Database className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-gray-900">Unified Document Center</h4>
                <p className="text-gray-600 leading-relaxed text-sm max-w-lg">
                  Securely store, organize, and manage thousands of student guidance records in one unified digital vault, categorized by cabinets and file boxes.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-[#800000] gap-1 group-hover:gap-2 transition-all">
                <span>Learn more about document workflows</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-gray-200 flex items-center justify-center mb-6 text-[#800000]">
                  <Search className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">High-Speed Querying</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Locate any record in seconds using archive number, document type, academic year, and category filters.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-gray-200 bg-white shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FDFBF7] border border-gray-200 flex items-center justify-center mb-6 text-[#800000]">
                  <Lock className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">Compliant Security</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Role-based permissions and comprehensive activity logs provide an audit trail of every access and modification.
                </p>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 p-8 rounded-2xl border border-[#800000] bg-[#800000] text-white shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-[#FFD700]">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Automated Reports & Physical Inventory</h4>
                <p className="text-white/80 leading-relaxed text-sm max-w-lg">
                  Generate official accomplishment reports, print-ready document summaries, and synchronize physical cabinet storage without manual duplicate entry.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-semibold text-[#FFD700] gap-1">
                <span>Integrated with physical cabinet tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-20 flex flex-col items-center px-6 bg-[#FDFBF7]"
      >
        <div className="max-w-3xl text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xs border-2 border-white bg-white">
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Empowering the Guidance Office
          </h2>
          <div className="w-16 h-1 bg-[#800000] mx-auto mb-6 rounded-full"></div>
          <p className="text-base leading-relaxed text-gray-600 font-normal">
            Designed exclusively for the <strong className="text-gray-900 font-semibold">Zamboanga Peninsula Polytechnic State University</strong>, this archiving system streamlines document retention, simplifies physical cabinet indexing, and safeguards sensitive student guidance records.
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