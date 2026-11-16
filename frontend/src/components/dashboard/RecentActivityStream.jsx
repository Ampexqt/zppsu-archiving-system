import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ArrowRight, Eye, Box, Clock, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { parseBoxHierarchy } from "../inventory/storageTaxonomy";

/**
 * RecentActivityStream
 * Applied /ui-ux-pro-max:
 * - Fluid, responsive table layout with 0 horizontal scrollbars on desktop viewports.
 * - Meaningful title resolver (eliminates generic "document" and raw "N/A" placeholders).
 * - High-contrast ZPPSU palette (Maroon, Gold, Soft Pink, Slate, Cream).
 * - Full-row clickability with instant preview inspection.
 * - Live stream indicator with active tab counters.
 */
export default function RecentActivityStream({
  recentFiles = [],
  recentActivities = [],
  onViewDocument,
}) {
  const [activeTab, setActiveTab] = useState("documents"); // "documents" | "audit"

  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl overflow-hidden">
      {/* CARD HEADER */}
      <CardHeader className="p-4 sm:p-5 border-b border-[#E8E3E1] bg-[#FCFAF8]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C99A2E] animate-pulse shrink-0" title="Active Real-Time Feed" />
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B] flex items-center gap-2">
                <span>Real-Time Archival Stream</span>
                <span className="text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] border border-[#E8E3E1] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </CardTitle>
              <CardDescription className="text-[11px] text-[#5F5A5C] mt-0.5">
                Continuous chronological feed of ingested documents and custody trail
              </CardDescription>
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="inline-flex p-1 bg-[#F4E7EA] rounded-xl border border-[#E8E3E1] self-start sm:self-auto shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "documents"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Latest Records ({recentFiles.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("audit")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "audit"
                  ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-xs"
                  : "text-[#5F5A5C] hover:text-[#1D1A1B]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Log ({recentActivities.length})</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* TAB 1: RECENT INGESTED DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed text-xs text-left min-w-[760px] lg:min-w-full">
              <thead className="text-[10px] text-[#5F5A5C] uppercase bg-[#FCFAF8] border-b border-[#E8E3E1]">
                <tr>
                  <th className="w-[125px] pl-4 sm:pl-5 py-2.5 font-bold whitespace-nowrap">Document ID</th>
                  <th className="px-3.5 py-2.5 font-bold">Subject / Title</th>
                  <th className="w-[160px] px-3.5 py-2.5 font-bold hidden md:table-cell text-center">Series Type</th>
                  <th className="w-[210px] px-3.5 py-2.5 font-bold">Physical Storage</th>
                  <th className="w-[125px] px-3.5 py-2.5 font-bold hidden xl:table-cell">Filed By</th>
                  <th className="w-[90px] px-3.5 py-2.5 font-bold hidden sm:table-cell whitespace-nowrap">Date</th>
                  <th className="w-[95px] pr-4 sm:pr-5 py-2.5 font-bold text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3E1]">
                {recentFiles.length > 0 ? (
                  recentFiles.slice(0, 5).map((file) => {
                    const boxParsed = file.file_box?.name ? parseBoxHierarchy(file.file_box.name) : null;
                    const cabinetName = (file.file_box?.cabinet?.name || file.cabinet?.name || "")
                      .replace(/\[steel\]/gi, "")
                      .trim();

                    // Smart Title Resolver (UI/UX Pro Max: Eliminate "document", "N/A", and mashing)
                    const rawSubject = file.subject?.trim();
                    const rawTitle = file.title?.trim();
                    const isSubjectBogus = !rawSubject || rawSubject === "N/A" || rawSubject.toLowerCase() === "document" || rawSubject.toLowerCase() === "untitled document";
                    const isTitleBogus = !rawTitle || rawTitle === "N/A" || rawTitle.toLowerCase() === "document" || rawTitle.toLowerCase() === "untitled document";

                    let displayTitle = "Official Record";
                    if (!isSubjectBogus && !isTitleBogus) {
                      if (rawSubject.toLowerCase() === "asdasd" && rawTitle) {
                        displayTitle = rawTitle;
                      } else {
                        displayTitle = rawSubject.length >= rawTitle.length ? rawSubject : rawTitle;
                      }
                    } else if (!isSubjectBogus) {
                      displayTitle = rawSubject;
                    } else if (!isTitleBogus) {
                      displayTitle = rawTitle;
                    } else if (file.file_name) {
                      displayTitle = file.file_name.replace(/\.[^/.]+$/, "");
                    }

                    // Clean Physical Storage Path
                    const storageLocationString = cabinetName && boxParsed?.displayName
                      ? `${cabinetName} › ${boxParsed.displayName}`
                      : cabinetName || boxParsed?.displayName || null;

                    return (
                      <tr
                        key={file.id}
                        onClick={() => onViewDocument(file)}
                        className="hover:bg-[#F4E7EA]/40 transition-colors group cursor-pointer"
                        title="Click to inspect document record"
                      >
                        {/* 1. DOCUMENT ID */}
                        <td className="pl-4 sm:pl-5 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-[11px] text-[#6B1D2A] bg-[#FFFCF7] border border-[#E8E3E1] px-2 py-0.5 rounded-md shadow-2xs group-hover:border-[#6B1D2A]/40 transition-colors">
                            {file.document_id || `ID-${file.id}`}
                          </span>
                        </td>

                        {/* 2. SUBJECT / TITLE */}
                        <td className="px-3.5 py-3 min-w-0">
                          <span
                            className="font-bold text-xs text-[#1D1A1B] truncate block group-hover:text-[#6B1D2A] transition-colors"
                            title={displayTitle}
                          >
                            {displayTitle}
                          </span>
                        </td>

                        {/* 3. SERIES TYPE */}
                        <td className="px-3.5 py-3 min-w-0 hidden md:table-cell text-center">
                          <span
                            className="text-[10px] font-semibold text-[#5F5A5C] bg-[#E8E3E1]/40 px-2 py-0.5 rounded-md border border-[#E8E3E1] truncate block text-center"
                            title={file.document_type || "General"}
                          >
                            {file.document_type || "General"}
                          </span>
                        </td>

                        {/* 4. PHYSICAL STORAGE */}
                        <td className="px-3.5 py-3 min-w-0">
                          {storageLocationString ? (
                            <div
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-[#6B1D2A] bg-[#F4E7EA] border border-[#E8E3E1] max-w-full truncate shadow-2xs"
                              title={storageLocationString}
                            >
                              {boxParsed?.isArchfile ? (
                                <span
                                  className="w-2 h-2 rounded-full shrink-0 border border-black/15 shadow-2xs inline-block"
                                  style={{ backgroundColor: boxParsed.color || "#6B1D2A" }}
                                />
                              ) : (
                                <Box className="w-3 h-3 text-[#6B1D2A] shrink-0" />
                              )}
                              <span className="truncate">{storageLocationString}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-[#A87818] bg-[#F2DFB0]/40 px-2 py-0.5 rounded-md border border-[#C99A2E]/20 inline-flex items-center gap-1">
                              <Box className="w-3 h-3 text-[#A87818]" /> Awaiting Box
                            </span>
                          )}
                        </td>

                        {/* 5. FILED BY */}
                        <td className="px-3.5 py-3 min-w-0 hidden xl:table-cell text-[#5F5A5C] truncate" title={file.user?.email || "System"}>
                          <div className="flex items-center gap-1.5 truncate">
                            <div className="w-4 h-4 rounded-full bg-[#E8E3E1] text-[#5F5A5C] flex items-center justify-center text-[9px] font-bold shrink-0">
                              {(file.user?.name || file.user?.email || "S").charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate">{file.user?.name || file.user?.email?.split("@")[0] || "System"}</span>
                          </div>
                        </td>

                        {/* 6. DATE */}
                        <td className="px-3.5 py-3 text-[#5F5A5C] whitespace-nowrap hidden sm:table-cell text-[11px]">
                          {file.created_at ? new Date(file.created_at).toLocaleDateString() : "—"}
                        </td>

                        {/* 7. ACTION */}
                        <td className="pr-4 sm:pr-5 py-3 text-right whitespace-nowrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDocument(file);
                            }}
                            className="h-7 px-2.5 text-[11px] font-bold text-[#6B1D2A] hover:bg-[#F4E7EA] rounded-lg cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 shrink-0" />
                            <span>Inspect</span>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-[#5F5A5C] italic">
                      No records filed in archive yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: AUDIT ACTIVITIES FEED */}
        {activeTab === "audit" && (
          <div className="divide-y divide-[#E8E3E1]">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((act) => {
                const actionUpper = act.action?.toUpperCase() || "";
                const isSecurity = actionUpper.includes("DELETE") || actionUpper.includes("DEMOTE") || actionUpper.includes("RESET");
                const isCreate = actionUpper.includes("UPLOAD") || actionUpper.includes("CREATE") || actionUpper.includes("PROMOTE");

                const badgeStyle = isSecurity
                  ? "bg-[#F4E7EA] text-[#6B1D2A] border-[#E8E3E1]"
                  : isCreate
                    ? "bg-[#F2DFB0]/50 text-[#A87818] border-[#C99A2E]/30"
                    : "bg-[#FFFCF7] text-[#1D1A1B] border-[#E8E3E1]";

                return (
                  <div
                    key={act.id}
                    className="p-3.5 px-4 flex items-center justify-between hover:bg-[#F4E7EA]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 font-mono ${badgeStyle}`}>
                        {act.action}
                      </span>
                      <p className="text-xs text-[#1D1A1B] truncate font-medium">
                        {act.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#5F5A5C] shrink-0">
                      <span className="hidden sm:inline font-medium">{act.user?.name || "System"}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#A87818]" />
                        {act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-[#5F5A5C] italic">
                No recent activity events recorded.
              </div>
            )}
          </div>
        )}

        {/* STREAM FOOTER */}
        <div className="p-3 px-4 bg-[#FCFAF8] border-t border-[#E8E3E1] flex items-center justify-between">
          <span className="text-[11px] font-medium text-[#5F5A5C]">
            Showing latest {activeTab === "documents" ? Math.min(recentFiles.length, 5) : Math.min(recentActivities.length, 5)} of {activeTab === "documents" ? recentFiles.length : recentActivities.length} {activeTab === "documents" ? "records" : "activities"}
          </span>
          <Link
            to={activeTab === "documents" ? "/document-center" : "/logs"}
            className="text-xs font-bold text-[#6B1D2A] hover:text-[#8B3545] flex items-center gap-1.5 transition-colors group cursor-pointer"
          >
            <span>{activeTab === "documents" ? "Open Document Center" : "View Full Audit Ledger"}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
