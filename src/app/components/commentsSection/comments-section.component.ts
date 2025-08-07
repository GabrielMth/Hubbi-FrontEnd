import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { CommentModel } from '../../models/comment.model';
import { CommentsService } from '../../services/comments.service';
import { AuthService } from "../../auth.service";
import { HttpClient } from "@angular/common/http";
import { MessagesValidFormsComponent } from "../messagesValidForms/messages-valid-forms.component";
import { MessageService } from "primeng/api";

@Component({
  standalone: true,
  selector: 'app-comments-section',
  imports: [CommonModule, FormsModule, TextareaModule, ButtonModule, DividerModule, FloatLabel, DialogModule, MessagesValidFormsComponent],
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss']
})
export class CommentsSectionComponent {

  backendUrl = 'http://localhost:8080';

  constructor(private commentsService: CommentsService, private authService: AuthService, private httpClient: HttpClient, private messageService: MessageService) { }

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;


  @Input() taskId!: number;
  @Input() author: string = 'Desconhecido';
  @Input() comments: CommentModel[] = [];

  mediaUrls: { [key: string]: string } = {};

  isSending = false;

  ngOnInit(): void {
    this.loadComentarios();
  }

  newComment = '';
  mediaBase64: { type: 'image' | 'video', data: string }[] = [];
  selectedFiles: File[] = [];
  selectedFileName = '';

  showViewer = false;
  viewerContent = '';
  viewerType: 'image' | 'video' = 'image';
  zoomed = false;

  handleMediaUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedFileName = '';

    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);  // <-- Atualiza selectedFiles
      this.mediaBase64 = [];
      this.selectedFiles.forEach(file => {
        const reader = new FileReader();
        const type = file.type.startsWith('video') ? 'video' : 'image';

        reader.onload = () => {
          this.mediaBase64.push({ type, data: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
      this.selectedFileName = this.selectedFiles.map(f => f.name).join(', ');
    } else {
      this.selectedFiles = [];
      this.mediaBase64 = [];
      this.selectedFileName = '';
    }
  }

  loadComentarios() {
    if (!this.taskId) return;
    this.commentsService.getComentarios(this.taskId).subscribe({
      next: (data) => {
        this.comments = data.sort((a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime());
        console.log(this.comments);
      },
      error: (err) => {
        console.error('Erro ao carregar comentários', err);
      }
    });
  }


  addComment() {
    if (this.isSending) return;

    const textoTrimmed = this.newComment.trim();

    if (this.selectedFiles.length === 0 && textoTrimmed.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Digite um comentário ou selecione pelo menos uma mídia'
      });
      return;
    }

    const usuarioId = this.authService.getUsuarioId();
    if (!usuarioId) {
      alert('Usuário não autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('texto', textoTrimmed.length > 0 ? textoTrimmed : '');
    formData.append('usuarioId', usuarioId.toString());

    this.selectedFiles.forEach(file => {
      formData.append('midia', file, file.name);
    });

    this.isSending = true;

    this.commentsService.enviarComentario(this.taskId, formData)
      .subscribe({
        next: () => {
          this.isSending = false;
          this.newComment = '';
          this.selectedFiles = [];
          this.selectedFileName = '';
          this.mediaBase64 = [];
          this.loadComentarios();

          if (this.imageInput) {
            this.imageInput.nativeElement.value = '';
          }
        },
        error: (err) => {
          this.isSending = false;
          console.error('Erro ao enviar comentário', err);
          alert('Erro ao enviar comentário');
        }
      });
  }



  openViewer(data: string, type: 'image' | 'video') {
    this.viewerContent = data;
    this.viewerType = type;
    this.showViewer = true;
  }

  openFullscreen(element: HTMLElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen(); // Safari
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen(); // IE11
    }
  }


  getFullMediaUrl(url: string): string {
    if (url.startsWith('http')) {
      return url;
    }
    return this.backendUrl + (url.startsWith('/') ? '' : '/') + url;
  }

  getFileDisplayName(fullUrl: string): string {
    if (!fullUrl) return 'Arquivo';


    const fileName = fullUrl.split('/').pop() || '';


    const parts = fileName.split('_');
    if (parts.length > 1) {
      return parts.slice(1).join('_');
    }

    return fileName;
  }

  getDownloadUrl(url: string): string {
    const fileName = url.split('/').pop();
    return `http://localhost:8080/api/tasks/comentarios/download/${fileName}`;
  }


}
