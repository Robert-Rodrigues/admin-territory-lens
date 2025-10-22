import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TerritoryFilter } from "@/components/dashboard/TerritoryFilter";
import { StatusFilter } from "@/components/dashboard/StatusFilter";
import { TerritoryMetricsChart } from "@/components/dashboard/TerritoryMetricsChart";
import { StatusDistributionChart } from "@/components/dashboard/StatusDistributionChart";
import { ActionTable } from "@/components/dashboard/ActionTable";
import { useDashboardData } from "@/hooks/useDashboardData";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { DashboardFilters, MetricasTerritoriais } from "@/types/dashboard";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { territorios, acoes, loading, error } = useDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>({
    territorios: [],
    status: [],
  });

  const [showFilters, setShowFilters] = useState(true);

  // Filter actions based on selected filters
  const filteredAcoes = useMemo(() => {
    return acoes.filter((acao) => {
      if (filters.territorios.length > 0 && !filters.territorios.includes(acao.territorio)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(acao.status)) {
        return false;
      }
      if (filters.dataInicio && new Date(acao.dataReuniao) < new Date(filters.dataInicio)) {
        return false;
      }
      if (filters.dataFim && new Date(acao.dataReuniao) > new Date(filters.dataFim)) {
        return false;
      }
      if (
        filters.responsavel &&
        !acao.responsaveis.toLowerCase().includes(filters.responsavel.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.pauta &&
        !acao.pauta.toLowerCase().includes(filters.pauta.toLowerCase()) &&
        !acao.problema.toLowerCase().includes(filters.pauta.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = filteredAcoes.length;
    const pendentes = filteredAcoes.filter((a) => a.status === "Pendente").length;
    const emAndamento = filteredAcoes.filter((a) => a.status === "Em andamento").length;
    const concluidos = filteredAcoes.filter((a) => a.status === "Concluído").length;

    return { total, pendentes, emAndamento, concluidos };
  }, [filteredAcoes]);

  // Calculate territorial metrics
  const metricasTerritoriais: MetricasTerritoriais[] = useMemo(() => {
    const territoriosAtivos =
      filters.territorios.length > 0 ? filters.territorios : territorios.map((t) => t.nome);

    return territoriosAtivos.map((territorio) => {
      const acoesDoTerritorio = filteredAcoes.filter((a) => a.territorio === territorio);
      const total = acoesDoTerritorio.length;
      const pendentes = acoesDoTerritorio.filter((a) => a.status === "Pendente").length;
      const emAndamento = acoesDoTerritorio.filter((a) => a.status === "Em andamento").length;
      const concluidos = acoesDoTerritorio.filter((a) => a.status === "Concluído").length;
      const percentualConclusao = total > 0 ? (concluidos / total) * 100 : 0;

      return {
        territorio,
        total,
        pendentes,
        emAndamento,
        concluidos,
        percentualConclusao,
      };
    });
  }, [filteredAcoes, filters.territorios, territorios]);

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    return [
      { status: "Pendente", count: metrics.pendentes },
      { status: "Em andamento", count: metrics.emAndamento },
      { status: "Concluído", count: metrics.concluidos },
    ];
  }, [metrics]);

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel de Gestão</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Visualização de métricas territoriais
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Ocultar" : "Mostrar"} Filtros
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Filters */}
          {showFilters && (
            <aside className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
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
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total de Ações"
                  value={metrics.total}
                  icon={FileText}
                  variant="default"
                />
                <MetricCard
                  title="Pendentes"
                  value={metrics.pendentes}
                  icon={Clock}
                  variant="danger"
                />
                <MetricCard
                  title="Em Andamento"
                  value={metrics.emAndamento}
                  icon={BarChart3}
                  variant="warning"
                />
                <MetricCard
                  title="Concluídos"
                  value={metrics.concluidos}
                  icon={CheckCircle2}
                  variant="success"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusDistributionChart data={statusDistribution} />
                <TerritoryMetricsChart data={metricasTerritoriais} />
              </div>

              {/* Table */}
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Ações Detalhadas</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredAcoes.length} resultado(s) encontrado(s)
                  </p>
                </div>
                <ActionTable actions={filteredAcoes} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
