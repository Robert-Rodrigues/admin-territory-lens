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
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold text-xs sm:text-sm">Data</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Território</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Pauta</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm hidden md:table-cell">Problema</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm hidden lg:table-cell">Responsáveis</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm hidden sm:table-cell">Prazo</TableHead>
              <TableHead className="font-semibold text-xs sm:text-sm">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apontamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            ) : (
              apontamentos.map((apontamento, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-smooth">
                  <TableCell className="font-medium text-xs sm:text-sm">
                    {format(new Date(apontamento.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm">
                    <Badge variant="outline" className="font-normal text-xs">
                      {apontamento.territorio}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[150px] sm:max-w-xs truncate text-xs sm:text-sm">{apontamento.pauta}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs sm:text-sm hidden md:table-cell">{apontamento.problema}</TableCell>
                  <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{apontamento.responsaveis}</TableCell>
                  <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                    {apontamento.prazo
                      ? format(new Date(apontamento.prazo), "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(apontamento.status)} className="gap-1 text-xs">
                      {getStatusIcon(apontamento.status)}
                      <span className="hidden sm:inline">{apontamento.status}</span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
