import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SharedFormModule } from '../../sharedmodules/shared-form.module';
import { Dialog } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { MessageService } from 'primeng/api';
import { AtualizarSenhaDTO } from '../../dtos/atualizar-senha.dto';
import { ToastModule } from 'primeng/toast';
import { MessagesValidFormsComponent } from '../messagesValidForms/messages-valid-forms.component';

@Component({
  selector: 'app-passwordsettings',
  imports: [SharedFormModule, Dialog, PasswordModule, ToastModule, MessagesValidFormsComponent],
  templateUrl: './passwordsettings.component.html',
  styleUrls: ['./passwordsettings.component.scss'],
  providers: [MessageService]
})
export class PasswordSettingsComponent {

  @Input() visible: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();

  @ViewChild('formSenha') formSenha!: NgForm;

  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  senhasDiferentes = false;

  constructor(
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) { }

  fechar() {
    this.visibleChange.emit(false);
    this.formSenha.resetForm();
  }

  trocarSenha(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.senhasDiferentes = false;
      return;
    }

    if (this.novaSenha !== this.confirmarSenha) {
      this.senhasDiferentes = true;
      return;
    } else {
      this.senhasDiferentes = false;
    }

    const dto: AtualizarSenhaDTO = {
      senhaAtual: this.senhaAtual,
      novaSenha: this.novaSenha,
    };

    this.usuarioService.atualizarSenha(dto).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          icon: 'pi pi-check',
          detail: 'Senha alterada com sucesso!'
        });
        this.visibleChange.emit(false);
        form.resetForm();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.[0]?.mensagemUsuario || err.message || 'Erro ao alterar senha pois a senha atual está incorreta.',
        });
      }
    });
  }
}
