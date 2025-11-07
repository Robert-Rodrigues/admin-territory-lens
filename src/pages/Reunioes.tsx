import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReunioesTable } from "@/components/reunioes/ReunioesTable";
import { useReunioesData } from "@/hooks/useReunioesData";
import { Calendar, Search, X, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Reunioes = () => {
  const { reunioes, loading, error } = useReunioesData();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

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
                  {filteredReunioes.length} {filteredReunioes.length === 1 ? 'reunião' : 'reuniões'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Filters */}
          <Card className="p-5 shadow-md">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por território ou secretário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-auto"
                />
                {(searchTerm || dateFilter) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSearchTerm("");
                      setDateFilter("");
                    }}
                    className="shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Table */}
          <ReunioesTable reunioes={filteredReunioes} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Reunioes;
