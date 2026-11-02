import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ShadcnSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  disabled = false,
  className = "",
  popoverWidth = "w-64",
  searchable = false,
  searchPlaceholder = "Search...",
  allowClear = false,
  clearLabel = "Select (Optional)",
}) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));
  const displayText = selectedOption?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-[#E8E3E1] bg-[#FFFCF7] px-3 py-2 text-xs font-medium text-[#1D1A1B] focus:ring-2 focus:ring-[#6B1D2A]/20 focus:border-[#6B1D2A] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer",
          className
        )}
      >
        <span className={cn("truncate", !selectedOption && "text-[#5F5A5C]")}>
          {displayText}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50 shrink-0 text-[#5F5A5C] ml-1" />
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 max-h-60 overflow-y-auto bg-[#FFFCF7] border border-[#E8E3E1] rounded-xl shadow-md z-50", popoverWidth)}
        align="start"
      >
        <Command>
          {searchable && (
            <CommandInput placeholder={searchPlaceholder} className="text-xs" />
          )}
          <CommandList>
            {searchable && (
              <CommandEmpty className="text-xs p-2 text-center text-[#5F5A5C]">
                No match found.
              </CommandEmpty>
            )}
            <CommandGroup>
              {allowClear && (
                <CommandItem
                  value="__clear_selection__"
                  onSelect={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  className="text-xs cursor-pointer text-[#5F5A5C] hover:bg-[#F4E7EA] rounded-lg"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3.5 w-3.5",
                      !value ? "opacity-100 text-[#6B1D2A]" : "opacity-0"
                    )}
                  />
                  <span>{clearLabel}</span>
                </CommandItem>
              )}
              {options.map((opt) => {
                const isSelected = String(value) === String(opt.value);
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.searchKey || opt.label}
                    onSelect={() => {
                      onChange(String(opt.value));
                      setOpen(false);
                    }}
                    className="text-xs cursor-pointer text-[#1D1A1B] hover:bg-[#F4E7EA] rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center min-w-0">
                      <Check
                        className={cn(
                          "mr-2 h-3.5 w-3.5 shrink-0",
                          isSelected ? "opacity-100 text-[#6B1D2A]" : "opacity-0"
                        )}
                      />
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {opt.subtitle && (
                      <span className="text-[10px] text-[#5F5A5C] ml-2 shrink-0">
                        {opt.subtitle}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
