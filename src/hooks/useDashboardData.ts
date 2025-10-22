import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Acao, Territorio } from '@/types/dashboard';

export const useDashboardData = () => {
  const [territorios, setTerritorios] = useState<Territorio[]>([]);
  const [acoes, setAcoes] = useState<Acao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch territorios
      const { data: territoriosData, error: territoriosError } = await supabase
        .from('territorios')
        .select('id_territorio, nome')
        .order('nome');

      if (territoriosError) throw territoriosError;

      const territoriosFormatted: Territorio[] = (territoriosData || []).map((t) => ({
        id: t.id_territorio.toString(),
        nome: t.nome,
      }));

      setTerritorios(territoriosFormatted);

      // Fetch reunioes with nested data
      const { data: reunioesData, error: reunioesError } = await supabase
        .from('reunioes')
        .select(`
          id_reuniao,
          data,
          territorios!inner(nome),
          pautas(
            id_pauta,
            descricao,
            acoes(
              id_acao,
              problema,
              descricao_acao,
              prazo,
              status,
              acao_responsavel(
                responsaveis(
                  nome
                )
              )
            )
          )
        `)
        .order('data', { ascending: false });

      if (reunioesError) throw reunioesError;

      // Transform data to Acao format
      const acoesFormatted: Acao[] = [];
      
      (reunioesData || []).forEach((reuniao: any) => {
        const territorioNome = reuniao.territorios?.nome || 'Sem território';
        const dataReuniao = reuniao.data;

        (reuniao.pautas || []).forEach((pauta: any) => {
          (pauta.acoes || []).forEach((acao: any) => {
            // Get all responsaveis names
            const responsaveisNomes = (acao.acao_responsavel || [])
              .map((ar: any) => ar.responsaveis?.nome)
              .filter(Boolean)
              .join(', ');

            acoesFormatted.push({
              id: acao.id_acao.toString(),
              dataReuniao: dataReuniao,
              pauta: pauta.descricao || 'Sem pauta',
              problema: acao.problema || '',
              descricao: acao.descricao_acao || '',
              solucao: '', // Not in current schema
              responsaveis: responsaveisNomes || 'Sem responsável',
              territorio: territorioNome,
              prazo: acao.prazo || '',
              status: normalizeStatus(acao.status),
            });
          });
        });
      });

      setAcoes(acoesFormatted);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status: string): 'Pendente' | 'Em andamento' | 'Concluído' => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('conclu') || statusLower === 'concluído') return 'Concluído';
    if (statusLower.includes('andamento') || statusLower === 'em andamento') return 'Em andamento';
    return 'Pendente';
  };

  return {
    territorios,
    acoes,
    loading,
    error,
    refetch: fetchDashboardData,
  };
};
