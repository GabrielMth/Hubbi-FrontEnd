import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { CommentsSectionComponent } from '../commentsSection/comments-section.component';

@Component({
  standalone: true,
  selector: 'app-detalhestask',
  imports: [Tag, Dialog, ButtonModule, TooltipModule, CommentsSectionComponent, CommonModule],
  templateUrl: './detalhestask.component.html',
  styleUrl: './detalhestask.component.scss'
})
export class DetalhestaskComponent {

  @Input() selectedTask: any;
  @Input() getStatusColorByTaskId!: (id: number) => string;
  @Input() getStatusLabelByTaskId!: (id: number) => string;
  @Input() getStatusLabel!: (status: string) => string;


  @Input() getPrioridadeColorByTaskId!: (id: number) => string;
  @Input() getPrioridadeLabelByTaskId!: (id: number) => string;
  @Input() getPrioridadeLabel!: (prioridade: string) => string;
  @Output() commentAdded = new EventEmitter<any>();

  @Input() dialogDetailsTaskVisible!: boolean;
  @Output() dialogDetailsTaskVisibleChange = new EventEmitter<boolean>();

}
