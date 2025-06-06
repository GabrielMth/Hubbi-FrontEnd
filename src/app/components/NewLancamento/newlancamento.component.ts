import { Component, EventEmitter, Output, Input  } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IftaLabelModule } from 'primeng/iftalabel';
import { FloatLabel } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MessagesValidFormsComponent } from "../MessagesValidForms/messages-valid-forms.component";


@Component({
  selector: 'app-newlancamento',
  imports: [Dialog, IftaLabelModule, FloatLabel, InputGroupModule, InputGroupAddonModule,
    DividerModule, SelectModule, ButtonModule, AutoCompleteModule, FormsModule,
    InputTextModule, IconFieldModule, InputIconModule, CommonModule, TableModule,
    CardModule, TextareaModule, TagModule, ToastModule, ConfirmDialog, DatePickerModule,
    InputTextModule, NgxCurrencyDirective, MessagesValidFormsComponent],
  templateUrl: './newlancamento.component.html',
  styleUrl: './newlancamento.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class NewlancamentoComponent {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }

  pessoaSelecionada: any;
  dataVencimento: Date | undefined;
  dataRecebimento: Date | undefined;
  valor: number = 0;


  @Input() visibleDialog: boolean = false;
  @Output() closed = new EventEmitter<void>();

  pessoas: any[] = [
    { nome: 'Maria Silva', cpf: '511.948.098-55' },
    { nome: 'João Santos' },
    { nome: 'Carlos Almeida' },
    { nome: 'Ana Paula' },
    { nome: 'Maria Silva' },
    { nome: 'Maria Silva' },
    { nome: 'Maria Silva' },
  ];

  categorias =  [
    { label: 'Alimentação', value:1 },
    { label: 'Transporte',  value:2 }
  ]


  pessoasFiltradas: any[] = [];

  filtrarPessoas(event: any) {
    const query = event.query.toLowerCase();
    this.pessoasFiltradas = this.pessoas.filter(p =>
      p.nome.toLowerCase().includes(query) ||
      (p.cpf && p.cpf.toLowerCase().includes(query))
    );
  }

  fecharDialog() {
    this.closed.emit();
  }


  confirmarLancamento() {
    this.confirmationService.confirm({
      message: 'Você tem certeza que deseja realizar o lançamento?',
      header: 'Confirmar Lançamento',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Lançamento Confirmado',
          detail: 'O lançamento foi salvo com sucesso.'
        });
        // salvar os dados ou fechar o diálogo
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Ação Cancelada',
          detail: 'O lançamento não foi salvo.'
        });
      }
    });
  }

}
