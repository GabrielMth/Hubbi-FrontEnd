import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { InputIconModule } from 'primeng/inputicon';
import { NgForm } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FloatLabel } from 'primeng/floatlabel';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Message } from 'primeng/message';
import { SharedFormModule } from '../../sharedmodules/shared-form.module';


import { MessagesValidFormsComponent } from '../MessagesValidForms/messages-valid-forms.component';
import { ClientinfoComponent } from '../NewClientDetails/clientinfo.component'
import { CepService } from '../../services/cep.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';



@Component({
  selector: 'app-newcliente',
  imports: [FloatLabel, IftaLabelModule, Dialog, InputIconModule,
    ConfirmDialog, ToastModule, ClientinfoComponent,
    MessagesValidFormsComponent, Message, SharedFormModule],
  templateUrl: './newcliente.component.html',
  styleUrl: './newcliente.component.scss',
  providers: [ConfirmationService, MessageService, CepService, ClienteService]
})
export class NewclienteComponent {

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private cepService: CepService,
    private clienteService: ClienteService
  ) { }

  @ViewChild('form') form!: NgForm;

  visibleDialogDetailsClient: boolean = false;

  @Input() visibleDialogNewClient: boolean = false;

  @Output() closedCadastro = new EventEmitter<void>();

  isPessoaJuridicaDetalhe: boolean = false;
  isPessoaJuridica: boolean | null = null;
  cnpjInvalido: boolean | null = null;
  cpfInvalido: boolean | null = null;
  cepInvalido: boolean | null = null;

  clienteFormulario: Cliente = {
    nome: '',
    documento: '',
    ativo: true,
    celular: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  };

  clienteDetalhe: Cliente = {
    nome: '',
    documento: '',
    ativo: true,
    celular: '',
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  };

  fecharDialogCadastro(form: any) {
    this.closedCadastro.emit();

    form.resetForm();

    this.isPessoaJuridica = null;
    this.cpfInvalido = false;
    this.cnpjInvalido = false;
  }

  fecharDialogDetails() {
    this.visibleDialogDetailsClient = false;
  }

  onCepBlur() {
    this.cepService.pesquisarCEP(this.clienteFormulario.endereco.cep).subscribe({
      next: (res) => {
        if (res.erro) {
          this.cepInvalido = true;
          this.clienteFormulario.endereco.bairro = this.clienteFormulario.endereco.cidade = this.clienteFormulario.endereco.estado = this.clienteFormulario.endereco.rua = '';
        } else {
          this.cepInvalido = false;
          this.clienteFormulario.endereco.bairro = res.bairro;
          this.clienteFormulario.endereco.cidade = res.localidade;
          this.clienteFormulario.endereco.estado = res.uf;
          this.clienteFormulario.endereco.rua = res.logradouro;
        }
      },
      error: () => {
        this.cepInvalido = true;
        this.clienteFormulario.endereco.bairro = this.clienteFormulario.endereco.cidade = this.clienteFormulario.endereco.estado = this.clienteFormulario.endereco.rua = '';
      }
    });
  }

  validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    let soma = 0, peso = 10;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf[i]) * peso--;
    }
    let digito1 = (soma % 11 < 2) ? 0 : 11 - (soma % 11);

    soma = 0, peso = 11;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf[i]) * peso--;
    }
    let digito2 = (soma % 11 < 2) ? 0 : 11 - (soma % 11);

    return cpf[9] === digito1.toString() && cpf[10] === digito2.toString();
  }

  validarCnpj(cnpj: string): boolean {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

    let peso1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let peso2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let soma = peso1.reduce((acc, val, i) => acc + parseInt(cnpj[i]) * val, 0);
    let digito1 = (soma % 11 < 2) ? 0 : 11 - (soma % 11);

    soma = peso2.reduce((acc, val, i) => acc + parseInt(cnpj[i]) * val, 0);
    let digito2 = (soma % 11 < 2) ? 0 : 11 - (soma % 11);

    return cnpj[12] === digito1.toString() && cnpj[13] === digito2.toString();
  }

  onCpfCnpjBlur(): void {
    const documentoBruto = this.clienteFormulario.documento?.replace(/\D/g, '') || '';

    if (this.isPessoaJuridica) {
      const valido = this.validarCnpj(documentoBruto);
      this.cnpjInvalido = !valido;
      this.cpfInvalido = false;
    } else {
      const valido = this.validarCPF(documentoBruto);
      this.cpfInvalido = !valido;
      this.cnpjInvalido = false;
    }
  }

  onCpfCnpjFocus(): void {
    this.cpfInvalido = false;
    this.cnpjInvalido = false;
  }


  enviarFormulario(form: NgForm) {

    if (!form.valid) {
      this.messageService.add({
        severity: 'warn',
        icon: 'pi-bell',
        summary: 'Formulário inválido',
        detail: 'Por favor, preencha corretamente todos os campos obrigatórios com informações válidas.',
      });
      return;
    }

    if (this.cepInvalido) {
      this.messageService.add({
        severity: 'error',
        icon: 'pi-ban',
        summary: 'CEP inválido',
        detail: 'O CEP informado não existe.',
      });
      return;
    }

    if (!this.isPessoaJuridica && this.cpfInvalido) {
      this.messageService.add({
        severity: 'error',
        icon: 'pi-ban',
        summary: 'CPF incorreto',
        detail: 'O CPF informado não existe.',
      });
      return;
    }

    if (this.isPessoaJuridica && this.cnpjInvalido) {
      this.messageService.add({
        severity: 'error',
        icon: 'pi-ban',
        summary: 'CNPJ incorreto',
        detail: 'O CNPJ informado não existe.',
      });
      return;
    }


    const cliente: Cliente = {
      nome: form.value.nome,
      documento: this.isPessoaJuridica ? form.value.cnpj : form.value.cpf,
      celular: form.value.celular,
      telefone: form.value.telefone,
      ativo: true,
      endereco: {
        rua: form.value.rua,
        numero: form.value.numero,
        bairro: form.value.bairro,
        cep: form.value.cep,
        cidade: form.value.cidade,
        estado: form.value.estado
      }
    };


    this.clienteService.criar(cliente).subscribe({
      next: (res) => {
        this.clienteDetalhe = res;
        this.messageService.add({
          severity: 'success',
          icon: 'pi-thumbs-up-fill',
          summary: 'Cadastro Confirmado',
          detail: 'O cliente foi cadastrado com sucesso.',
        });
        this.isPessoaJuridicaDetalhe = this.isPessoaJuridica ?? false;
        form.resetForm();
        this.visibleDialogNewClient = false;
        this.visibleDialogDetailsClient = true;
        this.cpfInvalido = false;
        this.cnpjInvalido = false;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          icon: 'pi-thumbs-down-fill',
          summary: 'Erro ao cadastrar',
          detail: 'Ocorreu um erro ao tentar cadastrar o cliente.',
        });
      }
    });
  }



  confirmarCadastroPessoa(form: any) {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja cadastrar este cliente?',
      header: 'Confirmar cadastro',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.enviarFormulario(form);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Ação Cancelada',
          detail: 'O cadastro não foi realizado.'
        });
      }
    });
  }



}
