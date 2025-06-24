import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  constructor(private router: Router) { }


  goToKanban() {
    this.router.navigate(['/kanban']);
  }

  goToClientes() {
    this.router.navigate(['/clientes']);
  }

  gotoTasks() {
    this.router.navigate(['/tasks']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
