import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, FileText, ListChecks, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Reuniao } from "@/hooks/useReunioesData";

interface ReuniaoDetailModalProps {
  reuniao: Reuniao | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReuniaoDetailModal = ({ reuniao, open, onOpenChange }: ReuniaoDetailModalProps) => {
  if (!reuniao) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            Detalhes da Reunião
          </DialogTitle>
          <DialogDescription>
            {format(new Date(reuniao.data), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Território */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Território</p>
              <p className="font-semibold">{reuniao.territorio}</p>
            </div>
          </div>

          {/* Horário */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-chart-2/10">
              <Clock className="w-4 h-4 text-chart-2" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Horário</p>
              <p className="font-semibold">{reuniao.hora || '--:--'}</p>
            </div>
          </div>

          {/* Secretário */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-info/10">
              <User className="w-4 h-4 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Secretário</p>
              <p className="font-semibold">{reuniao.secretario}</p>
            </div>
          </div>

          <Separator />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pautas</p>
                <p className="text-xl font-bold text-primary">{reuniao.totalPautas}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card">
              <div className="p-2 rounded-full bg-chart-2/10">
                <ListChecks className="w-4 h-4 text-chart-2" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Apontamentos</p>
                <p className="text-xl font-bold text-chart-2">{reuniao.totalAcoes}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};