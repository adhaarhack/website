import ReactECharts from "echarts-for-react";
import { AFIRecord } from "./afi.types";

export default function AFIChart({ data }: { data: AFIRecord[] }) {
  const months = [...new Set(data.map(d => d.month))];

  const series = ["EFI", "BFI", "DFI", "AFI"].map(key => ({
    name: key,
    type: "line",
    smooth: true,
    data: months.map(m =>
      data
        .filter(d => d.month === m)
        .reduce((s, d) => s + (d as any)[key], 0)
    )
  }));

  const option = {
    tooltip: { trigger: "axis" },
    legend: { data: ["EFI", "BFI", "DFI", "AFI"] },
    xAxis: { type: "category", data: months },
    yAxis: { type: "value", min: 0, max: 100 },
    series
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow border">
      <h2 className="font-semibold mb-2">Friction Trends Over Time</h2>
      <ReactECharts option={option} style={{ height: 400 }} />
    </div>
  );
}
