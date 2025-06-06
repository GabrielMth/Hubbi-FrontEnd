import { Endereco } from "./endereco.model";

export interface Cliente {
  id?: number;
  nome: string;
  documento: string;
  celular?: string;
  telefone?: string;
  ativo: boolean;
  endereco: Endereco;
  dataCadastro?: string;
}
