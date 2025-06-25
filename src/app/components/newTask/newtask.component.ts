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
import { MessageService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';

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
  ],
  providers: [MessageService],
  templateUrl: './newtask.component.html',
  styleUrl: './newtask.component.scss'
})
export class NewtaskComponent implements OnInit {

  @ViewChild('formTask') formTask!: NgForm;
  @ViewChild('tabelaTasks') tabela!: Table;

  constructor(
    private ClienteService: ClienteService,
    private TaskService: TaskService,
    private AuthService: AuthService,
    private messageService: MessageService
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
  clienteSelecionadoDropDownTaskTable: any;

  tasks: any[] = [];
  statusFiltrados: { label: string; value: string; }[] = [];
  propriedadesFiltradas: any[] = [];


  // Variáveis para controle de loading e total de registros na tabela de tasks
  loading: boolean = false;
  totalRecords: number = 0;

  //cores nos pautocomplete
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

  //cores status table
  getStatusColor(status: string): string {
    switch (status) {
      case 'EM_ESPERA':
        return '#f39c12';
      case 'EM_PROGRESSO':
        return '#3498db';
      case 'CONCLUIDO':
        return '#2ecc71';
      case 'REVISANDO':
        return '#ec3232';
      case 'APROVADO':
        return '#27c722';
      default:
        return '#999999';
    }
  }

  // filtros
  filtros = {
    cliente: null,
    titulo: '',
    prioridade: null,
    status: null,
    dataInicio: null,
    dataFim: null
  };

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

  aoSelecionarCliente(): void {
    if (!this.clienteSelecionadoDropDownTaskTable) return;

    const evento = {
      first: 0,
      rows: 10,
      sortField: 'dataCriacao',
      sortOrder: -1
    };
    this.carregarTasksLazy(evento);
  }

  carregarTasksLazy(event: any): void {
    if (!this.clienteSelecionadoDropDownTaskTable) return;

    const page = event.first / event.rows;
    const size = event.rows;
    const sortField = event.sortField || 'dataCriacao';
    const sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';

    this.loading = true;

    this.TaskService.listarTasksPorCliente(
      this.clienteSelecionadoDropDownTaskTable.id,
      page,
      size,
      sortField,
      sortOrder
    ).subscribe({
      next: (resposta) => {
        this.tasksFiltradas = resposta.conteudo;
        this.totalRecords = resposta.totalElementos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tasks:', err);
        this.loading = false;
      }
    });
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


}


