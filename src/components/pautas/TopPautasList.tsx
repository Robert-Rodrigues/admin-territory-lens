import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, FileText } from "lucide-react";
import type { Pauta } from "@/hooks/usePautasData";

interface TopPautasListProps {
  pautas: Pauta[];
}

export const TopPautasList = ({ pautas }: TopPautasListProps) => {
  // Ordenar por total de apontamentos (maior para menor)
  const topPautas = [...pautas]
    .sort((a, b) => b.totalAcoes - a.totalAcoes)
    .slice(0, 10);

  const getStatusColor = (pauta: Pauta) => {
    if (pauta.totalAcoes === 0) return "bg-muted text-muted-foreground";
    const percentConcluido = (pauta.acoesConcluidas / pauta.totalAcoes) * 100;
    if (percentConcluido >= 80) return "bg-chart-2/20 text-chart-2";
    if (percentConcluido >= 50) return "bg-chart-3/20 text-chart-3";
    return "bg-chart-1/20 text-chart-1";
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return "bg-amber-500/20 text-amber-600 border-amber-500/30";
    if (index === 1) return "bg-slate-400/20 text-slate-500 border-slate-400/30";
    if (index === 2) return "bg-orange-400/20 text-orange-500 border-orange-400/30";
    return "bg-muted text-muted-foreground border-border";
  };

  if (topPautas.length === 0) {
    return (
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Top 10 Pautas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm text-center py-8">
            Nenhuma pauta encontrada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm md:text-base font-semibold flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          Top 10 Pautas
          <span className="text-xs font-normal text-muted-foreground ml-auto">
            Por quantidade de apontamentos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {topPautas.map((pauta, index) => (
            <div
              key={pauta.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <Badge
                variant="outline"
                className={`min-w-[28px] h-7 flex items-center justify-center text-xs font-bold ${getRankBadge(index)}`}
              >
                {index + 1}º
              </Badge>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-foreground line-clamp-2">
                    {pauta.descricao}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1.5 ml-6">
                  <span className="text-xs text-muted-foreground">
                    {pauta.territorio}
                  </span>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="text-xs text-muted-foreground">
                    {pauta.dataReuniao ? new Date(pauta.dataReuniao).toLocaleDateString('pt-BR') : '-'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge className={`text-xs ${getStatusColor(pauta)}`}>
                  {pauta.totalAcoes} apontamentos
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="text-chart-2">{pauta.acoesConcluidas}✓</span>
                  <span className="text-chart-3">{pauta.acoesEmAndamento}◐</span>
                  <span className="text-chart-1">{pauta.acoesPendentes}○</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
