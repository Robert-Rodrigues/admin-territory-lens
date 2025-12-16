import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Reuniao, TerritorioInfo } from "@/hooks/useReunioesData";
import { Users, TrendingUp, Calendar, FileText, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ReunioesChartProps {
  reunioes: Reuniao[];
  territorios: TerritorioInfo[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-xl p-3 min-w-[140px]">
        <p className="font-semibold text-sm text-foreground mb-2 border-b border-border pb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 py-1">
            <span className="text-xs text-muted-foreground">{entry.name}:</span>
            <span className="text-sm font-bold" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">Clique para ver detalhes</p>
      </div>
    );
  }
  return null;
};


export const ReunioesChart = ({ reunioes, territorios }: ReunioesChartProps) => {
  const [selectedTerritorio, setSelectedTerritorio] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create data for all territories, including those without meetings
  const chartData = territorios.map(t => {
    const reunioesDoTerritorio = reunioes.filter(r => r.territorio === t.nome);
    const total = reunioesDoTerritorio.length;
    const pautas = reunioesDoTerritorio.reduce((acc, r) => acc + r.totalPautas, 0);
    const acoes = reunioesDoTerritorio.reduce((acc, r) => acc + r.totalAcoes, 0);
    
    return {
      territorio: t.nome,
      shortName: t.nome.length > 12 ? t.nome.substring(0, 10) + '...' : t.nome,
      total,
      pautas,
      acoes,
    };
  }).sort((a, b) => b.total - a.total);

  const selectedReunioes = selectedTerritorio 
    ? reunioes.filter(r => r.territorio === selectedTerritorio).sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      )
    : [];

  const handleBarClick = (data: any) => {
    if (data && data.territorio) {
      setSelectedTerritorio(data.territorio);
      setIsModalOpen(true);
    }
  };

  if (territorios.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhum território encontrado</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm md:text-base font-semibold">Reuniões por Território</CardTitle>
              <CardDescription className="text-xs">Todos os {territorios.length} territórios • Clique para detalhes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-2 md:px-6 pb-4">
          <div className="w-full h-[320px] md:h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 10, left: -10, bottom: 90 }}
                barCategoryGap="8%"
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} vertical={false} />
                <XAxis 
                  dataKey="shortName" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }}
                  angle={-55}
                  textAnchor="end"
                  height={90}
                  interval={0}
                  tickLine={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} 
                  tickLine={false}
                  axisLine={false}
                  width={35}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }} />
                <Bar 
                  dataKey="total" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]} 
                  name="Reuniões"
                  maxBarSize={40}
                  onClick={handleBarClick}
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.total === 0 ? 'hsl(var(--muted))' : 'url(#barGradient)'}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                  <LabelList 
                    dataKey="total" 
                    position="top" 
                    fill="hsl(var(--foreground))"
                    fontSize={10}
                    fontWeight={600}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Território */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-3 border-b">
            <DialogTitle className="flex items-center gap-2 text-base">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              {selectedTerritorio}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-3">
            {selectedReunioes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma reunião registrada</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  {selectedReunioes.length} {selectedReunioes.length === 1 ? 'reunião' : 'reuniões'}
                </p>
                {selectedReunioes.map((reuniao) => (
                  <div 
                    key={reuniao.id} 
                    className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {format(new Date(reuniao.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>
                      {reuniao.hora && (
                        <span className="text-xs text-muted-foreground">{reuniao.hora}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Secretário: {reuniao.secretario}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="w-3 h-3" />
                        {reuniao.totalPautas} {reuniao.totalPautas === 1 ? 'pauta' : 'pautas'}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CheckSquare className="w-3 h-3" />
                        {reuniao.totalAcoes} {reuniao.totalAcoes === 1 ? 'ação' : 'ações'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};