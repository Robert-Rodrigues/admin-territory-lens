import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Apontamento } from "@/types/dashboard";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

interface MetricDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metricType: "concluidos" | "emAndamento" | "pendentes" | "taxaConclusao" | null;
  apontamentos: Apontamento[];
}

export const MetricDetailModal = ({
  open,
  onOpenChange,
  metricType,
  apontamentos,
}: MetricDetailModalProps) => {
  const chartData = useMemo(() => {
    const total = apontamentos.length;
    const pendentes = apontamentos.filter((a) => a.status === "Pendente").length;
    const emAndamento = apontamentos.filter((a) => a.status === "Em andamento").length;
    const concluidos = apontamentos.filter((a) => a.status === "Concluído").length;

    // Status distribution for pie chart
    const statusData = [
      { name: "Concluídos", value: concluidos, color: "hsl(var(--success))" },
      { name: "Em Andamento", value: emAndamento, color: "hsl(var(--warning))" },
      { name: "Pendentes", value: pendentes, color: "hsl(var(--danger))" },
    ];

    // Territory distribution
    const territorioMap = new Map<string, { total: number; concluidos: number; emAndamento: number; pendentes: number }>();
    apontamentos.forEach((a) => {
      const current = territorioMap.get(a.territorio) || { total: 0, concluidos: 0, emAndamento: 0, pendentes: 0 };
      current.total++;
      if (a.status === "Concluído") current.concluidos++;
      if (a.status === "Em andamento") current.emAndamento++;
      if (a.status === "Pendente") current.pendentes++;
      territorioMap.set(a.territorio, current);
    });

    const territorioData = Array.from(territorioMap.entries())
      .map(([name, data]) => ({ name: name.substring(0, 15), ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    // Monthly evolution
    const monthlyMap = new Map<string, { concluidos: number; emAndamento: number; pendentes: number }>();
    apontamentos.forEach((a) => {
      if (!a.dataReuniao) return;
      const date = new Date(a.dataReuniao);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const current = monthlyMap.get(monthKey) || { concluidos: 0, emAndamento: 0, pendentes: 0 };
      if (a.status === "Concluído") current.concluidos++;
      if (a.status === "Em andamento") current.emAndamento++;
      if (a.status === "Pendente") current.pendentes++;
      monthlyMap.set(monthKey, current);
    });

    const monthlyData = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([month, data]) => {
        const [year, m] = month.split("-");
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        return {
          name: `${monthNames[parseInt(m) - 1]}/${year.slice(2)}`,
          ...data,
          total: data.concluidos + data.emAndamento + data.pendentes,
        };
      });

    // Calculate completion rate over time
    const completionRateData = monthlyData.map((m) => ({
      name: m.name,
      taxa: m.total > 0 ? Math.round((m.concluidos / m.total) * 100) : 0,
    }));

    // Overdue items
    const hoje = new Date();
    const vencidos = apontamentos.filter((a) => {
      if (a.status === "Concluído" || !a.prazo) return false;
      return new Date(a.prazo) < hoje;
    }).length;
    const naoVencidos = pendentes + emAndamento - vencidos;

    const deadlineData = [
      { name: "No prazo", value: naoVencidos > 0 ? naoVencidos : 0, color: "hsl(var(--success))" },
      { name: "Vencidos", value: vencidos, color: "hsl(var(--danger))" },
    ];

    return {
      statusData,
      territorioData,
      monthlyData,
      completionRateData,
      deadlineData,
      total,
      concluidos,
      emAndamento,
      pendentes,
      vencidos,
    };
  }, [apontamentos]);

  const getTitle = () => {
    switch (metricType) {
      case "concluidos":
        return "Apontamentos Concluídos";
      case "emAndamento":
        return "Apontamentos Em Andamento";
      case "pendentes":
        return "Apontamentos Pendentes";
      case "taxaConclusao":
        return "Taxa de Conclusão";
      default:
        return "";
    }
  };

  const renderChart = () => {
    switch (metricType) {
      case "concluidos":
        // Bar chart showing completed by territory
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {chartData.concluidos} apontamentos concluídos de {chartData.total} total
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.territorioData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="concluidos" name="Concluídos" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "emAndamento":
        // Area chart showing in-progress evolution
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {chartData.emAndamento} apontamentos em andamento - Evolução mensal
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.monthlyData}>
                  <defs>
                    <linearGradient id="colorEmAndamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="emAndamento"
                    name="Em Andamento"
                    stroke="hsl(var(--warning))"
                    fillOpacity={1}
                    fill="url(#colorEmAndamento)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "pendentes":
        // Pie chart showing deadline status (vencidos vs no prazo)
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {chartData.pendentes} pendentes • {chartData.vencidos} vencidos
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.deadlineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  >
                    {chartData.deadlineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case "taxaConclusao":
        // Line chart showing completion rate over time
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Evolução da taxa de conclusão ao longo do tempo</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData.completionRateData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Taxa"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="taxa"
                    name="Taxa de Conclusão"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderChart()}</div>
      </DialogContent>
    </Dialog>
  );
};
