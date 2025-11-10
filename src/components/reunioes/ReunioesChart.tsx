import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Reuniao } from "@/hooks/useReunioesData";

interface ReunioesChartProps {
  reunioes: Reuniao[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))'];

export const ReunioesChart = ({ reunioes }: ReunioesChartProps) => {
  // Group by territory
  const territorioData = reunioes.reduce((acc, r) => {
    const existing = acc.find(item => item.territorio === r.territorio);
    if (existing) {
      existing.total += 1;
      existing.pautas += r.totalPautas;
      existing.acoes += r.totalAcoes;
    } else {
      acc.push({
        territorio: r.territorio,
        total: 1,
        pautas: r.totalPautas,
        acoes: r.totalAcoes,
      });
    }
    return acc;
  }, [] as Array<{ territorio: string; total: number; pautas: number; acoes: number }>);

  // Sort by total meetings
  territorioData.sort((a, b) => b.total - a.total);

  // Take top 8 for better visualization
  const topTerritorios = territorioData.slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Meetings by Territory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reuniões por Território</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTerritorios}>
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
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribuição de Reuniões</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topTerritorios}
                dataKey="total"
                nameKey="territorio"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.territorio}: ${entry.total}`}
                labelLine={{ stroke: 'hsl(var(--border))' }}
              >
                {topTerritorios.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
    </div>
  );
};
