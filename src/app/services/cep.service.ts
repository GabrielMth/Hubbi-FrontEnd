import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor(private http: HttpClient) { }

  pesquisarCEP(cep: string): Observable<any> {
    const cepBruto = cep.trim();
    return this.http.get<any>(`https://viacep.com.br/ws/${cepBruto}/json/`);
  }
}
