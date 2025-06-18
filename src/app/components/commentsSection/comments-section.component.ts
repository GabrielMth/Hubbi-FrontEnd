import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { TextareaModule } from 'primeng/textarea';
import { FloatLabel } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';
import { CommentModel } from '../../models/comment.model';

@Component({
  standalone: true,
  selector: 'app-comments-section',
  imports: [CommonModule, FormsModule, TextareaModule, ButtonModule, DividerModule, FloatLabel, DialogModule
  ],
  templateUrl: './comments-section.component.html',
  styleUrls: ['./comments-section.component.scss']
})
export class CommentsSectionComponent {
  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;
  @Input() comments: CommentModel[] = [];
  @Output() commentAdded = new EventEmitter<CommentModel>();
  @Input() author: string = 'Desconhecido';

  newComment = '';
  mediaBase64: { type: 'image' | 'video', data: string }[] = [];
  selectedFileName: string = '';

  showViewer = false;
  viewerContent: string = '';
  viewerType: 'image' | 'video' = 'image';

  zoomed = false;

  handleMediaUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.selectedFileName = '';

    if (files && files.length > 0) {
      this.mediaBase64 = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        const type = file.type.startsWith('video') ? 'video' : 'image';

        reader.onload = () => {
          this.mediaBase64.push({ type, data: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
      this.selectedFileName = Array.from(files).map(f => f.name).join(', ');
    } else {
      this.mediaBase64 = [];
      this.selectedFileName = '';
    }
  }


  addComment(): void {
    if (this.newComment.trim()) {
      const comment: CommentModel = {
        author: this.author,
        text: this.newComment.trim(),
        date: new Date(),
        mediaBase64: this.mediaBase64.length > 0 ? [...this.mediaBase64] : undefined
      };
      this.commentAdded.emit(comment);
      this.newComment = '';
      this.mediaBase64 = [];
      this.selectedFileName = '';
      if (this.imageInput?.nativeElement) {
        this.imageInput.nativeElement.value = '';
      }
    }
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


}
