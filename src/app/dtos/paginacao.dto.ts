export interface PaginacaoDTO<T> {
  conteudo: T[];
  totalElementos: number;
  paginaAtual: number;
  totalPaginas: number;
  ultimaPagina: boolean;
  primeiraPagina: boolean;
  tamanhoPagina: number;
  elementosNaPagina: number;
}
