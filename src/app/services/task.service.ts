import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskCreateDTO } from '../dtos/taskcriar.dto';
import { TaskModel } from '../models/task.model';
import { PaginacaoDTO } from '../dtos/paginacao.dto';

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

}
