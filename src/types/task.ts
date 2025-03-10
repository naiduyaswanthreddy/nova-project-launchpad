
export type Priority = 'high' | 'medium' | 'low';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  dueDate?: Date;
  tags: Tag[];
  createdAt: Date;
}
