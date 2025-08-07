export interface CommentModel {
  id: number;
  autor: string;
  texto: string;
  criadoEm: Date;
  midias?: Media[];
}

export interface Media {
  tipo: 'image' | 'video' | 'file';
  url: string;
}
