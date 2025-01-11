 type ITaskStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
 type ITaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

 interface ITask {
  id: number;
  name: string;
  labels: string[];
  status: ITaskStatus;
  priority: ITaskPriority;
  assignee: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  comment: string;
}

interface IPagination { 
  total: number;
  has_next: boolean;
  page_size: number;
  offset: number;
}

export type { ITaskStatus, ITaskPriority, ITask, IPagination };