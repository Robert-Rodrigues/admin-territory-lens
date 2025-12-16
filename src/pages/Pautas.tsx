import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGlobalFilters } from "@/contexts/GlobalFiltersContext";
import { Card } from "@/components/ui/card";
import { PautasTable } from "@/components/pautas/PautasTable";
import { PautasChart } from "@/components/pautas/PautasChart";
import { TopPautasList } from "@/components/pautas/TopPautasList";
import { usePautasData } from "@/hooks/usePautasData";
import { Loader2, AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportDialog } from "@/components/reports/ReportDialog";

const Pautas = () => {
  const { pautas, loading, error } = usePautasData();
  const { filters } = useGlobalFilters();

  // Extract unique territories
  const territorios = useMemo(() => {
    const uniqueNames = Array.from(new Set(pautas.map((p) => p.territorio))).sort();
    return uniqueNames;
  }, [pautas]);

  const filteredPautas = useMemo(() => {
    return pautas.filter((pauta) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(pauta.territorio)) {
        return false;
      }
      if (filters.dataInicio && new Date(pauta.dataReuniao) < new Date(filters.dataInicio)) {
        return false;
      }
      if (filters.dataFim && new Date(pauta.dataReuniao) > new Date(filters.dataFim)) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!pauta.descricao.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.status.length > 0) {
        const hasMatchingStatus = 
          (filters.status.includes("Pendente") && pauta.acoesPendentes > 0) ||
          (filters.status.includes("Em andamento") && pauta.acoesEmAndamento > 0) ||
          (filters.status.includes("Concluído") && pauta.acoesConcluidas > 0);
        if (!hasMatchingStatus) return false;
      }
      return true;
    });
  }, [pautas, filters]);

  if (loading) {
    return (
      <AppLayout availableTerritorios={[]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Carregando pautas...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout availableTerritorios={[]}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar pautas: {error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout availableTerritorios={territorios}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/95 backdrop-blur-md print:static print:shadow-none">
          <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 print:hidden">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  Pautas
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 ml-0 md:ml-11">
                  {filteredPautas.length} {filteredPautas.length === 1 ? 'pauta encontrada' : 'pautas encontradas'}
                </p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <ReportDialog
                  type="pautas"
                  data={filteredPautas}
                  territorios={territorios}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="space-y-4 md:space-y-6">
            {/* Charts */}
            <PautasChart pautas={filteredPautas} />

            {/* Top 10 Pautas */}
            <TopPautasList pautas={filteredPautas} />

            {/* Table Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-base font-semibold text-foreground print:text-[12pt]">
                  Lista de Pautas
                </h2>
                <span className="text-xs text-muted-foreground">
                  {filteredPautas.length} registro(s)
                </span>
              </div>
              <PautasTable pautas={filteredPautas} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Pautas;
