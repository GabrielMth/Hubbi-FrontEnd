export interface TaskCreateDTO {
  titulo: string;
  descricao: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'EM_ESPERA' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'EM_ANALISE' | 'APROVADO';
  clienteId: number;
  autorId: number;
}
