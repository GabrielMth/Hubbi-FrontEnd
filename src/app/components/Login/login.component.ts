import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, PasswordModule, ButtonModule, CheckboxModule, FormsModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
      },
      error: (error) => {
        // Verifica se o erro é 401 (Unauthorized)
        const mensagem = error.status === 401
          ? (error.error && error.error[0] && error.error[0].mensagemUsuario) || 'Credenciais incorretas'
          : 'Aplicação Offline';

        this.messageService.add({
          severity: 'error',
          summary: 'Acesso Negado',
          icon: 'pi pi-lock',
          detail: mensagem,
          life: 2000,
        });
      }
    });
  }



}
