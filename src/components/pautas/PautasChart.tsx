import { Card, CardContent } from "@/components/ui/card";
import { Pauta } from "@/hooks/usePautasData";
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

  // Contagem de territórios únicos
  const territoriosUnicos = new Set(pautas.map(p => p.territorio)).size;

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
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{territoriosUnicos}</p>
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
    </div>
  );
};
