import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ReunioesTable } from "@/components/reunioes/ReunioesTable";
import { ReunioesChart } from "@/components/reunioes/ReunioesChart";
import { useReunioesData } from "@/hooks/useReunioesData";
import { Loader2, AlertCircle, Calendar, X, Filter } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Reunioes = () => {
  const { reunioes, loading, error } = useReunioesData();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const filteredReunioes = useMemo(() => {
    return reunioes.filter((reuniao) => {
      const matchesSearch =
        searchTerm === "" ||
        reuniao.territorio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reuniao.secretario.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        dateFilter === "" ||
        reuniao.data.startsWith(dateFilter);

      return matchesSearch && matchesDate;
    });
  }, [reunioes, searchTerm, dateFilter]);

  if (loading) {
    return (
      <AppLayout>
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
      <AppLayout>
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
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-card/80">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Calendar className="w-7 h-7 text-primary" />
                  Reuniões
                </h1>
                <p className="text-sm text-muted-foreground mt-1.5">
                  Histórico e análise de {filteredReunioes.length} {filteredReunioes.length === 1 ? 'reunião' : 'reuniões'}
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

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <aside className="lg:col-span-1 space-y-4">
                <Card className="p-4 shadow-md sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filtros
                    </h2>
                    {(searchTerm || dateFilter) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("");
                          setDateFilter("");
                        }}
                        className="h-7 text-xs gap-1"
                      >
                        <X className="w-3 h-3" />
                        Limpar
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Buscar</label>
                      <Input
                        type="text"
                        placeholder="Território ou secretário..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mês</label>
                      <Input
                        type="month"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
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
                <ReunioesChart reunioes={filteredReunioes} />

                {/* Table */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Lista de Reuniões</h2>
                  <ReunioesTable reunioes={filteredReunioes} />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reunioes;
