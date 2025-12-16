import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGlobalFilters } from "@/contexts/GlobalFiltersContext";
import { ReunioesTable } from "@/components/reunioes/ReunioesTable";
import { ReunioesChart } from "@/components/reunioes/ReunioesChart";
import { useReunioesData } from "@/hooks/useReunioesData";
import { Loader2, AlertCircle, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReportDialog } from "@/components/reports/ReportDialog";

const Reunioes = () => {
  const { reunioes, territorios: allTerritorios, loading, error } = useReunioesData();
  const { filters } = useGlobalFilters();

  // Extract unique territory names for filters
  const territorioNames = useMemo(() => {
    return allTerritorios.map(t => t.nome).sort();
  }, [allTerritorios]);

  const filteredReunioes = useMemo(() => {
    return reunioes.filter((reuniao) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(reuniao.territorio)) {
        return false;
      }
      if (filters.dataInicio && new Date(reuniao.data) < new Date(filters.dataInicio)) {
        return false;
      }
      if (filters.dataFim && new Date(reuniao.data) > new Date(filters.dataFim)) {
        return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!reuniao.secretario.toLowerCase().includes(searchLower) &&
            !reuniao.territorio.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      return true;
    });
  }, [reunioes, filters]);

  if (loading) {
    return (
      <AppLayout availableTerritorios={[]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Carregando reuniões...</p>
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
            <AlertDescription>Erro ao carregar reuniões: {error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout availableTerritorios={territorioNames}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/95 backdrop-blur-md print:static print:shadow-none">
          <div className="container mx-auto px-4 sm:px-6 py-4 md:py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-primary/10 print:hidden">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  Reuniões
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground mt-1 ml-0 md:ml-11">
                  {filteredReunioes.length} {filteredReunioes.length === 1 ? 'reunião encontrada' : 'reuniões encontradas'}
                </p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <ReportDialog
                  type="reunioes"
                  data={filteredReunioes}
                  territorios={territorioNames}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 py-4 md:py-6">
          <div className="space-y-4 md:space-y-6">
            {/* Charts */}
            <ReunioesChart reunioes={filteredReunioes} territorios={allTerritorios} />

            {/* Table Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-base font-semibold text-foreground print:text-[12pt]">
                  Lista de Reuniões
                </h2>
                <span className="text-xs text-muted-foreground">
                  {filteredReunioes.length} registro(s)
                </span>
              </div>
              <ReunioesTable reunioes={filteredReunioes} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reunioes;
