import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function Contact() {
  return (
    <div className="min-h-screen bg-[#FFFCF7] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1] text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Support & Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D1A1B] tracking-tight">
            Contact Guidance & Counseling Office
          </h1>
          <p className="text-sm text-[#5F5A5C] leading-relaxed">
            Have questions regarding document archiving, record verification, or system access? Reach out to the university administration.
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1D1A1B]">Office Location</h3>
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Guidance and Counseling Office<br />
              ZPPSU Main Campus, R.T. Lim Boulevard<br />
              Zamboanga City, 7000, Philippines
            </p>
          </Card>

          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F2DFB0] text-[#A87818] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1D1A1B]">Email Assistance</h3>
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Official: guidance@zppsu.edu.ph<br />
              Records: archiving@zppsu.edu.ph<br />
              IT Support: itsupport@zppsu.edu.ph
            </p>
          </Card>

          <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4E7EA] text-[#6B1D2A] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1D1A1B]">Office Hours</h3>
            <p className="text-xs text-[#5F5A5C] leading-relaxed">
              Monday to Friday: 8:00 AM – 5:00 PM<br />
              Closed on Weekends and Official Holidays
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;