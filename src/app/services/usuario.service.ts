import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginacaoDTO } from '../dtos/paginacao.dto';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/api/cliente';

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



}
