import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie } from "recharts";
import { Apontamento } from "@/types/dashboard";

interface ApontamentosChartProps {
  apontamentos: Apontamento[];
}

const STATUS_COLORS = {
  'Pendente': 'hsl(var(--danger))',
  'Em andamento': 'hsl(var(--warning))',
  'Concluído': 'hsl(var(--success))',
};

export const ApontamentosChart = ({ apontamentos }: ApontamentosChartProps) => {
  // Status distribution
  const statusData = [
    { status: 'Pendente', count: apontamentos.filter(a => a.status === 'Pendente').length },
    { status: 'Em andamento', count: apontamentos.filter(a => a.status === 'Em andamento').length },
    { status: 'Concluído', count: apontamentos.filter(a => a.status === 'Concluído').length },
  ];

  // Territory analysis
  const territorioData = apontamentos.reduce((acc, a) => {
    const existing = acc.find(item => item.territorio === a.territorio);
    if (existing) {
      existing.total += 1;
      if (a.status === 'Pendente') existing.pendentes += 1;
      if (a.status === 'Em andamento') existing.emAndamento += 1;
      if (a.status === 'Concluído') existing.concluidos += 1;
    } else {
      acc.push({
        territorio: a.territorio,
        total: 1,
        pendentes: a.status === 'Pendente' ? 1 : 0,
        emAndamento: a.status === 'Em andamento' ? 1 : 0,
        concluidos: a.status === 'Concluído' ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ territorio: string; total: number; pendentes: number; emAndamento: number; concluidos: number }>);

  territorioData.sort((a, b) => b.total - a.total).slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pie Chart - Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Geral dos Apontamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.status}: ${entry.count}`}
                labelLine={{ stroke: 'hsl(var(--border))' }}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stacked Bar - Territory Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status por Território</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={territorioData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="territorio" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
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
              <Bar dataKey="concluidos" stackId="a" fill="hsl(var(--success))" name="Concluídos" />
              <Bar dataKey="emAndamento" stackId="a" fill="hsl(var(--warning))" name="Em Andamento" />
              <Bar dataKey="pendentes" stackId="a" fill="hsl(var(--danger))" name="Pendentes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
