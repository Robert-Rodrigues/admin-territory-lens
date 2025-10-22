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
import { Acao } from "@/types/dashboard";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActionTableProps {
  actions: Acao[];
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

export const ActionTable = ({ actions }: ActionTableProps) => {
  return (
    <Card className="overflow-hidden">
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
            {actions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            ) : (
              actions.map((action, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-smooth">
                  <TableCell className="font-medium">
                    {format(new Date(action.dataReuniao), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {action.territorio}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{action.pauta}</TableCell>
                  <TableCell className="max-w-xs truncate">{action.problema}</TableCell>
                  <TableCell className="text-sm">{action.responsaveis}</TableCell>
                  <TableCell>
                    {action.prazo
                      ? format(new Date(action.prazo), "dd/MM/yyyy", { locale: ptBR })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(action.status)} className="gap-1">
                      {getStatusIcon(action.status)}
                      {action.status}
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
