import { BarChart } from "@mui/x-charts/BarChart";

export interface StarsDatum {
  label: string;
  stars: number;
}

export interface StarsBarChartProps {
  data: StarsDatum[];
  height?: number;
}

export function StarsBarChart({ data, height = 320 }: StarsBarChartProps) {
  return (
    <BarChart
      height={height}
      xAxis={[{ scaleType: "band", data: data.map((d) => d.label) }]}
      series={[{ data: data.map((d) => d.stars), label: "Stars" }]}
    />
  );
}
