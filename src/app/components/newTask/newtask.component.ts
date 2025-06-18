import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';

import { FormsModule } from '@angular/forms';

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
    AutoCompleteModule
  ],
  templateUrl: './newtask.component.html',
  styleUrl: './newtask.component.scss'
})
export class NewtaskComponent {

  clienteSelecionado: any;
  clienteFiltro: any;
  value2: string = '';

  novaTask = {
    titulo: '',
    descricao: '',
    prioridade: '',
    status: ''
  };

  tasks: any[] = [];
  statusFiltrados: string[] = [];
  clientesFiltrados: any[] = [];
  propriedadesFiltradas: any[] = [];

  statusList: string[] = ['EM ESPERA', 'EM PROGRESSO', 'CONCLUÍDO', 'EM ANÁLISE', 'APROVADO'];

  clientes = [
    { id: 1, nome: 'Empresa XPTO' },
    { id: 2, nome: 'Cliente Gabriel' },
    { id: 3, nome: 'Loja Alpha' }
  ];

  //cores dropdown
  prioridades = [
    { label: 'Crítica', value: 'Crítica', severity: 'danger' },
    { label: 'Alta', value: 'Alta', severity: 'danger' },
    { label: 'Média', value: 'Média', severity: 'warn' },
    { label: 'Baixa', value: 'Baixa', severity: 'info' }
  ];

  filtrarPrioridades(event: any) {
    const query = event.query.toLowerCase();
    this.propriedadesFiltradas = this.prioridades.filter(p =>
      p.label.toLowerCase().includes(query)
    );
  }

  filtrarClientes(event: any) {
    const query = event.query.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(query)
    );
  }


  filtrarStatus(event: any) {
    const query = event.query.toLowerCase();
    this.statusFiltrados = this.statusList.filter(status =>
      status.toLowerCase().includes(query)
    );
  }


  get tasksFiltradas() {
    if (!this.clienteFiltro) return [];
    return this.tasks.filter(task => task.clienteId === this.clienteFiltro.id);
  }

  criarTask() {
    if (!this.clienteSelecionado || !this.novaTask.titulo) return;

    const taskCriada = {
      ...this.novaTask,
      clienteId: this.clienteSelecionado.id,
      status: 'Aberta',
    };

    this.tasks.push(taskCriada);
    this.novaTask = { titulo: '', descricao: '', prioridade: '', status: '' };
  }



}
