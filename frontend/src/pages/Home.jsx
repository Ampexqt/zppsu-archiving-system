import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Database, Search, FileText, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import heroImage from "../assets/image.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#1D1A1B] font-sans selection:bg-[#6B1B2E] selection:text-[#FFFCF7] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION: Balanced Swiss / Institutional Minimalist Editorial */}
      <section
        id="home"
        className="relative pt-24 pb-14 sm:pt-28 sm:pb-16 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center border-b border-[#E8E3E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: 6 Columns - Balanced Typography & Direct Action */}
          <div className="lg:col-span-6 flex flex-col items-start text-left w-full">
            
            {/* Small uppercase mono label */}
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[#5F5A5C] mb-4 sm:mb-5">
              ZPPSU Guidance &amp; Counseling Office · Archival Repository
            </p>

            {/* Editorial Headline: Clean responsive breaks, single near-black color */}
            <h1 className="font-['Newsreader',Georgia,serif] text-[30px] sm:text-4xl lg:text-[46px] xl:text-[52px] font-normal tracking-tight text-[#1D1A1B] leading-[1.12] mb-4 sm:mb-5">
              Institutional records and <br className="hidden sm:inline" />
              physical archives, unified.
            </h1>

            {/* System-accurate narrative directly derived from /docs */}
            <p className="text-sm sm:text-base text-[#5F5A5C] max-w-lg mb-6 sm:mb-8 leading-relaxed font-normal">
              A central repository linking physical storage cabinets and file boxes to digital documents. Search, manage, and preserve academic records, accomplishment reports, and guidance files with complete audit accountability.
            </p>

            {/* Action Components: One solid maroon button (4px corners, no arrow) + one plain text link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 mb-6 sm:mb-8 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto bg-[#6B1B2E] text-[#FFFCF7] hover:bg-[#521322] px-6 py-3.5 rounded-[4px] text-sm font-medium tracking-wide transition-colors cursor-pointer text-center"
              >
                Access the Archive
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-center sm:text-left text-sm font-medium text-[#1D1A1B] hover:text-[#6B1B2E] underline underline-offset-4 py-1 transition-colors cursor-pointer"
              >
                Explore system capabilities
              </button>
            </div>

            {/* Concrete Facts Line */}
            <div className="pt-5 sm:pt-6 border-t border-[#E8E3E1] w-full text-[11px] sm:text-xs font-mono text-[#5F5A5C] leading-relaxed tracking-wide">
              Role-based access · Cabinet-to-file indexing · Audit log tracking · Document center
            </div>

          </div>

          {/* RIGHT COLUMN: 6 Columns - Optically Balanced Full Photographic Anchor */}
          <div className="lg:col-span-6 w-full flex flex-col items-center mt-4 lg:mt-0">
            <div className="w-full border border-[#E8E3E1] p-1.5 sm:p-2 bg-[#FFFCF7] rounded-[4px]">
              <img
                src={heroImage}
                alt="ZPPSU Guidance & Counseling Office Building and Records Archive"
                className="w-full h-auto block rounded-[2px]"
              />
              <div className="pt-2 px-1 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#5F5A5C] border-t border-[#E8E3E1] mt-1.5 gap-1">
                <span>ZPPSU Guidance Office · Main Campus</span>
                <span>Physical &amp; Digital Vault</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section id="features" className="py-20 bg-[#FFFCF7] border-b border-[#E8E3E1] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold tracking-widest text-[#6B1B2E] uppercase mb-2">Core Capabilities</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1D1A1B] tracking-tight">Engineered for Daily Institutional Workflows</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 p-8 border border-[#E8E3E1] bg-[#FFFCF7] flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center mb-6 text-[#6B1B2E]">
                  <Database className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-[#1D1A1B]">Unified Document Center</h4>
                <p className="text-[#5F5A5C] leading-relaxed text-sm max-w-lg">
                  Securely store, organize, and manage institutional guidance records in one unified digital vault, categorized by cabinets and file boxes.
                </p>
              </div>
              <div className="mt-6 flex items-center text-xs font-bold text-[#6B1B2E] gap-1 group-hover:gap-2 transition-all">
                <span>Learn more about document workflows</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-[#E8E3E1] bg-[#FFFCF7] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center mb-6 text-[#6B1B2E]">
                  <Search className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-[#1D1A1B]">High-Speed Querying</h4>
                <p className="text-[#5F5A5C] leading-relaxed text-sm">
                  Locate any record in seconds using archive number, document type, academic year, and category filters.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-[#E8E3E1] bg-[#FFFCF7] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center mb-6 text-[#6B1B2E]">
                  <Lock className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-[#1D1A1B]">Compliant Security</h4>
                <p className="text-[#5F5A5C] leading-relaxed text-sm">
                  Role-based permissions and comprehensive activity logs provide an immutable audit trail of every document access and modification.
                </p>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 p-8 border border-[#4A0E1C] bg-[#4A0E1C] text-[#FFFCF7] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-white/10 border border-white/20 flex items-center justify-center mb-6 text-[#C99A2E]">
                  <FileText className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-[#FFFCF7]">Automated Reports &amp; Physical Inventory</h4>
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
          <div className="w-16 h-16 mx-auto mb-6 overflow-hidden border border-[#E8E3E1] bg-[#FFFCF7]">
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-extrabold text-[#1D1A1B] mb-4 tracking-tight">
            Empowering the Guidance Office
          </h2>
          <div className="w-12 h-0.5 bg-[#6B1B2E] mx-auto mb-6" />
          <p className="text-base leading-relaxed text-[#5F5A5C] font-normal">
            Designed exclusively for the <strong className="text-[#1D1A1B] font-semibold">Zamboanga Peninsula Polytechnic State University</strong>, this archiving system streamlines document retention, simplifies physical cabinet indexing, and safeguards sensitive institutional and guidance records.
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
