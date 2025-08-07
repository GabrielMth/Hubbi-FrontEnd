import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentModel } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private baseUrl = 'http://localhost:8080/api/tasks/comentarios';

  constructor(private http: HttpClient) { }

  getComentarios(taskId: number): Observable<CommentModel[]> {
    return this.http.get<CommentModel[]>(`${this.baseUrl}/${taskId}`);
  }

  enviarComentario(taskId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/${taskId}/add`, formData);
  }
}
