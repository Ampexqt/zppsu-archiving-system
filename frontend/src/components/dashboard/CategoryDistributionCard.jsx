import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Layers, TrendingUp, PieChart as PieIcon, BarChart3, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * CategoryDistributionCard
 * Interactive, customizable analytics card supporting Donut and Bar graph views,
 * with dynamic filtering between Category Classifications and Document Series Types.
 */
export default function CategoryDistributionCard({
  documentsByCategory = [],
  documentsPerType = [],
  totalDocuments = 0,
}) {
  // Chart visual type: 'pie' (donut) | 'bar' (bar chart)
  const [chartType, setChartType] = useState("pie");

  // Data dimension filter: 'category' | 'type'
  const [dimension, setDimension] = useState("category");

  // Institutional high-contrast palette (zero green/emerald)
  const PALETTE = ["#6B1D2A", "#C99A2E", "#3B3638", "#8B3545", "#A87818"];

  // Prepare filtered data based on selected dimension
  const activeData = useMemo(() => {
    if (dimension === "type") {
      return (documentsPerType || []).map((item, idx) => ({
        name: item.document_type || "General Document",
        shortName: (item.document_type || "General").length > 16 
          ? `${(item.document_type || "General").slice(0, 14)}…` 
          : item.document_type,
        value: item._count?.id || 0,
        color: PALETTE[idx % PALETTE.length],
      }));
    }

    // Default: By Category
    return (documentsByCategory || []).map((cat, idx) => ({
      name: cat.category || "Unclassified",
      shortName: cat.category || "Unclassified",
      value: cat._count?.id || 0,
      color: PALETTE[idx % PALETTE.length],
    }));
  }, [dimension, documentsByCategory, documentsPerType]);

  const topDocTypes = (documentsPerType || []).slice(0, 3);

  return (
    <Card className="border border-[#E8E3E1] shadow-xs bg-[#FFFCF7] rounded-xl flex flex-col justify-between">
      {/* HEADER WITH CUSTOMIZABLE GRAPH & FILTER CONTROLS */}
      <CardHeader className="pb-3 border-b border-[#E8E3E1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F4E7EA] text-[#6B1D2A] shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-[#1D1A1B]">
                Classification & Series Distribution
              </CardTitle>
              <CardDescription className="text-[11px] text-[#5F5A5C]">
                Interactive breakdown by {dimension === "category" ? "administrative category" : "specific document series"}
              </CardDescription>
            </div>
          </div>

          {/* CONTROLS TOOLBAR */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
            {/* DIMENSION FILTER: CATEGORY VS DOCUMENT TYPE */}
            <div className="inline-flex p-0.5 bg-[#F4E7EA] rounded-lg border border-[#E8E3E1]">
              <button
                type="button"
                onClick={() => setDimension("category")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  dimension === "category"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-2xs"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                }`}
                title="Group records by Classification Category"
              >
                Categories
              </button>
              <button
                type="button"
                onClick={() => setDimension("type")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  dimension === "type"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-2xs"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                }`}
                title="Group records by Document Series Type"
              >
                Doc Types
              </button>
            </div>

            {/* GRAPH VIEW SWITCHER: DONUT VS BAR */}
            <div className="inline-flex p-0.5 bg-[#F4E7EA] rounded-lg border border-[#E8E3E1]">
              <button
                type="button"
                onClick={() => setChartType("pie")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  chartType === "pie"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-2xs"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                }`}
                title="Donut / Pie Chart View"
                aria-label="Donut Chart View"
              >
                <PieIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setChartType("bar")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  chartType === "bar"
                    ? "bg-[#6B1D2A] text-[#FFFCF7] shadow-2xs"
                    : "text-[#5F5A5C] hover:text-[#1D1A1B]"
                }`}
                title="Bar Graph View"
                aria-label="Bar Graph View"
              >
                <BarChart3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {activeData.length > 0 ? (
          <div>
            {/* VIEW 1: DONUT / PIE CHART */}
            {chartType === "pie" && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* DONUT VISUALIZATION */}
                <div className="sm:col-span-5 h-48 relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="#FFFCF7"
                        strokeWidth={2}
                      >
                        {activeData.map((entry, index) => (
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

                  {/* CENTER METRIC */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black text-[#1D1A1B] leading-none">
                      {totalDocuments}
                    </span>
                    <span className="text-[9px] font-bold text-[#5F5A5C] uppercase tracking-wider mt-0.5">
                      {dimension === "category" ? "Categorized" : "Typed"}
                    </span>
                  </div>
                </div>

                {/* SIDE LIST BREAKDOWN */}
                <div className="sm:col-span-7 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeData.map((item) => {
                    const pct = totalDocuments > 0 ? Math.round((item.value / totalDocuments) * 100) : 0;
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="font-semibold text-[#1D1A1B] truncate text-xs" title={item.name}>
                              {item.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 text-xs">
                            <span className="font-bold text-[#1D1A1B]">{item.value}</span>
                            <span className="text-[10px] text-[#5F5A5C]">({pct}%)</span>
                          </div>
                        </div>
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
            )}

            {/* VIEW 2: BAR GRAPH */}
            {chartType === "bar" && (
              <div className="h-48 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E3E1" />
                    <XAxis
                      dataKey="shortName"
                      stroke="#5F5A5C"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      stroke="#5F5A5C"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#F4E7EA" }}
                      contentStyle={{
                        backgroundColor: "#FFFCF7",
                        borderRadius: "10px",
                        border: "1px solid #E8E3E1",
                        color: "#1D1A1B",
                        fontSize: "11px",
                      }}
                      formatter={(val, name, props) => [`${val} Records`, props.payload.name]}
                    />
                    <Bar
                      dataKey="value"
                      radius={[6, 6, 0, 0]}
                    >
                      {activeData.map((entry, index) => (
                        <Cell key={`bar-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#5F5A5C]">
            No records found for current filter.
          </div>
        )}

        {/* TOP DOCUMENT SERIES STRIP */}
        {topDocTypes.length > 0 && (
          <div className="pt-3 border-t border-[#E8E3E1] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#5F5A5C] uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5 text-[#6B1D2A]" />
                <span>Highest Volume Series</span>
              </div>
              <span className="text-[10px] text-[#5F5A5C]">
                Top {topDocTypes.length} of {documentsPerType.length} total types
              </span>
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
