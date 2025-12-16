import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGlobalFilters } from "@/contexts/GlobalFiltersContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ApontamentoTable } from "@/components/dashboard/ApontamentoTable";
import { ApontamentosChart } from "@/components/apontamentos/ApontamentosChart";
import { ApontamentosMetrics } from "@/components/apontamentos/ApontamentosMetrics";
import { ListChecks, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportDialog } from "@/components/reports/ReportDialog";

const Apontamentos = () => {
  const { territorios, apontamentos, loading, error } = useDashboardData();
  const { filters, hasActiveFilters } = useGlobalFilters();

  const territoriosList = useMemo(() => {
    return territorios.map(t => t.nome);
  }, [territorios]);

  const filteredApontamentos = useMemo(() => {
    return apontamentos.filter((apontamento) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(apontamento.territorio)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(apontamento.status)) {
        return false;
      }
      if (filters.dataInicio && new Date(apontamento.dataReuniao) < new Date(filters.dataInicio)) {
        return false;
      }
      if (filters.dataFim && new Date(apontamento.dataReuniao) > new Date(filters.dataFim)) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!apontamento.pauta.toLowerCase().includes(searchLower) &&
            !apontamento.problema.toLowerCase().includes(searchLower) &&
            !apontamento.responsaveis.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }, [filters, apontamentos]);

  if (loading) {
    return (
      <AppLayout availableTerritorios={[]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-primary/20 animate-ping" />
            </div>
            <p className="text-muted-foreground animate-pulse">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout availableTerritorios={[]}>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md animate-scale-in">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar dados: {error}
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout availableTerritorios={territoriosList}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/95 backdrop-blur-md print:static print:shadow-none">
          <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 print:hidden">
                    <ListChecks className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  Apontamentos
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 ml-0 md:ml-11 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    {filteredApontamentos.length}
                  </span>
                  apontamento{filteredApontamentos.length === 1 ? '' : 's'}
                  {hasActiveFilters && (
                    <span className="text-primary font-medium">(filtrado)</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <ReportDialog
                  type="apontamentos"
                  data={filteredApontamentos}
                  territorios={territoriosList}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="space-y-4 md:space-y-6">
            {/* Metrics Cards */}
            <ApontamentosMetrics apontamentos={filteredApontamentos} />

            {/* Charts */}
            <ApontamentosChart apontamentos={filteredApontamentos} />

            {/* Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-base font-semibold text-foreground print:text-[12pt] flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-primary" />
                  Lista de Apontamentos
                </h2>
                <span className="text-xs text-muted-foreground">
                  {filteredApontamentos.length} registro{filteredApontamentos.length === 1 ? '' : 's'}
                </span>
              </div>
              <ApontamentoTable apontamentos={filteredApontamentos} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Apontamentos;
