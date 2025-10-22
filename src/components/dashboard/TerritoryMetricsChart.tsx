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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Métricas por Território</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="territorio"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          />
          <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
          />
          <Bar
            dataKey="pendentes"
            name="Pendentes"
            fill={COLORS.pendentes}
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="emAndamento"
            name="Em Andamento"
            fill={COLORS.emAndamento}
            radius={[8, 8, 0, 0]}
          />
          <Bar
            dataKey="concluidos"
            name="Concluídos"
            fill={COLORS.concluidos}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
