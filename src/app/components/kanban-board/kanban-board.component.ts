import { Component } from '@angular/core';
import { CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PanelModule } from 'primeng/panel';
import { Tag } from 'primeng/tag';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule  } from 'primeng/tooltip';



import { CommentsSectionComponent } from '../comments-section/comments-section.component';
import { TaskModel } from '../../models/task.model';
import { CommentModel } from '../../models/comment.model';

type StatusKey = 'todo' | 'doing' | 'done' | 'reviewing' | 'approved';
type Priority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  standalone: true,
  imports: [TooltipModule , CommonModule, PanelModule, DragDropModule, Tag, Dialog, ButtonModule,
    DividerModule, CommentsSectionComponent,
  ],
})
export class KanbanBoardComponent {

  expandedTasks: Record<number, boolean> = {};
  lastMovedTaskId: number | null = null;

  selectedTask: TaskModel | null = null;
  selectedTaskDialogVisible: boolean = false;
  newComment: string = '';


  statuses: { key: StatusKey; label: string }[] = [
    { key: 'todo', label: 'Em Espera' },
    { key: 'doing', label: 'Em Progresso' },
    { key: 'done', label: 'Concluído' },
    { key: 'reviewing', label: 'Em Análise' },
    { key: 'approved', label: 'Aprovado' }
  ];

  tasks: Record<StatusKey, TaskModel[]> = {
    todo: [
      {
        id: 1,
        title: 'Criar Anuncios Marca Lyor no Facebook',
        description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
        printer took a galley of type and scrambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
        Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
        printer took a galley of type and scrambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
        Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
        printer took a galley of type and scrambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
        Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown
        printer took a galley of type and scrambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
        It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
        and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
        remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem
        Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        expanded: false,
        priority: 'Alta',
        suffix: 'Autor: Renan Vaz',
        comments: [{author: 'Renan Vaz', text: 'Comentário de teste', date: new Date('2025-05-19T10:00:00') }],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
        movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      },
      {
        id: 2,
        title: 'TAREFA 2',
        description: 'Descrição da tarefa teste',
        expanded: false,
        priority: 'Média',
        suffix: 'Autor: Renan Vaz',
        comments: [],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
         movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      },
      {
        id: 3,
        title: 'TAREFA 3',
        description: 'Descrição da tarefa teste',
        expanded: false,
        priority: 'Baixa',
        suffix: 'Autor: Renan Vaz',
        comments: [],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
         movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      },
      {
        id: 4,
        title: 'TAREFA 4',
        description: 'Descrição da tarefa teste',
        expanded: false,
        priority: 'Crítica',
        suffix: 'Autor: Renan Vaz',
        comments: [],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
         movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      },
      {
        id: 5,
        title: 'TAREFA 5',
        description: 'Descrição da tarefa teste',
        expanded: false,
        priority: 'Crítica',
        suffix: 'Autor: Renan Vaz',
        comments: [],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
         movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      },
      {
        id: 6,
        title: 'TAREFA 6',
        description: 'Descrição da tarefa teste',
        expanded: false,
        priority: 'Crítica',
        suffix: 'Autor: Renan Vaz',
        comments: [],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
         movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      },
      {
        id: 7,
        title: 'TAREFA 7',
        description: 'Descrição da tarefa teste',
        expanded: false,
        priority: 'Crítica',
        suffix: 'Autor: Renan Vaz',
        comments: [],
        createdAt: new Date('2025-05-19T10:00:00'),
        createdBy: 'Renan Vaz',
         movements: [
          { from: 'todo', to: 'doing', date: new Date('2025-05-20T15:00:00'), author: 'TESTE' },
          { from: 'doing', to: 'done', date: new Date('2025-05-21T09:00:00'), author: 'TESTE' }
        ]
      }
    ],
    doing: [],
    done: [],
    reviewing: [],
    approved: [],
  };


  connectedDropListsIds = this.statuses.map(s => s.key);

  onDrop(event: CdkDragDrop<TaskModel[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.lastMovedTaskId = event.container.data[event.currentIndex].id;

    setTimeout(() => this.animateMovedTask(event.container.id), 0);
  }

  animateMovedTask(containerId: string) {
    if (this.lastMovedTaskId == null) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const taskElement = container.querySelector(`[data-task-id="${this.lastMovedTaskId}"]`) as HTMLElement;
    if (!taskElement) return;

    taskElement.classList.add('drop-animate');

    setTimeout(() => {
      taskElement.classList.remove('drop-animate');
      this.lastMovedTaskId = null;
    }, 500);
  }

  getIconForStatus(statusKey: StatusKey): string {
    switch (statusKey) {
      case 'todo': return 'pi pi-clock';
      case 'doing': return 'pi pi-spin pi-spinner-dotted';
      case 'done': return 'pi pi-check-circle';
      case 'reviewing': return 'pi pi-pause-circle';
      case 'approved': return 'pi pi-flag-fill';
      default: return '';
    }
  }


  toggleDescription(taskId: number) {
    this.expandedTasks[taskId] = !this.expandedTasks[taskId];
  }

  getPrioritySeverity(priority: Priority): 'info' | 'warn' | 'danger' | 'success' | 'secondary' | 'contrast' {
    switch (priority.toLowerCase()) {
      case 'alta': return 'danger';
      case 'média': return 'warn';
      case 'baixa': return 'info';
      case 'crítica': return 'danger';
      default: return 'info';
    }
  }

  openTaskDialog(task: TaskModel): void {
    this.selectedTask = {
      ...task,
      comments: task.comments ? [...task.comments] : []
    };
    this.selectedTaskDialogVisible = true;
  }

  getStatusLabelByTaskId(taskId: number): string {
    for (const status of this.statuses) {
      const task = this.tasks[status.key].find(t => t.id === taskId);
      if (task) return status.label;
    }
    return '';
  }

  getStatusLabel(statusKey: StatusKey): string {
    const status = this.statuses.find(s => s.key === statusKey);
    return status ? status.label : '';
  }

  getStatusColorByTaskId(taskId: number): string {
    let statusKey: StatusKey | undefined;

    for (const status of this.statuses) {
      if (this.tasks[status.key].some(t => t.id === taskId)) {
        statusKey = status.key;
        break;
      }
    }

    switch (statusKey) {
      case 'todo':
        return '#f39c12'; // Em Espera
      case 'doing':
        return '#3498db'; // Em Progresso
      case 'done':
        return '#2ecc71'; // Concluído
      case 'reviewing':
        return '#ec3232'; // Revisando
      case 'approved':
        return '#27c722'; // Aprovado
      default:
        return '#999'; // cor padrão
    }
  }

  handleNewComment(comment: CommentModel) {
    if (this.selectedTask) {
      this.selectedTask.comments = [...(this.selectedTask.comments || []), comment];

      const statusKeys = Object.keys(this.tasks) as StatusKey[];
      for (let key of statusKeys) {
        const task = this.tasks[key].find(t => t.id === this.selectedTask!.id);
        if (task) {
          task.comments = [...(task.comments || []), comment];
          break;
        }
      }
    }
  }




}
