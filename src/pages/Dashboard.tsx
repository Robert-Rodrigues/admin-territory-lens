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
import {
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  X,
} from "lucide-react";
import { DashboardFilters, Acao, Territorio, MetricasTerritoriais } from "@/types/dashboard";

// Mock data - replace with real API calls
const mockTerritorios: Territorio[] = [
  { id: "1", nome: "Norte" },
  { id: "2", nome: "Sul" },
  { id: "3", nome: "Leste" },
  { id: "4", nome: "Oeste" },
  { id: "5", nome: "Centro" },
];

const mockAcoes: Acao[] = [
  {
    id: "1",
    dataReuniao: "2025-01-15",
    pauta: "Infraestrutura",
    problema: "Manutenção de estradas",
    descricao: "Realizar manutenção preventiva",
    solucao: "Contratar equipe especializada",
    responsaveis: "João Silva, Maria Santos",
    territorio: "Norte",
    prazo: "2025-02-15",
    status: "Em andamento",
  },
  {
    id: "2",
    dataReuniao: "2025-01-10",
    pauta: "Educação",
    problema: "Falta de materiais escolares",
    descricao: "Aquisição de materiais",
    solucao: "Processo licitatório",
    responsaveis: "Pedro Costa",
    territorio: "Sul",
    prazo: "2025-03-01",
    status: "Pendente",
  },
  {
    id: "3",
    dataReuniao: "2025-01-20",
    pauta: "Saúde",
    problema: "Falta de medicamentos",
    descricao: "Reabastecer farmácia básica",
    solucao: "Compra emergencial",
    responsaveis: "Ana Lima",
    territorio: "Leste",
    prazo: "2025-01-25",
    status: "Concluído",
  },
  {
    id: "4",
    dataReuniao: "2025-01-18",
    pauta: "Segurança",
    problema: "Iluminação pública deficiente",
    descricao: "Instalação de novos postes",
    solucao: "Parceria com concessionária",
    responsaveis: "Carlos Mendes",
    territorio: "Oeste",
    prazo: "2025-02-28",
    status: "Em andamento",
  },
  {
    id: "5",
    dataReuniao: "2025-01-12",
    pauta: "Meio Ambiente",
    problema: "Coleta de lixo irregular",
    descricao: "Melhorar frequência de coleta",
    solucao: "Contratar mais caminhões",
    responsaveis: "Fernanda Oliveira",
    territorio: "Centro",
    prazo: "2025-02-10",
    status: "Pendente",
  },
];

const Dashboard = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    territorios: [],
    status: [],
  });

  const [showFilters, setShowFilters] = useState(true);

  // Filter actions based on selected filters
  const filteredAcoes = useMemo(() => {
    return mockAcoes.filter((acao) => {
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
      filters.territorios.length > 0 ? filters.territorios : mockTerritorios.map((t) => t.nome);

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
  }, [filteredAcoes, filters.territorios]);

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
                    territorios={mockTerritorios}
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
