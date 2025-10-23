import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MetricasTerritoriais } from "@/types/dashboard";

interface TerritoryMetricsChartProps {
  data: MetricasTerritoriais[];
}

const COLORS = {
  total: "rgb(99, 102, 241)",
  pendentes: "rgb(239, 68, 68)",
  emAndamento: "rgb(245, 158, 11)",
  concluidos: "rgb(34, 197, 94)",
};

export const TerritoryMetricsChart = ({ data }: TerritoryMetricsChartProps) => {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Métricas por Território</h3>
      <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
        <BarChart 
          data={data} 
          margin={{ top: 10, right: 10, left: 0, bottom: 80 }}
          className="sm:margin-[{top:20,right:30,left:20,bottom:60}]"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="territorio"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }}
            className="sm:text-xs"
          />
          <YAxis 
            tick={{ fill: "hsl(var(--foreground))", fontSize: 10 }} 
            className="sm:text-xs"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              fontSize: "0.75rem",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "10px", fontSize: "0.75rem" }}
            iconType="circle"
            className="sm:text-sm"
          />
          <Bar
            dataKey="pendentes"
            name="Pendentes"
            fill={COLORS.pendentes}
            radius={[4, 4, 0, 0]}
            className="sm:radius-[8,8,0,0]"
          />
          <Bar
            dataKey="emAndamento"
            name="Em Andamento"
            fill={COLORS.emAndamento}
            radius={[4, 4, 0, 0]}
            className="sm:radius-[8,8,0,0]"
          />
          <Bar
            dataKey="concluidos"
            name="Concluídos"
            fill={COLORS.concluidos}
            radius={[4, 4, 0, 0]}
            className="sm:radius-[8,8,0,0]"
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
