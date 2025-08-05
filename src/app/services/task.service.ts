import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskCreateDTO } from '../dtos/taskcriar.dto';
import { TaskModel } from '../models/task.model';
import { PaginacaoDTO } from '../dtos/paginacao.dto';
import { TaskFilterDTO } from '../dtos/taskfilter.dto';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:8080/api/tasks'

  constructor(private http: HttpClient) { }

  criarTask(task: TaskCreateDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/criar`, task);
  }

  listarTasksPorCliente(
    clienteId: number,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<PaginacaoDTO<TaskModel>> {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', `${sortField},${sortOrder}`);

    return this.http.get<PaginacaoDTO<TaskModel>>(
      `http://localhost:8080/api/tasks/${clienteId}`,
      { params }
    );
  }

  listarTasksComFiltro(
    filtros: TaskFilterDTO,
    page: number,
    size: number,
    sortField: string,
    sortOrder: string
  ): Observable<PaginacaoDTO<TaskModel>> {
    let params = new HttpParams()
      .set('clienteId', filtros.clienteId!)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', `${sortField},${sortOrder}`);

    if (filtros.titulo) params = params.set('titulo', filtros.titulo);
    if (filtros.status) params = params.set('status', filtros.status);
    if (filtros.prioridade) params = params.set('prioridade', filtros.prioridade);

    if (filtros.dataInicio) {
      const dataInicioStr = this.formatarData(filtros.dataInicio);
      params = params.set('dataInicio', dataInicioStr);
    }

    if (filtros.dataFim) {
      const dataFimStr = this.formatarData(filtros.dataFim);
      params = params.set('dataFim', dataFimStr);
    }

    return this.http.get<PaginacaoDTO<TaskModel>>(`${this.baseUrl}/filtro`, { params });
  }

  deletarTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  buscarDetalhesTask(id: number): Observable<TaskModel> {
    return this.http.get<TaskModel>(`${this.baseUrl}/detalhes/${id}`);
  }



  //formats a Date object to a string in the format 'DD/MM/YYYY'
  private formatarData(data: Date): string {
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }



}
