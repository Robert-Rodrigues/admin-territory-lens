import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { Pauta } from "@/hooks/usePautasData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PautasChartProps {
  pautas: Pauta[];
}

export const PautasChart = ({ pautas }: PautasChartProps) => {
  // Group by month
  const monthlyData = pautas.reduce((acc, p) => {
    const month = format(new Date(p.dataReuniao), "MMM/yy", { locale: ptBR });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.total += 1;
      existing.pendentes += p.acoesPendentes;
      existing.emAndamento += p.acoesEmAndamento;
      existing.concluidas += p.acoesConcluidas;
    } else {
      acc.push({
        month,
        total: 1,
        pendentes: p.acoesPendentes,
        emAndamento: p.acoesEmAndamento,
        concluidas: p.acoesConcluidas,
      });
    }
    return acc;
  }, [] as Array<{ month: string; total: number; pendentes: number; emAndamento: number; concluidas: number }>);

  // Sort chronologically
  monthlyData.sort((a, b) => a.month.localeCompare(b.month));

  // Territory distribution
  const territorioData = pautas.reduce((acc, p) => {
    const existing = acc.find(item => item.territorio === p.territorio);
    if (existing) {
      existing.total += 1;
    } else {
      acc.push({
        territorio: p.territorio,
        total: 1,
      });
    }
    return acc;
  }, [] as Array<{ territorio: string; total: number }>);

  territorioData.sort((a, b) => b.total - a.total).slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Line Chart - Trends over time */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolução de Pautas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Total de Pautas"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Area Chart - Status distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status das Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="concluidas" 
                stackId="1"
                stroke="hsl(var(--success))" 
                fill="hsl(var(--success))"
                fillOpacity={0.6}
                name="Concluídas"
              />
              <Area 
                type="monotone" 
                dataKey="emAndamento" 
                stackId="1"
                stroke="hsl(var(--warning))" 
                fill="hsl(var(--warning))"
                fillOpacity={0.6}
                name="Em Andamento"
              />
              <Area 
                type="monotone" 
                dataKey="pendentes" 
                stackId="1"
                stroke="hsl(var(--danger))" 
                fill="hsl(var(--danger))"
                fillOpacity={0.6}
                name="Pendentes"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
