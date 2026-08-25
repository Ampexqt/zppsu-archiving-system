import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ShieldCheck, Archive, Search, Layers, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function About() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800000]/10 text-[#800000] text-xs font-bold uppercase tracking-wider">
            <Archive className="w-3.5 h-3.5" />
            <span>Institutional Archiving System</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About the Guidance Office Archiving System
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            The Zamboanga Peninsula Polytechnic State University (ZPPSU) Guidance and Counseling Office records management system is designed to provide secure, traceable, and standards-compliant document preservation and physical inventory synchronization.
          </p>
        </div>

        {/* PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200 shadow-xs bg-white rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#800000]/10 text-[#800000] flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Physical-Digital Sync</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every digital document maps directly to a physical Cabinet and File Box container in the guidance vault for seamless retrieval.
            </p>
          </Card>

          <Card className="border border-gray-200 shadow-xs bg-white rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/20 text-[#800000] flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Intelligent Search & OCR</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Automated OCR indexing allows deep searchability across scanned PDF documents and official university records.
            </p>
          </Card>

          <Card className="border border-gray-200 shadow-xs bg-white rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Role-Based Integrity</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
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