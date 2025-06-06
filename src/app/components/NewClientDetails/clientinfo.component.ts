import { Component, EventEmitter, Input, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientinfo',
  imports: [ButtonModule,Dialog,DividerModule,CommonModule],
  templateUrl: './clientinfo.component.html',
  styleUrl: './clientinfo.component.scss',
})
export class ClientinfoComponent{

  @Input() visibleInfoClientDialog: boolean = false;
  @Input() cliente!: Cliente;
  @Input() isPessoaJuridica: boolean = false;

  @Output() closedDialogDetails = new EventEmitter<void>();

  fecharDetails() {
    this.closedDialogDetails.emit();
  }
}
