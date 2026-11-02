import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Layers, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/**
 * CategoryDistributionCard
 * Interactive donut visualization + category distribution breakdown + top document series.
 */
export default function CategoryDistributionCard({
  documentsByCategory = [],
  documentsPerType = [],
  totalDocuments = 0,
}) {
  // Institutional distinct colors (high contrast, zero emerald/green)
  const COLORS = ["#6B1D2A", "#C99A2E", "#3B3638", "#8B3545", "#A87818"];

  const chartData = documentsByCategory.map((cat, idx) => ({
    name: cat.category || "Unclassified",
    value: cat._count?.id || 0,
    color: COLORS[idx % COLORS.length],
  }));

  const topDocTypes = documentsPerType.slice(0, 3);

  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-[#E8E3E1]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B]">
                Classification & Category Distribution
              </CardTitle>
              <CardDescription className="text-[11px] text-[#5F5A5C]">
                Institutional document balance across administrative & academic areas
              </CardDescription>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F2DFB0]/50 text-[#A87818] border border-[#C99A2E]/30 hidden sm:inline-block">
            {chartData.length} Classifications
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {chartData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* DONUT CHART */}
            <div className="sm:col-span-5 h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#FFFCF7"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFCF7",
                      borderRadius: "10px",
                      border: "1px solid #E8E3E1",
                      color: "#1D1A1B",
                      fontSize: "11px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    formatter={(val, name) => [`${val} Records`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* CENTER DONUT STAT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-[#1D1A1B] leading-none">
                  {totalDocuments}
                </span>
                <span className="text-[9px] font-bold text-[#5F5A5C] uppercase tracking-wider mt-0.5">
                  Records
                </span>
              </div>
            </div>

            {/* CATEGORY LIST BREAKDOWN */}
            <div className="sm:col-span-7 space-y-2">
              {chartData.map((item) => {
                const pct = totalDocuments > 0 ? Math.round((item.value / totalDocuments) * 100) : 0;
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-[#1D1A1B] truncate text-xs">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 text-xs">
                        <span className="font-bold text-[#1D1A1B]">{item.value}</span>
                        <span className="text-[10px] text-[#5F5A5C]">({pct}%)</span>
                      </div>
                    </div>
                    {/* Mini proportional progress bar */}
                    <div className="w-full h-1.5 bg-[#E8E3E1]/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#5F5A5C]">
            No classification records available.
          </div>
        )}

        {/* TOP DOCUMENT SERIES STRIP */}
        {topDocTypes.length > 0 && (
          <div className="pt-3 border-t border-[#E8E3E1] space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-[#6B1D2A]" />
              <span>Highest Volume Document Series</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {topDocTypes.map((item, idx) => {
                const count = item._count?.id || 0;
                const pct = totalDocuments > 0 ? Math.round((count / totalDocuments) * 100) : 0;
                return (
                  <div
                    key={item.document_type}
                    className="p-2.5 rounded-xl bg-[#F4E7EA]/40 border border-[#E8E3E1] flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#6B1D2A] text-[#FFFCF7]">
                          #{idx + 1}
                        </span>
                        <span
                          className="text-[11px] font-bold text-[#1D1A1B] truncate"
                          title={item.document_type}
                        >
                          {item.document_type}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-[#6B1D2A] shrink-0">
                      {count} <span className="text-[9px] font-medium text-[#5F5A5C]">({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
