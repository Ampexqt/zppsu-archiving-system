import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ShieldCheck, Archive, Search, Layers, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function About() {
  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] text-xs font-bold uppercase tracking-wider">
            <Archive className="w-3.5 h-3.5" />
            <span>Institutional Archiving System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1A1B] tracking-tight">
            About the Guidance Office Archiving System
          </h1>
          <p className="text-sm text-[#5F5A5C] leading-relaxed">
            The Zamboanga Peninsula Polytechnic State University (ZPPSU) Guidance and Counseling Office records management system is designed to provide secure, traceable, and standards-compliant document preservation and physical inventory synchronization.
          </p>
        </div>

        {/* PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1D1A1B]">Physical-Digital Sync</h3>
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Every digital document maps directly to a physical Cabinet and File Box container in the guidance vault for seamless retrieval.
            </p>
          </Card>

          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2DFB0] text-[#A87818] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1D1A1B]">Intelligent Search & OCR</h3>
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Automated OCR indexing allows deep searchability across scanned PDF documents and official university records.
            </p>
          </Card>

          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1D1A1B]">Role-Based Integrity</h3>
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Strict access controls, audit trail logging, and secure authentication safeguard sensitive student and administrative records.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;