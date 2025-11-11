import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ApontamentoTable } from "@/components/dashboard/ApontamentoTable";
import { ApontamentosChart } from "@/components/apontamentos/ApontamentosChart";
import { TerritoryFilter } from "@/components/dashboard/TerritoryFilter";
import { StatusFilter } from "@/components/dashboard/StatusFilter";
import { DashboardFilters } from "@/types/dashboard";
import { ListChecks, Filter, X, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Apontamentos = () => {
  const { territorios, apontamentos, loading, error } = useDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>({
    territorios: [],
    status: [],
  });

  const [showFilters, setShowFilters] = useState(true);

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
      if (
        filters.responsavel &&
        !apontamento.responsaveis.toLowerCase().includes(filters.responsavel.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.pauta &&
        !apontamento.pauta.toLowerCase().includes(filters.pauta.toLowerCase()) &&
        !apontamento.problema.toLowerCase().includes(filters.pauta.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [filters, apontamentos]);

  const clearAllFilters = () => {
    setFilters({
      territorios: [],
      status: [],
    });
  };

  const hasActiveFilters =
    filters.territorios.length > 0 ||
    filters.status.length > 0 ||
    filters.dataInicio ||
    filters.dataFim ||
    filters.responsavel ||
    filters.pauta;

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
            <AlertDescription>
              Erro ao carregar dados: {error}
            </AlertDescription>
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
                  <ListChecks className="w-7 h-7 text-primary" />
                  Apontamentos
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Acompanhamento de {filteredApontamentos.length} {filteredApontamentos.length === 1 ? 'ação' : 'ações'}
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

        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Sidebar - Filters */}
            {showFilters && (
              <aside className="lg:col-span-1 space-y-4">
                <Card className="p-4 shadow-md sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filtros
                    </h2>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-7 text-xs gap-1"
                      >
                        <X className="w-3 h-3" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    <TerritoryFilter
                      territorios={territorios}
                      selectedTerritorios={filters.territorios}
                      onTerritoriosChange={(territorios) =>
                        setFilters({ ...filters, territorios })
                      }
                    />

                    <Separator />

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Período</label>
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={filters.dataInicio || ""}
                          onChange={(e) =>
                            setFilters({ ...filters, dataInicio: e.target.value })
                          }
                          className="text-sm"
                        />
                        <Input
                          type="date"
                          value={filters.dataFim || ""}
                          onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <Separator />

                    <StatusFilter
                      selectedStatus={filters.status}
                      onStatusChange={(status) => setFilters({ ...filters, status })}
                    />

                    <Separator />

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Responsável</label>
                      <Input
                        type="text"
                        placeholder="Nome do responsável..."
                        value={filters.responsavel || ""}
                        onChange={(e) =>
                          setFilters({ ...filters, responsavel: e.target.value })
                        }
                        className="text-sm"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Pauta / Problema
                      </label>
                      <Input
                        type="text"
                        placeholder="Buscar..."
                        value={filters.pauta || ""}
                        onChange={(e) => setFilters({ ...filters, pauta: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </Card>
              </aside>
            )}

            {/* Main Content */}
            <main className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              <div className="space-y-6">
                {/* Charts */}
                <ApontamentosChart apontamentos={filteredApontamentos} />

                {/* Table */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Lista de Apontamentos</h2>
                  <ApontamentoTable apontamentos={filteredApontamentos} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Apontamentos;
