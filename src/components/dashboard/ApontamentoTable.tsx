import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Apontamento } from "@/types/dashboard";
import { CheckCircle2, Circle, Clock, Calendar, MapPin, Users, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ApontamentoTableProps {
  apontamentos: Apontamento[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Concluído":
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "Em andamento":
      return <Clock className="w-4 h-4 text-warning" />;
    default:
      return <Circle className="w-4 h-4 text-danger" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Concluído":
      return "bg-success/10 text-success border-success/20";
    case "Em andamento":
      return "bg-warning/10 text-warning border-warning/20";
    default:
      return "bg-danger/10 text-danger border-danger/20";
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Concluído":
      return "default" as const;
    case "Em andamento":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

export const ApontamentoTable = ({ apontamentos }: ApontamentoTableProps) => {
  if (apontamentos.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">Nenhum apontamento encontrado</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-3">
        {apontamentos.map((apontamento, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-smooth">
            <div className="space-y-3">
              {/* Header com Status e Data */}
              <div className="flex items-start justify-between gap-2">
                <Badge 
                  className={cn("gap-1.5 font-medium", getStatusColor(apontamento.status))}
                >
                  {getStatusIcon(apontamento.status)}
                  {apontamento.status}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(apontamento.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}
                </div>
              </div>

              {/* Território */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="font-normal">
                  {apontamento.territorio}
                </Badge>
              </div>

              {/* Pauta */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Pauta</p>
                <p className="text-sm font-medium">{apontamento.pauta}</p>
              </div>

              {/* Problema */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs font-medium text-muted-foreground">Problema</p>
                </div>
                <p className="text-sm text-foreground">{apontamento.problema}</p>
              </div>

              {/* Footer com Responsáveis e Prazo */}
              <div className="pt-2 border-t flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{apontamento.responsaveis}</span>
                </div>
                {apontamento.prazo && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {format(new Date(apontamento.prazo), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop View - Table */}
      <Card className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Território</TableHead>
                <TableHead className="font-semibold">Pauta</TableHead>
                <TableHead className="font-semibold">Problema</TableHead>
                <TableHead className="font-semibold">Responsáveis</TableHead>
                <TableHead className="font-semibold">Prazo</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apontamentos.map((apontamento, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-smooth">
                  <TableCell className="font-medium">
                    {format(new Date(apontamento.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {apontamento.territorio}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{apontamento.pauta}</div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate">{apontamento.problema}</div>
                  </TableCell>
                  <TableCell>{apontamento.responsaveis}</TableCell>
                  <TableCell>
                    {apontamento.prazo
                      ? format(new Date(apontamento.prazo), "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(apontamento.status)} className="gap-1.5">
                      {getStatusIcon(apontamento.status)}
                      {apontamento.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </>
  );
};