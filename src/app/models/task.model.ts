// task.model.ts
import { CommentModel } from './comment.model';

export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Crítica';
export type StatusKey = 'todo' | 'doing' | 'done' | 'reviewing' | 'approved';


export interface TaskModel {
  id: number;
  title: string;
  description: string;
  expanded: boolean;
  priority: Priority;
  suffix: string;
  comments?: CommentModel[];

  createdAt?: Date;
  createdBy?: string;
  movements?: Movement[];
}

export interface Movement {
  from: StatusKey;
  to: StatusKey;
  date: Date;
  author: string;
}
