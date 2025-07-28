export interface TaskFilterDTO {
  clienteId?: number;
  titulo?: string;
  descricao?: string;
  prioridade?: string;
  status?: string;
  dataInicio?: Date;
  dataFim?: Date;

}
