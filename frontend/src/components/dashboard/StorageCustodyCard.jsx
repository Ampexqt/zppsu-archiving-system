import React from "react";
import { Link } from "react-router-dom";
import { Box, Users, ArrowRight, FolderArchive, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/**
 * StorageCustodyCard
 * Displays real physical storage allocation by unit and active records custodians.
 */
export default function StorageCustodyCard({
  cabinetUsage = [],
  topUsers = [],
}) {
  const activeCabinets = cabinetUsage.slice(0, 4);

  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-[#E8E3E1]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B]">
                Physical Storage & Custodians
              </CardTitle>
              <CardDescription className="text-[11px] text-[#5F5A5C]">
                Active cabinet allocations and authorized filing personnel
              </CardDescription>
            </div>
          </div>
          <Link
            to="/inventory"
            className="text-[11px] font-bold text-[#6B1D2A] hover:underline flex items-center gap-1"
          >
            <span>Storage Explorer</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* PHYSICAL STORAGE UNITS */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-[#5F5A5C] uppercase tracking-wider block">
            Storage Units in Service ({cabinetUsage.length} Total Units)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {activeCabinets.map((cab) => {
              const boxCount = cab.file_boxes?.length || 0;
              const filesCount = cab.file_boxes
                ? cab.file_boxes.reduce((sum, b) => sum + (b.used_space || 0), 0)
                : 0;

              return (
                <div
                  key={cab.id}
                  className="p-2.5 rounded-xl bg-[#FCFAF8] border border-[#E8E3E1] hover:border-[#C99A2E]/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A] shrink-0">
                      <FolderArchive className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#1D1A1B] truncate">
                        {cab.name}
                      </p>
                      <p className="text-[10px] text-[#5F5A5C]">
                        {boxCount} {boxCount === 1 ? "Box" : "Boxes"} Stored
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F2DFB0]/40 text-[#A87818] border border-[#C99A2E]/20 shrink-0">
                    {filesCount} {filesCount === 1 ? "Doc" : "Docs"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP ACTIVE CUSTODIANS / PERSONNEL */}
        <div className="pt-3 border-t border-[#E8E3E1] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#5F5A5C] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#6B1D2A]" />
              <span>Active Records Custodians</span>
            </span>
            <Link
              to="/logs"
              className="text-[10px] font-bold text-[#6B1D2A] hover:underline"
            >
              View Audit Trails
            </Link>
          </div>

          <div className="space-y-1.5">
            {topUsers.slice(0, 3).map((user, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-[#FCFAF8] border border-[#E8E3E1]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#6B1D2A] text-[#FFFCF7] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1D1A1B] truncate">
                      {user.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F4E7EA] text-[#6B1D2A] border border-[#E8E3E1]">
                    {user.activities} Operations
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
