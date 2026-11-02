import React from "react";
import { useNavigate } from "react-router-dom";
import { FolderArchive, Box, Layers, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

/**
 * DashboardKpiCards
 * 4 High-impact executive KPI metrics designed with institutional hierarchy.
 */
export default function DashboardKpiCards({
  totalDocuments = 0,
  activeDocuments = 0,
  assignedCount = 0,
  categoriesCount = 0,
  docTypesCount = 0,
  totalLogs = 0,
}) {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Archive Holdings",
      value: totalDocuments,
      badge: `${activeDocuments} Active`,
      badgeColor: "bg-[#F4E7EA] text-[#6B1D2A] border-[#6B1D2A]/20",
      description: "Total indexed records in institutional custody",
      icon: FolderArchive,
      path: "/document-center",
    },
    {
      title: "Physical Placement",
      value: `${assignedCount} / ${totalDocuments}`,
      badge: `${totalDocuments > 0 ? Math.round((assignedCount / totalDocuments) * 100) : 100}% Filed`,
      badgeColor: "bg-[#F2DFB0]/50 text-[#A87818] border-[#C99A2E]/30",
      description: "Assigned to physical cabinets & archfile binders",
      icon: Box,
      path: "/inventory",
    },
    {
      title: "Record Classifications",
      value: `${categoriesCount} Series`,
      badge: `${docTypesCount} Types`,
      badgeColor: "bg-[#F4E7EA] text-[#6B1D2A] border-[#6B1D2A]/20",
      description: "Academic, Administrative & Financial taxonomies",
      icon: Layers,
      path: "/categories",
    },
    {
      title: "Audit Trail Integrity",
      value: `${totalLogs} Logs`,
      badge: "Verified Ledger",
      badgeColor: "bg-[#F2DFB0]/50 text-[#A87818] border-[#C99A2E]/30",
      description: "Immutable chain-of-custody logging active",
      icon: ShieldCheck,
      path: "/logs",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            onClick={() => navigate(card.path)}
            className="bg-[#FFFCF7] border border-[#E8E3E1] shadow-xs hover:shadow-sm hover:border-[#C99A2E]/60 transition-all rounded-xl cursor-pointer group flex flex-col justify-between"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className="p-2 rounded-xl bg-[#F4E7EA] border border-[#E8E3E1] text-[#6B1D2A] group-hover:bg-[#6B1D2A] group-hover:text-[#FFFCF7] transition-colors duration-200">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-[#1D1A1B] tracking-tight">
                  {card.value}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#5F5A5C] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <p className="text-[11px] text-[#5F5A5C] pt-2 border-t border-[#E8E3E1]/60 leading-normal">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
