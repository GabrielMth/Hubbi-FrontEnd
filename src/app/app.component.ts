import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';  // Importar CommonModule
import { NavbarComponent } from './components/Navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],  // Adicione CommonModule aqui
})
export class AppComponent {
  showLayout = false;

  constructor(private router: Router) {
    const hiddenRoutes = ['/login'];

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showLayout = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}
