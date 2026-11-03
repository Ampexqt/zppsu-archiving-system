import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Database, Search, FileText, Lock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFCF7] text-[#1D1A1B] font-sans selection:bg-[#6B1B2E] selection:text-[#FFFCF7] scroll-smooth overflow-x-hidden flex flex-col">
      <Navbar />

      {/* HERO SECTION: Swiss / International Minimalist Editorial */}
      <section
        id="home"
        className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 px-6 lg:px-12 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center border-b border-[#E8E3E1]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Dominant Headline & Human Narrative (~7 Columns) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Small uppercase mono label (No pill badge) */}
            <p className="font-mono text-xs uppercase tracking-widest text-[#5F5A5C] mb-6">
              ZPPSU Guidance &amp; Counseling Office · Archival Registry
            </p>

            {/* Editorial Headline: Single color, no gradient, no highlighted accent words */}
            <h1 className="font-['Newsreader',Georgia,serif] text-5xl sm:text-6xl lg:text-[76px] xl:text-[82px] font-normal tracking-tight text-[#1D1A1B] leading-[1.04] mb-8">
              Every student record, <br />
              exactly where it belongs.
            </h1>

            {/* Human, specific subtext */}
            <p className="text-base sm:text-lg text-[#5F5A5C] max-w-xl mb-10 leading-relaxed font-normal">
              Locate any physical file by cabinet and box number, then pull its verified digital copy in seconds. Built for the ZPPSU Guidance Office in strict compliance with Republic Act 10173 (Data Privacy Act of 2012).
            </p>

            {/* Action Components: One solid maroon button (4px corners, no arrow) + one plain text link */}
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="bg-[#6B1B2E] text-[#FFFCF7] hover:bg-[#521322] px-6 py-3.5 rounded-[4px] text-sm font-medium tracking-wide transition-colors"
              >
                Access the Archive
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("features");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-sm font-medium text-[#1D1A1B] hover:text-[#6B1B2E] underline underline-offset-4 transition-colors cursor-pointer"
              >
                Explore indexing features
              </button>
            </div>

            {/* Concrete Facts Line (No 3-stat footer, single understated line) */}
            <div className="pt-8 border-t border-[#E8E3E1] w-full text-xs font-mono text-[#5F5A5C] tracking-wide">
              Role-based access · Cabinet-to-file indexing · Audit log · R.A. 10173 compliant
            </div>

          </div>

          {/* RIGHT COLUMN: Purposeful Flat Line-Art / Architectural Archive Drawer Vector (~5 Columns) */}
          <div className="lg:col-span-5 w-full flex flex-col pt-2 lg:pt-4">
            <div className="w-full border border-[#E8E3E1] bg-[#FFFCF7]">
              
              {/* Drawer Top Header Plate */}
              <div className="border-b border-[#E8E3E1] px-5 py-3.5 flex items-center justify-between bg-[#FFFCF7]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 border border-[#1D1A1B] inline-block" />
                  <span className="font-mono text-xs font-semibold tracking-wider text-[#1D1A1B] uppercase">
                    Cabinet A · Drawer 02
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#5F5A5C] uppercase tracking-wider">
                  Physical Vault
                </span>
              </div>

              {/* Labeled File Tabs (Line-art cross section) */}
              <div className="border-b border-[#E8E3E1] bg-[#FAF7F2] p-4 flex flex-col gap-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#5F5A5C] mb-1">
                  Active Suspension Rails
                </div>

                {/* Tab 01 */}
                <div className="flex items-center justify-between border border-[#E8E3E1] bg-[#FFFCF7] px-3.5 py-2 text-xs font-mono">
                  <span className="text-[#5F5A5C]">Box 01</span>
                  <span className="text-[#1D1A1B] font-medium">Student 201 Records</span>
                  <span className="text-[10px] text-[#5F5A5C]">Confidential</span>
                </div>

                {/* Tab 02 (Active Tab with Maroon Accent Rule) */}
                <div className="flex items-center justify-between border-l-2 border-l-[#6B1B2E] border-y border-r border-[#E8E3E1] bg-[#FFFCF7] px-3.5 py-2.5 text-xs font-mono">
                  <span className="font-bold text-[#6B1B2E]">Box 03</span>
                  <span className="text-[#1D1A1B] font-bold">Accomplishment Reports</span>
                  <span className="text-[10px] uppercase font-bold text-[#6B1B2E]">Indexed</span>
                </div>

                {/* Tab 03 */}
                <div className="flex items-center justify-between border border-[#E8E3E1] bg-[#FFFCF7] px-3.5 py-2 text-xs font-mono">
                  <span className="text-[#5F5A5C]">Box 05</span>
                  <span className="text-[#1D1A1B] font-medium">CHED Communications</span>
                  <span className="text-[10px] text-[#5F5A5C]">Transmittals</span>
                </div>

                {/* Tab 04 */}
                <div className="flex items-center justify-between border border-[#E8E3E1] bg-[#FFFCF7] px-3.5 py-2 text-xs font-mono">
                  <span className="text-[#5F5A5C]">Box 07</span>
                  <span className="text-[#1D1A1B] font-medium">Counseling Summaries</span>
                  <span className="text-[10px] text-[#5F5A5C]">Protected</span>
                </div>
              </div>

              {/* Index Card Detail (Selected File Docket) */}
              <div className="p-5 font-mono text-xs space-y-3 bg-[#FFFCF7]">
                <div className="flex justify-between items-center pb-2 border-b border-[#E8E3E1]">
                  <span className="text-[#5F5A5C] uppercase text-[10px] tracking-wider">Accession Number</span>
                  <span className="font-bold text-[#1D1A1B]">DOC-2026-0063</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#E8E3E1]">
                  <span className="text-[#5F5A5C] uppercase text-[10px] tracking-wider">Physical Storage</span>
                  <span className="text-[#1D1A1B]">Cabinet A / Box 03 / Folder 14</span>
                </div>

                <div className="flex justify-between items-center pb-2 border-b border-[#E8E3E1]">
                  <span className="text-[#5F5A5C] uppercase text-[10px] tracking-wider">Digital Record</span>
                  <span className="text-[#1D1A1B]">Verified PDF · Searchable</span>
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-[#5F5A5C] uppercase text-[10px] tracking-wider">Compliance</span>
                  <span className="text-[#6B1B2E] font-semibold">R.A. 10173 Registered</span>
                </div>
              </div>

              {/* Minimal Bottom Bar */}
              <div className="border-t border-[#E8E3E1] px-5 py-2.5 bg-[#FAF7F2] flex items-center justify-between text-[11px] font-mono text-[#5F5A5C]">
                <span>ZPPSU Guidance Registry</span>
                <span>Drawer Lock: Secured</span>
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
                  Securely store, organize, and manage thousands of student guidance records in one unified digital vault, categorized by cabinets and file boxes.
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
                  Role-based permissions and comprehensive activity logs provide an audit trail of every access and modification under RA 10173.
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
