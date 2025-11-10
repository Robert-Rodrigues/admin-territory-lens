import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HierarchicalFilters } from "@/components/hierarchical/HierarchicalFilters";
import { ReuniaoCard } from "@/components/hierarchical/ReuniaoCard";
import { useHierarchicalData } from "@/hooks/useHierarchicalData";
import { HierarchicalFilters as FilterType } from "@/types/hierarchical";
import { Eye, Filter, Loader2, AlertCircle } from "lucide-react";

const Overview = () => {
  const { reunioes, territorios, loading, error } = useHierarchicalData();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<FilterType>({});

  // Apply filters
  const filteredReunioes = useMemo(() => {
    return reunioes.filter((reuniao) => {
      // Territory filter
      if (filters.territorio && reuniao.territorio !== filters.territorio) {
        return false;
      }

      // Date range filter
      if (filters.dataInicio && reuniao.data < filters.dataInicio) {
        return false;
      }
      if (filters.dataFim && reuniao.data > filters.dataFim) {
        return false;
      }

      // Status filter - check if any apontamento has the status
      if (filters.status) {
        const hasStatus = reuniao.pautas.some(pauta =>
          pauta.apontamentos.some(apt => apt.status === filters.status)
        );
        if (!hasStatus) return false;
      }

      // Search filter - search in pautas and apontamentos
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = reuniao.pautas.some(pauta =>
          pauta.descricao.toLowerCase().includes(searchLower) ||
          pauta.apontamentos.some(apt =>
            apt.descricao.toLowerCase().includes(searchLower)
          )
        );
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [reunioes, filters]);

  const clearFilters = () => {
    setFilters({});
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Erro ao carregar dados: {error}</AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-card/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Eye className="w-7 h-7 text-primary" />
                  Visão Geral
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Acompanhamento hierárquico de reuniões, pautas e apontamentos
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Ocultar" : "Mostrar"}
              </Button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters sidebar */}
            {showFilters && (
              <aside className="lg:col-span-1">
                <HierarchicalFilters
                  filters={filters}
                  territorios={territorios}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                />
              </aside>
            )}

            {/* Reunioes list */}
            <main className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {filteredReunioes.length} reuniõ{filteredReunioes.length === 1 ? 'ão' : 'es'} encontrada{filteredReunioes.length === 1 ? '' : 's'}
                </p>
              </div>

              {filteredReunioes.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Nenhuma reunião encontrada com os filtros aplicados.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {filteredReunioes.map((reuniao) => (
                    <ReuniaoCard key={reuniao.id} reuniao={reuniao} />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Overview;
