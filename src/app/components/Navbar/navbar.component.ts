import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { NavbarService } from '../../services/navbar.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'navbar',
  imports: [MenubarModule, ButtonModule, AvatarModule, ToastModule, CommonModule, MenuModule, TagModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  constructor(
    private navbarService: NavbarService,
    private authService: AuthService,
  ) { }

  items: MenuItem[] | undefined;
  itemsLogout: MenuItem[] | undefined;
  isAdmin = false;
  nomeUsuario: string | null = '';

  ngOnInit() {
    const roles = this.authService.getUserRoles();
    this.isAdmin = roles.includes('ADMIN');
    this.nomeUsuario = localStorage.getItem('nome');

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'Notícias',
        icon: 'pi pi-star'
      },
    ];
    if (this.isAdmin) {
      this.items.push({
        label: 'Clientes',
        command: () => this.navbarService.goToClientes(),
        icon: 'pi pi-users'
      });
    }
    if (this.isAdmin) {
      this.items.push({
        label: 'Task',
        command: () => this.navbarService.goToClientes(),
        icon: 'pi pi-ticket'
      });
    }

    this.itemsLogout = [
      {
        label: 'Trocar senha',
        icon: 'pi pi-cog'
      },
      {
        label: 'Deslogar',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  onLogoClick(): void {
    this.navbarService.goToKanban();
  }

  logout() {
    this.authService.logout();
  }

}
