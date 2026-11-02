import React, { useState, useEffect } from "react";
import { X, UserPlus, User, Mail, Lock, Eye, EyeOff, Wand2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * CreateUserModal
 * Modal for creating new staff accounts with secure password generator and copy tool.
 */
export default function CreateUserModal({
  isOpen,
  onClose,
  onCreateUser,
  isSaving = false,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setIsCopied(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const generatePassword = () => {
    const colors = ["Maroon", "Gold", "Royal", "Silver", "Amber", "Crimson", "Cedar", "Summit"];
    const nouns = ["Archive", "Vault", "Beacon", "Pillar", "Shield", "Falcon", "Eagle", "Atlas"];
    const syms = "!@#$%^&*";
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 90) + 10;
    const randomSym = syms[Math.floor(Math.random() * syms.length)];
    
    const newPass = `${randomColor}${randomNoun}${randomSym}${randomNumber}`;
    setPassword(newPass);
    setShowPassword(true);
  };

  const copyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!name.trim() || !email.trim() || !password || isSaving) return;
    onCreateUser({ name: name.trim(), email: email.trim(), password });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-[#1D1A1B]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div
        className="bg-[#FFFCF7] w-full max-w-md rounded-2xl shadow-xl border border-[#E8E3E1] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 px-6 border-b border-[#E8E3E1] flex items-center justify-between bg-[#FFFCF7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] flex items-center justify-center text-[#6B1D2A] shrink-0">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#1D1A1B] text-sm tracking-tight">
                Create New Staff Account
              </h3>
              <p className="text-[11px] text-[#5F5A5C] mt-0.5">
                Add an authorized staff member to the archiving system
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1A1B] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#5F5A5C]" />
              <span>Full Name <strong className="text-[#6B1D2A]">*</strong></span>
            </label>
            <Input
              type="text"
              name="name"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1D1A1B] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#5F5A5C]" />
              <span>Email Address <strong className="text-[#6B1D2A]">*</strong></span>
            </label>
            <Input
              type="email"
              name="email"
              placeholder="e.g. staff@zppsu.edu.ph"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A]"
            />
          </div>

          {/* PASSWORD WITH GENERATOR & COPY */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#1D1A1B] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#5F5A5C]" />
                <span>Password <strong className="text-[#6B1D2A]">*</strong></span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyPassword}
                  disabled={!password}
                  className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    isCopied 
                      ? "text-[#6B1D2A] bg-[#F4E7EA]" 
                      : "text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA]"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isCopied ? <Check className="w-3 h-3 text-[#6B1D2A]" /> : <Copy className="w-3 h-3" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] hover:bg-[#8B3545] hover:text-white px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Generate</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-xs rounded-xl border-[#E8E3E1] bg-[#FFFCF7] text-[#1D1A1B] pr-10 placeholder-[#5F5A5C]/60 focus:border-[#6B1D2A] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5F5A5C] hover:text-[#1D1A1B] transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#5F5A5C]">
              Tip: Click "Generate" to generate a secure institutional passphrase.
            </p>
          </div>
        </form>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-[#E8E3E1] flex items-center justify-end gap-2.5 bg-[#FFFCF7]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSaving}
            className="h-9 px-4 rounded-xl text-xs font-semibold text-[#1D1A1B] bg-[#FFFCF7] border-[#E8E3E1] hover:bg-[#F4E7EA] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={!name.trim() || !email.trim() || !password || isSaving}
            className="h-9 px-4 rounded-xl text-xs font-bold text-[#FFFCF7] bg-[#6B1D2A] hover:bg-[#8B3545] cursor-pointer shadow-xs inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isSaving ? "Creating..." : "Create User"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
