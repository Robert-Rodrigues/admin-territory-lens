import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from "recharts";
import { Pauta } from "@/hooks/usePautasData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileText, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

interface PautasChartProps {
  pautas: Pauta[];
}

export const PautasChart = ({ pautas }: PautasChartProps) => {
  // === MÉTRICAS DE PAUTAS ===
  const totalPautas = pautas.length;
  
  // === MÉTRICAS DE APONTAMENTOS (ações dentro das pautas) ===
  const totalApontamentos = pautas.reduce((acc, p) => acc + p.totalAcoes, 0);
  const apontamentosConcluidos = pautas.reduce((acc, p) => acc + p.acoesConcluidas, 0);
  const apontamentosEmAndamento = pautas.reduce((acc, p) => acc + p.acoesEmAndamento, 0);
  const apontamentosPendentes = pautas.reduce((acc, p) => acc + p.acoesPendentes, 0);
  
  // Taxa de conclusão de apontamentos
  const taxaConclusaoApontamentos = totalApontamentos > 0 ? Math.round((apontamentosConcluidos / totalApontamentos) * 100) : 0;

  // Distribuição por território (quantidade de APONTAMENTOS)
  const territorioData = pautas.reduce((acc, p) => {
    const existing = acc.find(item => item.territorio === p.territorio);
    if (existing) {
      existing.total += p.totalAcoes;
      existing.concluidos += p.acoesConcluidas;
    } else {
      acc.push({
        territorio: p.territorio,
        total: p.totalAcoes,
        concluidos: p.acoesConcluidas,
      });
    }
    return acc;
  }, [] as Array<{ territorio: string; total: number; concluidos: number }>);

  territorioData.sort((a, b) => b.total - a.total);
  const top5Territorios = territorioData.slice(0, 5);

  // Dados para gráfico de pizza - Status dos APONTAMENTOS
  const statusApontamentosData = [
    { name: 'Concluídos', value: apontamentosConcluidos, color: 'hsl(var(--success))' },
    { name: 'Em Andamento', value: apontamentosEmAndamento, color: 'hsl(var(--warning))' },
    { name: 'Pendentes', value: apontamentosPendentes, color: 'hsl(var(--danger))' },
  ].filter(item => item.value > 0);

  // Evolução de Pautas e Apontamentos por mês
  const monthlyData = pautas.reduce((acc, p) => {
    const month = format(new Date(p.dataReuniao), "MMM/yy", { locale: ptBR });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.pautas += 1;
      existing.apontamentos += p.totalAcoes;
      existing.concluidos += p.acoesConcluidas;
    } else {
      acc.push({
        month,
        pautas: 1,
        apontamentos: p.totalAcoes,
        concluidos: p.acoesConcluidas,
      });
    }
    return acc;
  }, [] as Array<{ month: string; pautas: number; apontamentos: number; concluidos: number }>);

  monthlyData.sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div className="space-y-6">
      {/* Métricas Cards - PAUTAS como foco principal */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total de Pautas - PRIMÁRIO */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Total de Pautas</p>
                <p className="text-3xl sm:text-4xl font-bold text-primary">{totalPautas}</p>
                <p className="text-xs text-muted-foreground">
                  {totalApontamentos} apontamentos no total
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apontamentos Concluídos */}
        <Card className="relative overflow-hidden border-l-4 border-l-green-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Apontamentos Concluídos</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{apontamentosConcluidos}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-green-600 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                    {taxaConclusaoApontamentos}%
                  </span>
                  <span className="text-xs text-muted-foreground">do total</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Apontamentos em Andamento */}
        <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Em Andamento</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600">{apontamentosEmAndamento}</p>
                <p className="text-xs text-muted-foreground">
                  {apontamentosPendentes} pendentes
                </p>
              </div>
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Territórios */}
        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Territórios</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{territorioData.length}</p>
                <p className="text-xs text-muted-foreground">
                  com pautas registradas
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Status dos APONTAMENTOS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Status dos Apontamentos</CardTitle>
            <p className="text-xs text-muted-foreground">Distribuição por status de conclusão</p>
          </CardHeader>
          <CardContent className="pt-0">
            {statusApontamentosData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={statusApontamentosData}
                    cx="50%"
                    cy="45%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusApontamentosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} className="outline-none focus:outline-none" style={{ outline: 'none' }} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} apontamentos`, '']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom"
                    layout="horizontal"
                    align="center"
                    formatter={(value, entry: any) => {
                      const item = statusApontamentosData.find(d => d.name === value);
                      return <span className="text-[10px] sm:text-xs">{value} ({item?.value || 0})</span>;
                    }}
                    wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }}
                    iconSize={8}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum apontamento disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gráfico de Barras - Apontamentos por Território */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Apontamentos por Território</CardTitle>
            <p className="text-xs text-muted-foreground">Top 5 territórios com mais apontamentos</p>
          </CardHeader>
          <CardContent className="pt-0">
            {top5Territorios.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={top5Territorios} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
                  <YAxis
                    dataKey="territorio"
                    type="category"
                    width={100}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'total') return [`${value} apontamentos`, 'Total'];
                      if (name === 'concluidos') return [`${value} apontamentos`, 'Concluídos'];
                      return [value, name];
                    }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={8} iconType="circle" />
                  <Bar dataKey="total" name="Total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="concluidos" name="Concluídos" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum território disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Evolução de Pautas e Apontamentos no tempo */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Evolução de Pautas e Apontamentos</CardTitle>
            <p className="text-xs text-muted-foreground">Quantidade de pautas, apontamentos e concluídos por mês</p>
          </CardHeader>
          <CardContent className="pt-0">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} iconSize={8} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="pautas"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.2}
                    name="Pautas"
                  />
                  <Area
                    type="monotone"
                    dataKey="apontamentos"
                    stroke="hsl(var(--info))"
                    fill="hsl(var(--info))"
                    fillOpacity={0.3}
                    name="Apontamentos"
                  />
                  <Area
                    type="monotone"
                    dataKey="concluidos"
                    stroke="hsl(var(--success))"
                    fill="hsl(var(--success))"
                    fillOpacity={0.5}
                    name="Concluídos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};