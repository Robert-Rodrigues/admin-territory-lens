import { useState } from "react";
import { useGlobalFilters } from "@/contexts/GlobalFiltersContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Filter,
  X,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GlobalFilterBarProps {
  availableTerritorios: string[];
}

const statusOptions = [
  { value: "Pendente", label: "Pendente", icon: Circle, color: "text-red-500" },
  { value: "Em andamento", label: "Em andamento", icon: Clock, color: "text-amber-500" },
  { value: "Concluído", label: "Concluído", icon: CheckCircle2, color: "text-emerald-500" },
];

export const GlobalFilterBar = ({ availableTerritorios }: GlobalFilterBarProps) => {
  const { filters, updateFilter, clearFilters, hasActiveFilters, activeFiltersCount } = useGlobalFilters();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTerritorio = (territorio: string) => {
    const newTerritorios = filters.territorios.includes(territorio)
      ? filters.territorios.filter(t => t !== territorio)
      : [...filters.territorios, territorio];
    updateFilter("territorios", newTerritorios);
  };

  const toggleStatus = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    updateFilter("status", newStatus);
  };

  return (
    <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm print:hidden">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Compact Mode */}
        <div className="flex items-center gap-2 py-2">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="h-8 pl-8 text-xs bg-background/50 border-border/50"
            />
          </div>

          {/* Territory Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 text-xs border-border/50",
                  filters.territorios.length > 0 && "border-primary/50 bg-primary/5"
                )}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Território</span>
                {filters.territorios.length > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">
                    {filters.territorios.length}
                  </Badge>
                )}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <div className="p-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Territórios</span>
                  {filters.territorios.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter("territorios", [])}
                      className="h-6 text-[10px] px-2"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
              <ScrollArea className="h-48">
                <div className="p-2 space-y-0.5">
                  {availableTerritorios.map((territorio) => (
                    <div
                      key={territorio}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleTerritorio(territorio)}
                    >
                      <Checkbox
                        checked={filters.territorios.includes(territorio)}
                        className="h-3.5 w-3.5"
                      />
                      <span className="text-xs truncate">{territorio}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {/* Status Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 gap-1.5 text-xs border-border/50",
                  filters.status.length > 0 && "border-primary/50 bg-primary/5"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Status</span>
                {filters.status.length > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">
                    {filters.status.length}
                  </Badge>
                )}
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <div className="p-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Status</span>
                  {filters.status.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateFilter("status", [])}
                      className="h-6 text-[10px] px-2"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </div>
              <div className="p-2 space-y-0.5">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleStatus(option.value)}
                    >
                      <Checkbox
                        checked={filters.status.includes(option.value)}
                        className="h-3.5 w-3.5"
                      />
                      <Icon className={cn("w-3.5 h-3.5", option.color)} />
                      <span className="text-xs">{option.label}</span>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "h-8 gap-1.5 text-xs border-border/50",
              (filters.dataInicio || filters.dataFim) && "border-primary/50 bg-primary/5"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Período</span>
            {(filters.dataInicio || filters.dataFim) && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">
                1
              </Badge>
            )}
          </Button>

          {/* Clear All */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Limpar</span>
            </Button>
          )}

          {/* Active Filters Badge */}
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="h-5 px-1.5 text-[10px] gap-1">
              <Filter className="w-3 h-3" />
              {activeFiltersCount}
            </Badge>
          )}
        </div>

        {/* Expanded Date Range */}
        {isExpanded && (
          <div className="flex items-center gap-2 pb-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>De:</span>
              <Input
                type="date"
                value={filters.dataInicio}
                onChange={(e) => updateFilter("dataInicio", e.target.value)}
                className="h-7 w-32 text-xs bg-background/50 border-border/50"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Até:</span>
              <Input
                type="date"
                value={filters.dataFim}
                onChange={(e) => updateFilter("dataFim", e.target.value)}
                className="h-7 w-32 text-xs bg-background/50 border-border/50"
              />
            </div>
            {(filters.dataInicio || filters.dataFim) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  updateFilter("dataInicio", "");
                  updateFilter("dataFim", "");
                }}
                className="h-7 text-xs px-2"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pb-2">
            {filters.territorios.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="h-5 pl-2 pr-1 gap-1 text-[10px] cursor-pointer hover:bg-secondary/80"
                onClick={() => toggleTerritorio(t)}
              >
                {t}
                <X className="w-2.5 h-2.5" />
              </Badge>
            ))}
            {filters.status.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="h-5 pl-2 pr-1 gap-1 text-[10px] cursor-pointer hover:bg-secondary/80"
                onClick={() => toggleStatus(s)}
              >
                {s}
                <X className="w-2.5 h-2.5" />
              </Badge>
            ))}
            {filters.dataInicio && (
              <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                Desde: {filters.dataInicio}
              </Badge>
            )}
            {filters.dataFim && (
              <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                Até: {filters.dataFim}
              </Badge>
            )}
            {filters.search && (
              <Badge
                variant="secondary"
                className="h-5 pl-2 pr-1 gap-1 text-[10px] cursor-pointer hover:bg-secondary/80"
                onClick={() => updateFilter("search", "")}
              >
                "{filters.search}"
                <X className="w-2.5 h-2.5" />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
