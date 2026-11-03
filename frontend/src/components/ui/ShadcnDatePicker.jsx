import React, { useState, useMemo, useRef, useEffect } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ShadcnDatePicker
 * Premium, non-generic, accessible date picker component adhering strictly
 * to the ZPPSU institutional color palette (Maroon #6B1D2A, Gold #A87818, White #FFFCF7).
 * Features quick year/month jump, preset shortcuts, and seamless string/Date binding.
 */
export default function ShadcnDatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  className = "",
  disabled = false,
  formatStr = "MMM d, yyyy",
  allowClear = true,
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse initial date from incoming string or Date
  const parsedDate = useMemo(() => {
    if (!value) return null;
    if (value instanceof Date && isValid(value)) return value;
    if (typeof value === "string") {
      // Try direct parse
      const direct = new Date(value);
      if (isValid(direct)) return direct;
      // Try ISO parse
      try {
        const iso = parseISO(value);
        if (isValid(iso)) return iso;
      } catch {
        // fallback
      }
    }
    return null;
  }, [value]);

  // Current viewing month and year for calendar navigation
  const [currentMonth, setCurrentMonth] = useState(() => parsedDate || new Date());

  // Update viewing month whenever incoming date changes
  useEffect(() => {
    if (parsedDate) {
      setCurrentMonth(parsedDate);
    }
  }, [parsedDate]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Calendar calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Year range for quick selector (1970 to 2035)
  const years = useMemo(() => {
    const list = [];
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 10; y >= 1970; y--) {
      list.push(y);
    }
    return list;
  }, []);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentMonth(new Date(newYear, month, 1));
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentMonth(new Date(year, newMonth, 1));
  };

  const handleSelectDay = (day) => {
    const selected = new Date(year, month, day);
    const formatted = format(selected, formatStr);
    onChange?.(formatted, selected);
    setIsOpen(false);
  };

  const handlePreset = (type) => {
    const today = new Date();
    if (type === "today") {
      const formatted = format(today, formatStr);
      onChange?.(formatted, today);
      setCurrentMonth(today);
    } else if (type === "yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const formatted = format(yesterday, formatStr);
      onChange?.(formatted, yesterday);
      setCurrentMonth(yesterday);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.("", null);
  };

  const isSelected = (day) => {
    if (!parsedDate) return false;
    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() === month &&
      parsedDate.getDate() === day
    );
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const displayString = parsedDate
    ? format(parsedDate, formatStr)
    : value || "";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        data-testid="datepicker-trigger"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          "w-full h-10 px-3.5 rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] text-xs flex items-center justify-between text-left transition-all duration-150 shadow-2xs cursor-pointer",
          "hover:border-[#6B1D2A]/40 focus:outline-none focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A]",
          isOpen && "border-[#6B1D2A] ring-2 ring-[#6B1D2A]/20",
          disabled && "opacity-50 cursor-not-allowed bg-neutral-100"
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CalendarIcon className="w-4 h-4 text-[#6B1D2A] shrink-0" />
          <span
            className={cn(
              "truncate font-medium",
              displayString ? "text-[#1D1A1B] font-semibold" : "text-[#5F5A5C]/70"
            )}
          >
            {displayString || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {allowClear && displayString && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
              className="p-1 rounded-md text-[#5F5A5C] hover:text-[#6B1D2A] hover:bg-[#F4E7EA] transition-colors"
              title="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </button>

      {/* POPOVER CALENDAR DIALOG */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 p-3.5 bg-[#FFFCF7] border border-[#E8E3E1] rounded-2xl shadow-xl w-[310px] animate-in fade-in zoom-in-95 duration-150 font-sans">
          {/* HEADER CONTROLS: Month & Year Dropdowns */}
          <div className="flex items-center justify-between gap-1 pb-3 border-b border-[#E8E3E1]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* MONTH SELECTOR */}
              <select
                value={month}
                onChange={handleMonthChange}
                className="text-xs font-bold text-[#1D1A1B] bg-[#F4E7EA]/40 border border-[#E8E3E1] rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#6B1D2A]"
              >
                {months.map((m, idx) => (
                  <option key={m} value={idx}>
                    {m}
                  </option>
                ))}
              </select>

              {/* YEAR SELECTOR */}
              <select
                value={year}
                onChange={handleYearChange}
                className="text-xs font-bold text-[#1D1A1B] bg-[#F4E7EA]/40 border border-[#E8E3E1] rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#6B1D2A]"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-[#5F5A5C] hover:text-[#1D1A1B] hover:bg-[#F4E7EA] transition-colors"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* QUICK SHORTCUT PRESETS */}
          <div className="flex items-center gap-1.5 py-2 border-b border-[#E8E3E1]">
            <button
              type="button"
              onClick={() => handlePreset("today")}
              className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#F4E7EA] text-[#6B1D2A] hover:bg-[#6B1D2A] hover:text-white transition-colors"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePreset("yesterday")}
              className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 text-[#5F5A5C] hover:bg-neutral-200 transition-colors"
            >
              Yesterday
            </button>
            {displayString && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-auto text-[10px] text-[#5F5A5C] hover:text-[#6B1D2A] font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* DAY NAMES */}
          <div className="grid grid-cols-7 gap-1 text-center py-2 text-[10px] font-bold text-[#5F5A5C] uppercase">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Empty slots for starting day of week */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="w-8 h-8" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const selected = isSelected(day);
              const today = isToday(day);

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer",
                    selected
                      ? "bg-[#6B1D2A] text-white font-bold shadow-xs scale-105"
                      : today
                      ? "border border-[#A87818] font-bold text-[#A87818] hover:bg-[#F4E7EA]"
                      : "text-[#1D1A1B] hover:bg-[#F4E7EA] hover:text-[#6B1D2A]"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
