export interface CommentModel {
  author: string;
  text: string;
  date: Date;
  mediaBase64?: { type: 'image' | 'video', data: string }[];
}
