import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Reuniao {
  id: string;
  territorio: string;
  data: string;
  hora: string;
  secretario: string;
  totalPautas: number;
  totalAcoes: number;
}

export interface TerritorioInfo {
  id: string;
  nome: string;
}

export const useReunioesData = () => {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [territorios, setTerritorios] = useState<TerritorioInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all territories
      const { data: territoriosData, error: territoriosError } = await supabase
        .from('territorios')
        .select('id_territorio, nome')
        .order('nome');

      if (territoriosError) throw territoriosError;

      const territoriosFormatted: TerritorioInfo[] = (territoriosData || []).map((t: any) => ({
        id: t.id_territorio.toString(),
        nome: t.nome,
      }));

      setTerritorios(territoriosFormatted);

      // Fetch reunioes
      const { data: reunioesData, error: reunioesError } = await supabase
        .from('reunioes')
        .select(`
          id_reuniao,
          data,
          hora,
          secretario_nome,
          territorios!inner(nome),
          pautas(
            id_pauta,
            acoes(id_acao)
          )
        `)
        .order('data', { ascending: false });

      if (reunioesError) throw reunioesError;

      const reunioesFormatted: Reuniao[] = (reunioesData || []).map((r: any) => ({
        id: r.id_reuniao.toString(),
        territorio: r.territorios?.nome || 'Sem território',
        data: r.data,
        hora: r.hora || '',
        secretario: r.secretario_nome || 'Não informado',
        totalPautas: r.pautas?.length || 0,
        totalAcoes: r.pautas?.reduce((acc: number, p: any) => acc + (p.acoes?.length || 0), 0) || 0,
      }));

      setReunioes(reunioesFormatted);
    } catch (err) {
      console.error('Error fetching reunioes:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar reuniões');
    } finally {
      setLoading(false);
    }
  };

  return {
    reunioes,
    territorios,
    loading,
    error,
    refetch: fetchData,
  };
};
