import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

export interface GlobalFilters {
  territorios: string[];
  status: string[];
  dataInicio: string;
  dataFim: string;
  search: string;
}

const defaultFilters: GlobalFilters = {
  territorios: [],
  status: [],
  dataInicio: "",
  dataFim: "",
  search: "",
};

interface GlobalFiltersContextType {
  filters: GlobalFilters;
  setFilters: (filters: GlobalFilters) => void;
  updateFilter: <K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
}

const GlobalFiltersContext = createContext<GlobalFiltersContextType | undefined>(undefined);

export const GlobalFiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);

  const updateFilter = useCallback(<K extends keyof GlobalFilters>(key: K, value: GlobalFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.territorios.length > 0 ||
      filters.status.length > 0 ||
      !!filters.dataInicio ||
      !!filters.dataFim ||
      !!filters.search
    );
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.territorios.length > 0,
      filters.status.length > 0,
      !!filters.dataInicio || !!filters.dataFim,
      !!filters.search,
    ].filter(Boolean).length;
  }, [filters]);

  return (
    <GlobalFiltersContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        clearFilters,
        hasActiveFilters,
        activeFiltersCount,
      }}
    >
      {children}
    </GlobalFiltersContext.Provider>
  );
};

export const useGlobalFilters = () => {
  const context = useContext(GlobalFiltersContext);
  if (!context) {
    throw new Error("useGlobalFilters must be used within a GlobalFiltersProvider");
  }
  return context;
};
