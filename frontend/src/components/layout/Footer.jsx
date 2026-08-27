import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import logo from "../../assets/logo.jpg";

function Footer() {
  return (
    <footer className="bg-[#FFFCF7] border-t border-[#E8E3E1] pt-16 pb-12 text-[#1D1A1B]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* BRAND COLUMN */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E8E3E1] bg-[#FFFCF7]">
              <img src={logo} alt="ZPPSU Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight text-[#1D1A1B] leading-none">
                ZPPSU Guidance Office
              </h3>
              <p className="text-xs uppercase tracking-widest text-[#6B1D2A] font-bold mt-0.5">
                Digital Archiving System
              </p>
            </div>
          </div>
          <p className="text-sm text-[#5F5A5C] max-w-sm leading-relaxed">
            Official institutional archiving platform engineered for high security, compliant retention, and streamlined student record workflows.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4E7EA] border border-[#E8E3E1] text-xs font-semibold text-[#6B1D2A]">
            <ShieldCheck className="w-4 h-4 text-[#6B1D2A]" />
            Enterprise-Grade Document Security
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1D1A1B] tracking-wide uppercase">Quick Links</h4>
          <ul className="space-y-2 text-sm text-[#5F5A5C]">
            <li><a href="#home" className="hover:text-[#6B1D2A] transition-colors">Home Portal</a></li>
            <li><a href="#features" className="hover:text-[#6B1D2A] transition-colors">System Features</a></li>
            <li><a href="#about" className="hover:text-[#6B1D2A] transition-colors">About the Guidance Office</a></li>
            <li><a href="#contact" className="hover:text-[#6B1D2A] transition-colors">Contact & Support</a></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-[#1D1A1B] tracking-wide uppercase">Campus Office</h4>
          <ul className="space-y-2 text-sm text-[#5F5A5C]">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#6B1D2A] shrink-0 mt-0.5" />
              <span>R.T. Lim Boulevard, Baliwasan, Zamboanga City</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#6B1D2A] shrink-0" />
              <span>guidance@zppsu.edu.ph</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#6B1D2A] shrink-0" />
              <span>(062) 991-3815</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-6 border-t border-[#E8E3E1] flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F5A5C] gap-3">
        <p>&copy; {new Date().getFullYear()} Zamboanga Peninsula Polytechnic State University. All rights reserved.</p>
        <p className="font-medium text-[#1D1A1B]">Guidance & Counseling Services Unit</p>
      </div>
    </footer>
  );
}

export default Footer;