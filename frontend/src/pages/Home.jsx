import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, ShieldCheck, Database, Search, FileText, Lock, ChevronRight, Archive, CheckCircle2, Building, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";
import heroImage from "../assets/image.jpg";

function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/document-center?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/login?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryClick = (category) => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`/document-center?category=${encodeURIComponent(category)}`);
    } else {
      navigate(`/login?query=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#1D1A1B] font-sans selection:bg-[#F2DFB0] selection:text-[#4A0E1C] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION: Institutional Archival Command & Records Docket */}
      <section
        id="home"
        className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center"
      >
        {/* Subtle Background Architectural Grid */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#E8E3E1_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        {/* TOP INSTITUTIONAL PROVENANCE BAR */}
        <div className="w-full border-b border-[#E8E3E1] pb-3 mb-8 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-[#5F5A5C]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-[#6B1D2A] uppercase tracking-wider">Republic of the Philippines</span>
            <span className="text-[#E8E3E1]">/</span>
            <span className="font-medium text-[#1D1A1B]">Zamboanga Peninsula Polytechnic State University</span>
            <span className="text-[#E8E3E1]">/</span>
            <span className="text-[#A87818] font-bold">SUC Level IV • Chartered R.A. 9261</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#F4E7EA] text-[#6B1D2A] font-bold border border-[#6B1D2A]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B1D2A]" />
              NAP R.A. 9470 COMPLIANT
            </span>
            <span className="hidden sm:inline-block text-[#5F5A5C] font-semibold">
              ISO 9001:2015 STANDARDS
            </span>
          </div>
        </div>

        {/* MAIN HERO SPLIT CONSOLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT WING: Institutional Authority, Mandate, & Live Records Query */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Department Identifier */}
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B1D2A] mb-3">
              <span className="w-2.5 h-0.5 bg-[#6B1D2A]" />
              <span>Office of Guidance &amp; Counseling Services (OGCS)</span>
            </div>

            {/* Commanding Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#1D1A1B] tracking-tight leading-[1.14] mb-4">
              Institutional Archival Custody &amp; <br />
              <span className="text-[#6B1D2A]">Records Management Registry</span>
            </h1>

            {/* Narrative Subtitle */}
            <p className="text-sm sm:text-base text-[#5F5A5C] max-w-xl mb-6 leading-relaxed font-normal">
              The authorized state university repository governing confidential student guidance dossiers, official accomplishment reports, and physical cabinet synchronization under National Archives of the Philippines (RA 9470) protocols.
            </p>

            {/* INTERACTIVE ACCESSION & RECORDS QUICK-QUERY BAR (Practical Signature Feature) */}
            <div className="w-full max-w-xl bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl p-2 shadow-xs hover:border-[#6B1D2A]/30 transition-all mb-3 focus-within:ring-2 focus-within:ring-[#6B1D2A]/20 focus-within:border-[#6B1D2A]">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1 flex items-center pl-3 py-1">
                  <Search className="w-4 h-4 text-[#5F5A5C] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search accession # (e.g. DOC-2026-0063) or keyword..."
                    className="w-full pl-2.5 pr-2 py-1.5 text-xs sm:text-sm bg-transparent outline-none text-[#1D1A1B] placeholder-[#5F5A5C]/60 font-sans"
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-[#6B1D2A] text-[#FFFCF7] hover:bg-[#8B3545] text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <span>Query Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </form>
            </div>

            {/* FREQUENT ARCHIVE CLASSIFICATION CHIPS */}
            <div className="flex flex-wrap items-center gap-1.5 mb-7 text-[11px]">
              <span className="text-[#5F5A5C] font-semibold mr-1">Classifications:</span>
              {["Accomplishment Reports", "Students APEX", "CHED Communications", "Inventory Vault"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryClick(cat)}
                  className="px-2.5 py-1 rounded-lg bg-[#FFFCF7] border border-[#E8E3E1] text-[#5F5A5C] hover:border-[#6B1D2A] hover:text-[#6B1D2A] hover:bg-[#F4E7EA]/40 transition-colors font-medium cursor-pointer"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* NON-REDUNDANT ACTIONS & DIRECTORY JUMP */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-xs font-semibold">
              <Button
                variant="outline"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="border border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] hover:bg-[#F4E7EA] hover:text-[#6B1D2A] px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#6B1D2A]" />
                <span>Explore Archival Capabilities</span>
              </Button>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-[#6B1D2A] hover:text-[#4A0E1C] underline underline-offset-4 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Enter Authorized Custodian Vault</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* GROUNDED INSTITUTIONAL STANDARDS & RETENTION STRIP */}
            <div className="pt-5 border-t border-[#E8E3E1] w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border-l-2 border-[#6B1D2A] pl-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6B1D2A]">STATUTORY MANDATE</div>
                <div className="text-xs text-[#1D1A1B] font-bold mt-0.5">R.A. 9470 Compliant</div>
                <div className="text-[11px] text-[#5F5A5C]">National Archives Standards</div>
              </div>
              <div className="border-l-2 border-[#C99A2E] pl-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A87818]">QUALITY AUDIT</div>
                <div className="text-xs text-[#1D1A1B] font-bold mt-0.5">ISO 9001:2015</div>
                <div className="text-[11px] text-[#5F5A5C]">Standard Custody Workflows</div>
              </div>
              <div className="border-l-2 border-[#1D1A1B] pl-3">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5F5A5C]">DUAL CUSTODY</div>
                <div className="text-xs text-[#1D1A1B] font-bold mt-0.5">Physical &amp; Digital Sync</div>
                <div className="text-[11px] text-[#5F5A5C]">Cabinet, Box &amp; Folder Map</div>
              </div>
            </div>

          </div>

          {/* RIGHT WING: Architectural Archival Exhibit Plate & Physical Coordinates */}
          <div className="lg:col-span-5 relative flex flex-col w-full">
            <div className="relative w-full rounded-2xl bg-[#FFFCF7] border border-[#E8E3E1] shadow-xl overflow-hidden group">
              
              {/* Exhibit Header Plate */}
              <div className="bg-[#4A0E1C] px-4 py-2.5 flex items-center justify-between text-[#FFFCF7] border-b border-[#6B1D2A]">
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider">
                  <Archive className="w-3.5 h-3.5 text-[#F2DFB0]" />
                  <span className="font-semibold text-[#F2DFB0]">RECORD GROUP:</span>
                  <span className="text-white/90">ZPPSU-OGCS-2026</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/30 border border-white/20 text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE VAULT</span>
                </div>
              </div>

              {/* High-Resolution Unobstructed Photograph */}
              <div className="relative aspect-[16/11] bg-[#F4E7EA] overflow-hidden">
                <img
                  src={heroImage}
                  alt="ZPPSU Guidance & Counseling Office Building and Archival Desk"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Integrated Physical-to-Digital Indexing Plate */}
              <div className="p-4 bg-[#FFFCF7] border-t border-[#E8E3E1] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6B1D2A]" />
                    <span className="text-xs font-bold text-[#1D1A1B] tracking-tight">Verified Archival Hold</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#F2DFB0] text-[#A87818] font-bold border border-[#C99A2E]/30">
                    PERMANENT CUSTODY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F4E7EA]/40 p-2.5 rounded-xl border border-[#E8E3E1]">
                  <div>
                    <span className="text-[#5F5A5C] text-[10px] uppercase font-mono block">Vault Location:</span>
                    <span className="font-bold text-[#1D1A1B]">Cabinet A-01 • Drawer 02</span>
                  </div>
                  <div>
                    <span className="text-[#5F5A5C] text-[10px] uppercase font-mono block">Container Index:</span>
                    <span className="font-bold text-[#1D1A1B]">File Box 05 • Dossier Series</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#5F5A5C] pt-1">
                  <span>Scope: Student Counseling &amp; Reports</span>
                  <span className="font-mono text-[#6B1D2A] font-bold">OGCS Main Campus</span>
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
