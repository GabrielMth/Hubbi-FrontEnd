import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

import { FormsModule, NgForm } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { ClienteDropdownDTO } from '../../dtos/clientedropdown.dto';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../auth.service';
import { TaskCreateDTO } from '../../dtos/taskcriar.dto';
import { MessagesValidFormsComponent } from "../messagesValidForms/messages-valid-forms.component";
import { MessageService, ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { TaskFilterDTO } from '../../dtos/taskfilter.dto';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TaskModel } from '../../models/task.model';
import { DetalhestaskComponent } from '../detalhestask/detalhestask.component';

@Component({
  selector: 'app-newtask',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToastModule,
    MessageModule,
    DividerModule,
    TextareaModule,
    FloatLabel,
    AutoCompleteModule,
    MessagesValidFormsComponent,
    Dialog,
    DatePicker,
    ConfirmDialog,
    DetalhestaskComponent
  ],
  providers: [MessageService, TaskService, ConfirmationService],
  templateUrl: './newtask.component.html',
  styleUrl: './newtask.component.scss'
})
export class NewtaskComponent implements OnInit {

  @ViewChild('formTask') formTask!: NgForm;
  @ViewChild('formFiltros') formFiltros!: NgForm;
  @ViewChild('tabelaTasks') tabela!: Table;
  @ViewChild('detalhesTask') detalhesTaskComponent!: DetalhestaskComponent;

  dialogDetailsTaskVisible = false;

  constructor(
    private ClienteService: ClienteService,
    private TaskService: TaskService,
    private AuthService: AuthService,
    private messageService: MessageService,
    private ConfirmationService: ConfirmationService
  ) { }


  ngOnInit(): void {
    this.ClienteService.popularDropdown().subscribe(clientes => {
      this.clientes = clientes;
      this.clientesFiltrados = clientes;
    });
  }

  novaTask = {
    titulo: '',
    descricao: '',
    prioridade: '',
    status: ''
  };

  dialogFiltroVisivel = false;

  tasksFiltradas: any[] = [];

  clientes: ClienteDropdownDTO[] = [];
  clientesFiltrados: ClienteDropdownDTO[] = [];
  clienteSelecionadoDropDownTask: any;
  clienteSelecionadoDropDownFiltro: any;
  clienteSelecionadoDropDownTaskTable: any;
  tarefaSelecionada: any;

  tasks: any[] = [];
  statusFiltrados: { label: string; value: string; }[] = [];
  propriedadesFiltradas: any[] = [];


  // Variáveis para controle de loading e total de registros na tabela de tasks
  loading: boolean = false;
  totalRecords: number = 0;

  statusOptions = [
    { label: 'Em Espera', value: 'EM_ESPERA' },
    { label: 'Em Progresso', value: 'EM_PROGRESSO' },
    { label: 'Concluído', value: 'CONCLUIDO' },
    { label: 'Em Análise', value: 'EM_ANALISE' },
    { label: 'Aprovado', value: 'APROVADO' }
  ];

  prioridades = [
    { label: 'Crítica', value: 'CRITICA', severity: 'danger' as const },
    { label: 'Alta', value: 'ALTA', severity: 'danger' as const },
    { label: 'Média', value: 'MEDIA', severity: 'warn' as const },
    { label: 'Baixa', value: 'BAIXA', severity: 'info' as const }
  ];

  getStatusColor(status: string): string {
    switch (status) {
      case 'EM_ESPERA': return '#f39c12';
      case 'EM_PROGRESSO': return '#3498db';
      case 'CONCLUIDO': return '#2ecc71';
      case 'REVISANDO': return '#ec3232';
      case 'APROVADO': return '#27c722';
      default: return '#999999';
    }
  }

  getPrioridadeColor(prioridade: string): string {
    switch (prioridade) {
      case 'CRITICA': return '#e74c3c'; // vermelho forte
      case 'ALTA': return '#e74c3c';    // laranja
      case 'MEDIA': return '#f39c12';   // amarelo
      case 'BAIXA': return '#3498db';   // azul
      default: return '#999999';
    }
  }

  getStatusLabel(status: string): string {
    if (!status) return 'Desconhecido';
    return status.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  getStatusColorByTaskId(id: number): string {
    const task = this.tasks.find(t => t.id === id) || this.tarefaSelecionada;
    if (!task) return '#999999';
    return this.getStatusColor(task.status);
  }

  getStatusLabelByTaskId(id: number): string {
    const task = this.tasks.find(t => t.id === id) || this.tarefaSelecionada;
    if (!task) return 'Desconhecido';
    return this.getStatusLabel(task.status);
  }


  getPrioridadeColorByTaskId(id: number): string {
    const task = this.tasks.find(t => t.id === id) || this.tarefaSelecionada;
    if (!task) return '#999999';
    return this.getPrioridadeColor(task.prioridade);
  }

  getPrioridadeLabelByTaskId(id: number): string {
    const task = this.tasks.find(t => t.id === id) || this.tarefaSelecionada;
    if (!task) return 'Desconhecida';
    return this.getPrioridadeLabel(task.prioridade);
  }

  getPrioridadeLabel(prioridade: string): string {
    if (!prioridade) return 'Desconhecida';
    return prioridade.toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  // filtros
  filtros: TaskFilterDTO = {};
  filtrosAplicados: TaskFilterDTO = {};
  filtroAtivo: boolean = false;

  aplicarFiltro(): void {
    this.filtros.clienteId = this.clienteSelecionadoDropDownFiltro?.id;


    if (!this.filtros.clienteId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Para usar os filtros é necessário selecionar um cliente.',
        life: 3000
      });
      return;
    }

    if (this.validarDatas()) {
      this.messageService.add({
        summary: 'Erro',
        detail: 'A data de início não pode ser maior que a data de fim.',
        life: 3000
      });
      return;
    }

    if (this.formFiltros.invalid) {
      this.messageService.add({
        summary: 'Erro',
        detail: 'Preencha os campos corretamente.',
        life: 3000
      });
      return;
    }

    this.filtroAtivo = true;
    this.filtrosAplicados = { ...this.filtros };

    const evento = {
      first: 0,
      rows: 10,
      sortField: 'dataCriacao',
      sortOrder: -1
    };

    this.carregarTasksLazy(evento);
    this.clienteSelecionadoDropDownTaskTable = this.clienteSelecionadoDropDownFiltro;
    this.formFiltros.resetForm();
    this.dialogFiltroVisivel = false;
  }

  formatStatusLabel(status: string): string {
    if (!status) return '';

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  lancarTask() {
    if (
      !this.clienteSelecionadoDropDownTask ||
      !this.novaTask.titulo ||
      !this.novaTask.descricao ||
      !this.novaTask.prioridade ||
      !this.novaTask.status ||
      this.formTask.invalid
    ) {
      this.messageService.add({
        summary: 'Erro',
        detail: 'Os campos não estão preenchidos corretamente.',
        life: 3000
      });
      return;
    }

    const novaTarefa: TaskCreateDTO = {
      titulo: this.novaTask.titulo,
      descricao: this.novaTask.descricao,
      prioridade: this.novaTask.prioridade as 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA',
      status: this.novaTask.status as 'EM_ESPERA' | 'EM_PROGRESSO' | 'CONCLUIDO' | 'EM_ANALISE' | 'APROVADO',
      clienteId: this.clienteSelecionadoDropDownTask.id,
      autorId: this.AuthService.getUsuarioId()!,
    };

    this.TaskService.criarTask(novaTarefa).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tarefa criada com sucesso!'
        });
        this.formTask.resetForm();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível criar a tarefa. Tente novamente.'
        });
      }
    });
  }


  excluirTask(id: number) {
    this.TaskService.deletarTask(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Tarefa excluída.' });
        this.carregarTasksLazy({ first: 0, rows: 10, sortField: 'dataCriacao', sortOrder: -1 });
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error?.[0]?.mensagemUsuario });
      }
    });
  }

  confirmarExclusao(task: any) {
    this.ConfirmationService.confirm({
      message: `Tem certeza que deseja excluir a tarefa "${task.titulo}"?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Excluir',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.excluirTask(task.id);
      }
    });
  }

  aoSelecionarCliente(): void {
    if (!this.clienteSelecionadoDropDownTaskTable) return;

    this.filtros = {};
    this.filtrosAplicados = {};
    this.filtroAtivo = false;

    const evento = {
      first: 0,
      rows: 10,
      sortField: 'dataCriacao',
      sortOrder: -1
    };
    this.carregarTasksLazy(evento);
  }

  carregarTasksLazy(event: any): void {
    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'dataCriacao';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.loading = true;


    if (this.filtroAtivo) {
      this.TaskService.listarTasksComFiltro(this.filtrosAplicados, page, size, sortField, sortOrder).subscribe({
        next: (res) => {
          this.tasksFiltradas = res.conteudo;
          this.totalRecords = res.totalElementos;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar tasks com filtros:', err);
          this.loading = false;
        }
      });
    } else if (this.clienteSelecionadoDropDownTaskTable) {


      this.TaskService.listarTasksPorCliente(
        this.clienteSelecionadoDropDownTaskTable.id,
        page,
        size,
        sortField,
        sortOrder
      ).subscribe({
        next: (res) => {
          this.tasksFiltradas = res.conteudo;
          this.totalRecords = res.totalElementos;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar tasks por cliente:', err);
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }

  filtrarPrioridades(event: any) {
    const query = event.query.toLowerCase();
    this.propriedadesFiltradas = this.prioridades.filter(p =>
      p.label.toLowerCase().includes(query)
    );
  }


  getPrioridadeTag(prioridadeValue: string) {
    return this.prioridades.find(p => p.value === prioridadeValue);
  }

  filtrarClientes(event: any) {
    const query = event.query.toLowerCase();

    let resultados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(query) ||
      cliente.documento.toLowerCase().includes(query)
    );

    this.clientesFiltrados = resultados.slice(0, 10);
  }


  filtrarStatus(event: any) {
    const query = event.query.toLowerCase();
    this.statusFiltrados = this.statusOptions.filter(option =>
      option.label.toLowerCase().includes(query)
    );
  }

  filtrosDataLocale = {
    firstDayOfWeek: 0,
    dayNames: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa'],
    monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    monthNamesShort: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun',
      'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'dd/mm/yy',
    weekHeader: 'Sm'
  };

  validarDatas(): boolean {
    const inicio = this.filtros.dataInicio;
    const fim = this.filtros.dataFim;

    if (inicio && fim) {
      return new Date(inicio) > new Date(fim);
    }
    return false;
  }


  selecionarTask(task: any) {
    this.TaskService.buscarDetalhesTask(task.id).subscribe({
      next: (taskDetalhada) => {
        this.tarefaSelecionada = taskDetalhada;
        this.dialogDetailsTaskVisible = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao carregar detalhes da tarefa.' });
      }
    });
  }




}


