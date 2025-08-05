import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { Tag } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Message } from 'primeng/message';


import { SharedFormModule } from '../../sharedmodules/shared-form.module';
import { NewclienteComponent } from '../newClient/newcliente.component'
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { Usuario } from '../../models/usuario.model';
import { CepService } from '../../services/cep.service';
import { MessagesValidFormsComponent } from '../messagesValidForms/messages-valid-forms.component';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioCreateDTO } from '../../dtos/usuario.dto';


@Component({
  standalone: true,
  selector: 'app-clientestable',
  imports: [CardModule, TableModule, Dialog, IftaLabelModule, NewclienteComponent,
    Tag, ToastModule, ConfirmPopupModule, SharedFormModule, ProgressSpinner,
    MessagesValidFormsComponent, Message],
  templateUrl: './clientestable.component.html',
  styleUrl: './clientestable.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class ClientesTableComponent {
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private clienteService: ClienteService,
    private cepService: CepService,
    private usuarioService: UsuarioService
  ) { }

  @ViewChild('form') form!: NgForm;
  @ViewChild('formUserCadastro') formUserCadastro!: NgForm;

  filtroBuscar: string = '';
  ativarDesativarCliente: boolean = false;
  visibleDialogUsers: boolean = false;
  visibleDialogDetails: boolean = false;
  dialogCadastroCliente: boolean = false;
  visibleDialogNewUsers: boolean = false;
  visibleDialogUserDetails: boolean = false;
  visibleDialogConfirmExclusao = false;

  naoEncontrado: boolean = false;

  isPessoaJuridica: boolean | null = null;
  usuarioSelecionadoParaExcluir: any = null;
  cnpjInvalido: boolean | null = null;
  cpfInvalido: boolean | null = null;
  cepInvalido: boolean | null = null;
  expanded = false;

  ultimaPaginacao: any = { first: 0, rows: 15 };


  clientes: Cliente[] = [];
  usuariosCliente: Usuario[] = [];
  renderizarTabelaUsuarios = false;
  totalRegistrosUsuarios: number = 0;
  totalRegistros: number = 0;
  carregando: boolean = false;
  carregandoUsuarios: boolean = false;
  usuarioCriado?: any;

  clienteSelecionado: Cliente = {
    nome: '',
    documento: '',
    endereco: {
      cep: '',
      bairro: '',
      cidade: '',
      estado: '',
      numero: '',
      rua: ''
    },
    celular: '',
    telefone: '',
    ativo: false
  };


  carregarClientes(event: any): void {
    this.ultimaPaginacao = event;
    this.carregando = true;

    const pagina = event.first / event.rows;
    const tamanho = event.rows;
    const campoOrdenacao = event.sortField ?? 'nome';
    const direcaoOrdenacao = event.sortOrder === 1 ? 'asc' : 'desc';

    if (this.filtroBuscar && this.filtroBuscar.trim().length > 0) {

      this.clienteService.pesquisarPorNome(this.filtroBuscar.trim(), pagina, tamanho, campoOrdenacao, direcaoOrdenacao).subscribe({
        next: (res) => {
          this.clientes = res.conteudo;
          this.totalRegistros = res.totalElementos;
          this.carregando = false;
          this.naoEncontrado = (res.totalElementos === 0);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar clientes, entre em contato com o suporte.' });
          this.carregando = false;
        }
      });
    } else {
      this.clienteService.consultarPaginado(pagina, tamanho, campoOrdenacao, direcaoOrdenacao).subscribe({
        next: (res) => {
          this.clientes = res.conteudo;
          this.totalRegistros = res.totalElementos;
          this.carregando = false;
          this.naoEncontrado = (res.totalElementos === 0);
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', life: 1000, detail: 'Não foi possível conectar ao banco de dados' });
          this.carregando = false;
        }
      });
    }
  }


  onRowDoubleClick(cliente: Cliente) {
    if (cliente.id !== undefined) {
      this.clienteService.obterPorId(cliente.id).subscribe({
        next: (clienteCompleto) => {
          this.isPessoaJuridica = clienteCompleto.documento.length > 14;
          this.clienteSelecionado = clienteCompleto;
          this.visibleDialogDetails = true;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar detalhes do cliente.' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'ID do cliente não encontrado.' });
    }
  }

  fecharDetalhesCliente() {
    this.visibleDialogDetails = false;
    this.clienteSelecionado = {
      nome: '',
      documento: '',
      endereco: {
        cep: '',
        bairro: '',
        cidade: '',
        estado: '',
        numero: '',
        rua: ''
      },
      celular: '',
      telefone: '',
      ativo: false
    };
    this.isPessoaJuridica = null;
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

  limparEndereco(): void {
    Object.assign(this.clienteSelecionado.endereco, { bairro: '', cidade: '', estado: '', rua: '', numero: '' });
  }

  onCepBlur() {
    this.cepService.pesquisarCEP(this.clienteSelecionado.endereco.cep).subscribe({
      next: (res) => {
        if (res.erro) {
          this.cepInvalido = true;
          this.limparEndereco();
        } else {
          this.cepInvalido = false;
          Object.assign(this.clienteSelecionado.endereco, {
            bairro: res.bairro,
            cidade: res.localidade,
            estado: res.uf,
            rua: res.logradouro
          });
        }
      },
      error: () => {
        this.cepInvalido = true;
        this.limparEndereco();
      }
    });
  }

  onTipoPessoaChange() {
    this.clienteSelecionado.documento = '';
  }

  onCpfCnpjBlur(event: any): void {
    const documentoBruto: string = event.target.value;
    this.clienteSelecionado.documento = documentoBruto;

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

  fecharCadastroCliente() {
    this.dialogCadastroCliente = false;
  }

  abrirUsuariosCliente(): void {
    if (!this.clienteSelecionado?.id) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Cliente não selecionado.'
      });
      return;
    }

    this.visibleDialogUsers = true;
  }



  carregarUsuariosLazy(event: any): void {
    if (!this.clienteSelecionado?.id) {
      return;
    }

    this.carregandoUsuarios = true;

    const pagina = event.first / event.rows;
    const tamanho = event.rows;
    const campoOrdenacao = event.sortField ?? 'nome';
    const direcaoOrdenacao = event.sortOrder === 1 ? 'asc' : 'desc';

    this.usuarioService.getUsuariosByCliente(
      this.clienteSelecionado.id!,
      pagina,
      tamanho,
      campoOrdenacao,
      direcaoOrdenacao
    ).subscribe({
      next: (res) => {
        this.usuariosCliente = res.conteudo;
        this.totalRegistrosUsuarios = res.totalElementos;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar usuários do cliente.'
        });
      },
      complete: () => {
        this.carregandoUsuarios = false;
      }
    });
  }

  confirmarEdicao(event: Event, form: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja salvar essas novas informações ?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Sim'
      },
      accept: () => {
        this.salvarEdicaoCliente(form);
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Informações Cliente', detail: 'Cliente não atualizado', life: 3000 });
      }
    });
  }


  salvarEdicaoCliente(form: NgForm) {
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
      id: this.clienteSelecionado.id,
      nome: form.value.nome,
      documento: this.isPessoaJuridica ? form.value.cnpj : form.value.cpf,
      celular: form.value.celular,
      telefone: form.value.telefone,
      ativo: form.value.ativo,
      endereco: {
        rua: form.value.rua,
        numero: form.value.numero,
        bairro: form.value.bairro,
        cep: form.value.cep,
        cidade: form.value.cidade,
        estado: form.value.estado
      },
      dataCadastro: this.clienteSelecionado.dataCadastro
    };

    if (this.clienteSelecionado.id !== undefined) {
      this.clienteService.atualizarCliente(this.clienteSelecionado.id, cliente).subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Cliente atualizado com sucesso.'
          });
          this.visibleDialogDetails = false;
          this.carregarClientes(this.ultimaPaginacao);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar cliente.'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Contate a equipe de Desenvolvimento.'
      });
    }
  }


  atualizarStatusCliente(event: any, cliente: Cliente) {
    const novoStatus = event.checked;

    this.confirmationService.confirm({
      target: event.originalEvent.target,
      message: `Tem certeza que deseja ${novoStatus ? 'ativar' : 'inativar'} este cliente?`,
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonProps: {
        style: { background: 'red', borderColor: 'red', color: '#fff' }
      },
      rejectButtonProps: {
        style: { background: 'gray', borderColor: 'gray', color: '#fff' }
      },
      accept: () => {
        if (cliente.id !== undefined) {
          this.clienteService.ativarInativar(cliente.id, novoStatus).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'warn',
                summary: 'Sucesso',
                detail: `Cliente ${novoStatus ? 'ativado' : 'inativado'} com sucesso.`
              });
              this.carregarClientes(this.ultimaPaginacao);
              this.visibleDialogDetails = false;
            },
            error: (err) => {
              const mensagem = err.error?.mensagemUsuario || 'Não foi possível atualizar o status do cliente.';
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: mensagem
              });
              cliente.ativo = !novoStatus;
            }
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'ID do cliente não encontrado. Não foi possível atualizar o status.'
          });
        }
      },
      reject: () => {
        cliente.ativo = !novoStatus;
      }
    });
  }

  enviarParaWhatsApp() {
    const numeroWhatsApp = '5518997287085';

    const mensagem = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
📋 *Informações do Cliente:*

  👤 ${this.clienteSelecionado.nome}

  • 📄 Documento: ${this.clienteSelecionado.documento}
  • 📱 Celular: ${this.clienteSelecionado.celular}
  • 📞 Telefone: ${this.clienteSelecionado.telefone}
 ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
*Endereço:*
  • 🛣️ Rua: ${this.clienteSelecionado.endereco.rua}
  • 🏠 Número: ${this.clienteSelecionado.endereco.numero}
  • 🏙️ Bairro: ${this.clienteSelecionado.endereco.bairro}
  • 🌆 Cidade: ${this.clienteSelecionado.endereco.cidade}
  • 📍 Estado: ${this.clienteSelecionado.endereco.estado}
  • 📬 CEP: ${this.clienteSelecionado.endereco.cep}

🔄 Status no sistema: ${this.clienteSelecionado.ativo ? '✅ ATIVO' : '🛑 INATIVO'}
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄`;

    this.messageService.add({
      severity: 'info',
      summary: 'WhatsApp',
      detail: `Se ainda não houver conversa iniciada para ${numeroWhatsApp}, envie uma para poder colar de forma automática`,
      life: 15000
    });

    const mensagemCodificada = encodeURIComponent(mensagem.trim());

    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${mensagemCodificada}`;

    window.open(url, '_blank');
  }


  getBolinhaClass(ultimoLogin: string): string {
    const loginTime = new Date(ultimoLogin).getTime();
    const now = Date.now();

    const diffInMinutes = (now - loginTime) / (1000 * 60);
    const diffInDays = (now - loginTime) / (1000 * 60 * 60 * 24);

    if (diffInMinutes <= 30) {
      return 'bolinha-verde';
    } else if (diffInDays <= 3) {
      return 'bolinha-azul';
    } else {
      return 'bolinha-vermelha';
    }
  }

  getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role.toUpperCase()) {
      case '[ADMIN]':
        return 'danger';
      case '[COLABORADOR]':
        return 'secondary';
      case '[GERENTE]':
        return 'warn';
      default:
        return 'info';
    }
  }


  abrirCadastroCliente() {
    this.dialogCadastroCliente = true;
  }

  usuarioFormulario: UsuarioCreateDTO = {
    nome: '',
    username: '',
    email: '',
    role: ''
  };

  roles = [
    { label: 'Colaborador', value: 'COLABORADOR' },
    { label: 'Gerente', value: 'GERENTE' }
  ];


  abrirCadastroUsuario() {
    this.visibleDialogNewUsers = true;
  }

  fecharCadastroUsuario() {
    this.visibleDialogNewUsers = false;
    this.usuarioFormulario = {
      nome: '',
      username: '',
      email: '',
      role: ''
    };
    this.formUserCadastro.resetForm();
  }

  cadastrarUsuario(): void {
    if (this.formUserCadastro.invalid) {
      this.formUserCadastro.form.markAllAsTouched();
      return;
    }

    if (!this.clienteSelecionado?.id) {
      this.messageService.add({ severity: 'warn', summary: 'Cliente não selecionado.' });
      return;
    }

    this.usuarioService.criarUsuarioNoCliente(this.clienteSelecionado.id, this.usuarioFormulario)
      .subscribe({
        next: (res) => {
          this.usuarioCriado = res;
          this.fecharCadastroUsuario();
          this.visibleDialogUserDetails = true;
        },
        error: (err) => {
          const mensagemErro = err?.error?.erro || 'Erro ao criar usuário.';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: mensagemErro,
            life: 5000
          });
        }
      });
  }

  fecharDetalhesUsuario(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Você tem certeza que deseja fechar essa tela?',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Sim'
      },
      accept: () => {
        this.carregarUsuariosLazy({});
        this.usuarioCriado = undefined;
        this.visibleDialogUserDetails = false;
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Ação cancelada',
          detail: 'As informações continuarão visíveis.',
          life: 3000
        });
      }
    });
  }


  abrirConfirmacaoExclusao(usuario: any): void {
    this.usuarioSelecionadoParaExcluir = usuario;
    this.visibleDialogConfirmExclusao = true;
  }


  cancelarExclusaoUsuario(): void {
    this.visibleDialogConfirmExclusao = false;
    this.usuarioSelecionadoParaExcluir = null;
  }


  confirmarExclusaoUsuarioConfirmado(): void {
    const id = this.usuarioSelecionadoParaExcluir.id;
    this.visibleDialogConfirmExclusao = false;

    this.usuarioService.excluirUsuario(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Usuário excluído com sucesso' });
        this.carregarUsuariosLazy(this.ultimaPaginacao);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro ao excluir usuário' });
      }
    });
  }

}









