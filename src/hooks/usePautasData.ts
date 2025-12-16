import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Pauta {
  id: string;
  descricao: string;
  territorio: string;
  dataReuniao: string;
  totalAcoes: number;
  acoesPendentes: number;
  acoesEmAndamento: number;
  acoesConcluidas: number;
}

export const usePautasData = () => {
  const [pautas, setPautas] = useState<Pauta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPautas();
  }, []);

  const fetchPautas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: pautasData, error: pautasError } = await supabase
        .from('pautas')
        .select(`
          id_pauta,
          descricao,
          reunioes!inner(
            data,
            territorios!inner(nome)
          ),
          acoes(
            id_acao,
            status
          )
        `)
        .order('id_pauta', { ascending: false });

      if (pautasError) throw pautasError;

      // Primeiro, formatar todas as pautas
      const pautasRaw = (pautasData || []).map((p: any) => {
        const acoes = p.acoes || [];
        const acoesPendentes = acoes.filter((a: any) => 
          a.status?.toLowerCase().includes('pendente')
        ).length;
        const acoesEmAndamento = acoes.filter((a: any) => 
          a.status?.toLowerCase().includes('andamento')
        ).length;
        const acoesConcluidas = acoes.filter((a: any) => 
          a.status?.toLowerCase().includes('conclu')
        ).length;

        return {
          id: p.id_pauta.toString(),
          descricao: (p.descricao || 'Sem descrição').trim().toLowerCase(),
          descricaoOriginal: p.descricao || 'Sem descrição',
          territorio: p.reunioes?.territorios?.nome || 'Sem território',
          dataReuniao: p.reunioes?.data || '',
          totalAcoes: acoes.length,
          acoesPendentes,
          acoesEmAndamento,
          acoesConcluidas,
        };
      });

      // Deduplicar por descrição normalizada, somando os apontamentos
      const pautasMap = new Map<string, Pauta & { territorios: Set<string>; datasReuniao: string[] }>();
      
      for (const p of pautasRaw) {
        const key = p.descricao; // chave normalizada
        
        if (pautasMap.has(key)) {
          const existing = pautasMap.get(key)!;
          existing.totalAcoes += p.totalAcoes;
          existing.acoesPendentes += p.acoesPendentes;
          existing.acoesEmAndamento += p.acoesEmAndamento;
          existing.acoesConcluidas += p.acoesConcluidas;
          existing.territorios.add(p.territorio);
          if (p.dataReuniao) existing.datasReuniao.push(p.dataReuniao);
          // Manter a data mais recente
          if (p.dataReuniao && (!existing.dataReuniao || new Date(p.dataReuniao) > new Date(existing.dataReuniao))) {
            existing.dataReuniao = p.dataReuniao;
          }
        } else {
          pautasMap.set(key, {
            id: p.id,
            descricao: p.descricaoOriginal,
            territorio: p.territorio,
            dataReuniao: p.dataReuniao,
            totalAcoes: p.totalAcoes,
            acoesPendentes: p.acoesPendentes,
            acoesEmAndamento: p.acoesEmAndamento,
            acoesConcluidas: p.acoesConcluidas,
            territorios: new Set([p.territorio]),
            datasReuniao: p.dataReuniao ? [p.dataReuniao] : [],
          });
        }
      }

      // Converter Map para array e ajustar território para múltiplos
      const pautasFormatted: Pauta[] = Array.from(pautasMap.values()).map(p => ({
        id: p.id,
        descricao: p.descricao,
        territorio: p.territorios.size > 1 ? `${p.territorios.size} territórios` : p.territorio,
        dataReuniao: p.dataReuniao,
        totalAcoes: p.totalAcoes,
        acoesPendentes: p.acoesPendentes,
        acoesEmAndamento: p.acoesEmAndamento,
        acoesConcluidas: p.acoesConcluidas,
      }));

      setPautas(pautasFormatted);
    } catch (err) {
      console.error('Error fetching pautas:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar pautas');
    } finally {
      setLoading(false);
    }
  };

  return {
    pautas,
    loading,
    error,
    refetch: fetchPautas,
  };
};
