import Navbar from "../components/layout/Navbar";
import { ArrowRight, ShieldCheck, Database, Search, FileText, Lock, Mail, Phone, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../assets/logo.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F2937] font-sans selection:bg-[#FFD700] selection:text-[#800000] scroll-smooth overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col justify-center items-center text-center px-4"
      >
        {/* Premium Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#800000]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute inset-0 -z-20 h-full w-full bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center rounded-full border border-[#800000]/20 bg-white/60 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-[#800000] mb-8 shadow-sm">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Enterprise-Grade Archiving
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#800000] to-[#4D0000] tracking-tight mb-6 max-w-4xl drop-shadow-sm">
          Digital Archiving System <br />
          <span className="text-[#1F2937] font-bold text-4xl md:text-5xl lg:text-6xl">ZPPSU Guidance Office</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed font-medium">
          A secure, high-performance platform engineered for seamless student records management, instant retrieval, and strict data compliance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            onClick={() => navigate("/login")}
            className="px-8 py-7 rounded-2xl bg-[#800000] text-white hover:bg-[#660000] hover:shadow-[0_8px_30px_rgb(128,0,0,0.3)] text-lg transition-all hover:-translate-y-1 group"
          >
            Access System
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => document.getElementById("features").scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-7 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 text-lg transition-all hover:-translate-y-1 shadow-sm"
          >
            Explore Features
          </Button>
        </div>
        
        {/* Mockup / Dashboard Preview Illustration */}
        <div className="mt-20 w-full max-w-5xl mx-auto relative rounded-xl border border-gray-200/60 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
          <div className="w-full h-12 bg-gray-50/80 rounded-t-lg border-b border-gray-200/60 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="h-[300px] md:h-[500px] w-full bg-white rounded-b-lg p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden">
             {/* Abstract UI representing dashboard */}
             <div className="hidden md:flex flex-col w-1/4 gap-4 h-full border-r border-gray-100 pr-4">
                <div className="w-full h-8 bg-gray-100 rounded-md"></div>
                <div className="w-3/4 h-8 bg-gray-100 rounded-md"></div>
                <div className="w-5/6 h-8 bg-gray-100 rounded-md"></div>
                <div className="w-full h-8 bg-gray-100 rounded-md mt-auto"></div>
             </div>
             <div className="flex-1 flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-10 bg-gray-100 rounded-lg"></div>
                  <div className="w-10 h-10 bg-[#800000]/10 rounded-full flex justify-center items-center overflow-hidden">
                    <img src={logo} alt="logo" className="w-full h-full object-cover opacity-70" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 h-32 bg-gradient-to-br from-[#800000]/5 to-transparent border border-[#800000]/10 rounded-xl p-4"></div>
                  <div className="flex-1 h-32 bg-gray-50 border border-gray-100 rounded-xl"></div>
                  <div className="flex-1 h-32 bg-gray-50 border border-gray-100 rounded-xl"></div>
                </div>
                <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm"></div>
             </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Bento Grid) */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-[#800000] uppercase mb-3">Core Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Engineered for Efficiency</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1 - Large */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-gray-100 bg-[#FDFBF7] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute right-0 bottom-0 opacity-5 w-64 h-64 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-500">
                <Database className="w-full h-full text-[#800000]" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-6 text-[#800000] shadow-sm">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Centralized Records Hub</h3>
                <p className="text-gray-600 leading-relaxed text-lg max-w-md">Securely store, organize, and manage thousands of student guidance records in one unified, easily accessible digital vault.</p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-[#800000]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Instant Search</h3>
                <p className="text-gray-600 leading-relaxed">Locate any document in milliseconds using powerful querying tools.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6 text-[#800000]">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">Ironclad Security</h3>
                <p className="text-gray-600 leading-relaxed">Role-based access control ensures only authorized personnel view sensitive data.</p>
              </div>
            </div>

            {/* Feature 4 - Large */}
            <div className="md:col-span-2 p-8 rounded-3xl border border-gray-100 bg-[#800000] text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 text-[#FFD700]">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Automated Reporting</h3>
                <p className="text-white/80 leading-relaxed text-lg max-w-md">Generate comprehensive insights, tracking logs, and usage statistics with one click for administrative review.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-24 flex flex-col items-center px-6 bg-[#FDFBF7]"
      >
        <div className="max-w-4xl text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
            <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Empowering the Guidance Office
          </h2>
          <div className="w-24 h-1.5 bg-[#800000] mx-auto mb-8 rounded-full"></div>
          <p className="text-xl leading-relaxed text-gray-600 font-medium">
            Designed exclusively for the <strong className="text-gray-900">Zamboanga Peninsula Polytechnic State University (ZPPSU)</strong>, this archiving ecosystem eradicates physical document clutter. It guarantees faster retrieval, precise inventory monitoring, and strict data protection tailored to institutional standards.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION & FOOTER */}
      <footer id="contact" className="relative bg-white pt-32 pb-12 px-6 border-t border-gray-100 mt-24">
        {/* Floating Contact Card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 md:px-6">
          <div className="bg-[#800000] rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
            <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-[#FFD700]/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute left-0 bottom-0 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl translate-y-1/4 -translate-x-1/4"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Need Technical Support?</h3>
              <p className="text-white/80 text-base md:text-lg max-w-md">Our guidance office administration team is here to assist you with system access and data retrieval.</p>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a href="mailto:guidanceoffice@zppsu.edu.ph" className="flex items-center justify-center gap-3 px-6 py-4 bg-white text-[#800000] rounded-xl font-bold hover:bg-[#FDFBF7] hover:scale-105 transition-all shadow-md">
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <div className="flex items-center justify-center gap-3 px-6 py-4 bg-white/10 text-white border border-white/20 rounded-xl font-medium backdrop-blur-sm cursor-default">
                <Phone className="w-5 h-5 text-[#FFD700]" />
                +63 912 345 6789
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 mt-16 md:mt-24 mb-16">
          <div className="max-w-md">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight leading-none">ZPPSU Guidance</h2>
                <span className="text-[#800000] text-[10px] uppercase tracking-widest font-bold mt-1">Digital Archiving System</span>
              </div>
            </div>
            <p className="text-gray-500 leading-relaxed text-base font-medium">
              A dedicated enterprise-grade digital records management ecosystem tailored specifically for the Zamboanga Peninsula Polytechnic State University Guidance Office.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-16 md:gap-24">
            <div className="flex flex-col space-y-4">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-2">Platform</h3>
              <a href="#home" className="text-gray-500 hover:text-[#800000] transition-colors font-medium">Home Overview</a>
              <a href="#features" className="text-gray-500 hover:text-[#800000] transition-colors font-medium">Core Features</a>
              <a href="#about" className="text-gray-500 hover:text-[#800000] transition-colors font-medium">About the System</a>
            </div>
            <div className="flex flex-col space-y-4">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-2">Legal & Privacy</h3>
              <a href="#" className="text-gray-500 hover:text-[#800000] transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-[#800000] transition-colors font-medium">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-[#800000] transition-colors font-medium">Data Privacy Act</a>
            </div>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Zamboanga Peninsula Polytechnic State University. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center gap-1">
            Engineered with <Heart className="w-4 h-4 text-[#800000] mx-1 fill-[#800000]" /> for ZPPSU
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;