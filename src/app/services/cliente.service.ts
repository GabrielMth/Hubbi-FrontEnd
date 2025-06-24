import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { PaginacaoDTO } from '../dtos/paginacao.dto';
import { ClienteDropdownDTO } from '../dtos/clientedropdown.dto';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly apiUrl = 'http://localhost:8080/api/cliente';

  constructor(private http: HttpClient) { }

  criar(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  consultarPaginado(pagina: number, tamanho: number, campoOrdenacao: string, direcao: string): Observable<PaginacaoDTO<Cliente>> {
    const params = {
      page: pagina,
      size: tamanho,
      sort: `${campoOrdenacao},${direcao}`
    };
    return this.http.get<PaginacaoDTO<Cliente>>(this.apiUrl, { params });
  }

  ativarInativar(id: number, ativo: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/ativo`, ativo);
  }

  atualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${cliente.id}`, cliente);
  }

  obterPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  popularDropdown(): Observable<ClienteDropdownDTO[]> {
    return this.http.get<ClienteDropdownDTO[]>(`${this.apiUrl}/dropdown`);
  }

  pesquisarPorNome(nome: string, pagina: number, tamanho: number, campoOrdenacao: string, direcao: string): Observable<PaginacaoDTO<Cliente>> {
    const params = {
      nome,
      page: pagina,
      size: tamanho,
      sort: `${campoOrdenacao},${direcao}`
    };

    return this.http.get<PaginacaoDTO<Cliente>>(this.apiUrl, { params });
  }

}
