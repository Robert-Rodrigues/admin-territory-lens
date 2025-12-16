import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, FileText, ListChecks, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Reuniao } from "@/hooks/useReunioesData";
import { cn } from "@/lib/utils";
import { ReuniaoDetailModal } from "./ReuniaoDetailModal";

interface ReunioesTableProps {
  reunioes: Reuniao[];
}

const ITEMS_PER_PAGE = 7;

export const ReunioesTable = ({ reunioes }: ReunioesTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedReuniao, setSelectedReuniao] = useState<Reuniao | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sort by date descending
  const sortedReunioes = useMemo(() => {
    return [...reunioes].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [reunioes]);

  const totalPages = Math.ceil(sortedReunioes.length / ITEMS_PER_PAGE);
  const paginatedReunioes = sortedReunioes.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleReuniaoClick = (reuniao: Reuniao) => {
    setSelectedReuniao(reuniao);
    setModalOpen(true);
  };

  if (reunioes.length === 0) {
    return (
      <Card className="p-8 md:p-12 text-center border-dashed">
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-muted">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Nenhuma reunião encontrada</p>
          <p className="text-xs text-muted-foreground/70">Ajuste os filtros para ver mais resultados</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden space-y-3">
        {paginatedReunioes.map((reuniao) => (
          <Card
            key={reuniao.id}
            onClick={() => handleReuniaoClick(reuniao)}
            className={cn(
              "p-4 transition-all duration-200 cursor-pointer border-border/50",
              "hover:shadow-md hover:border-primary/30 hover:bg-accent/5",
              "active:scale-[0.99]"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-medium">
                    <MapPin className="w-3 h-3 mr-1" />
                    {reuniao.territorio}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(reuniao.data), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50 shrink-0" />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">{reuniao.hora || '--:--'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-primary">{reuniao.totalPautas}</span>
                <span className="text-muted-foreground">pautas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-chart-2" />
                <span className="font-semibold text-chart-2">{reuniao.totalAcoes}</span>
                <span className="text-muted-foreground">ações</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <Card className="overflow-hidden border-border/50">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground w-[120px]">
                  Data
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground w-[80px]">
                  Hora
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  Território
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  Secretário
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground text-center w-[100px]">
                  Pautas
                </TableHead>
                <TableHead className="font-semibold text-xs uppercase tracking-wide text-muted-foreground text-center w-[120px]">
                  Apontamentos
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReunioes.map((reuniao, index) => (
                <TableRow 
                  key={reuniao.id} 
                  onClick={() => handleReuniaoClick(reuniao)}
                  className={cn(
                    "transition-colors cursor-pointer",
                    "hover:bg-accent/50",
                    index % 2 === 0 ? "bg-transparent" : "bg-muted/20"
                  )}
                >
                  <TableCell className="font-medium text-sm">
                    {format(new Date(reuniao.data), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {reuniao.hora || '--:--'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal text-xs">
                      {reuniao.territorio}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{reuniao.secretario}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold min-w-[32px]">
                      {reuniao.totalPautas}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant="secondary" 
                      className="font-semibold min-w-[32px] bg-chart-2/10 text-chart-2 hover:bg-chart-2/20"
                    >
                      {reuniao.totalAcoes}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {currentPage * ITEMS_PER_PAGE + 1}-{Math.min((currentPage + 1) * ITEMS_PER_PAGE, sortedReunioes.length)} de {sortedReunioes.length} reuniões
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              className="gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground px-2">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="gap-1"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ReuniaoDetailModal
        reuniao={selectedReuniao}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};