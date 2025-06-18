import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginacaoDTO } from '../dtos/paginacao.dto';
import { Usuario } from '../models/usuario.model';
import { UsuarioCreateDTO } from '../dtos/usuario.dto';
import { AtualizarSenhaDTO } from '../dtos/atualizar-senha.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/cliente';
  private baseUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient) { }

  getUsuariosByCliente(
    clienteId: number,
    pagina: number,
    tamanho: number,
    campoOrdenacao: string,
    direcao: string
  ): Observable<PaginacaoDTO<Usuario>> {
    const params = {
      page: pagina,
      size: tamanho,
      sort: `${campoOrdenacao},${direcao}`
    };

    return this.http.get<PaginacaoDTO<Usuario>>(
      `${this.apiUrl}/${clienteId}/usuarios`, { params }
    );
  }

  criarUsuarioNoCliente(clienteId: number, dto: UsuarioCreateDTO): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/${clienteId}/usuarios`, dto);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}`);
  }


  atualizarSenha(dto: AtualizarSenhaDTO): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/senha`, dto);
  }



}
