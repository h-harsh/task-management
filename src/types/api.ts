import type { ITask, ITaskStatus  } from "./data";

 interface ITaskPage {
  size: number;
  offset: number;
}

// API Response

 interface IFetchTasksResponse {
  tasks: ITask[];
  pagination: {
    total: number;
    has_next: boolean;
    page_size: number;
    offset: number;
  };
}

interface IUpdateTaskStatusResponse {
  success: boolean;
  task?: ITask;
  message?: string;
}

interface IFetchTaskDetailsResponse {
  success: boolean;
  task: ITask;
  message?: string;
}

interface IUpdateTaskCommentResponse {
  success: boolean;
  task?: ITask;
  message?: string;
}

// API Request Payload

interface IFetchTasksRequest {
  status: ITaskStatus;
  page: ITaskPage;
}

interface IUpdateTaskStatusRequest {
  id: number;
  newStatus: string;
  comment: string;
}

interface IFetchTaskDetailsRequest {
  id: number;
}

interface IUpdateTaskCommentRequest {
  id: number;
  comment: string;
}

interface ITaskCount {
    status: ITaskStatus;
    count: number;
}

interface IFetchTaskCountResponse {
    counts: ITaskCount[];
}

interface IFetchTaskCountRequest {
    statuses: ITaskStatus[];
}

export type { ITaskPage, IFetchTasksResponse, IUpdateTaskStatusResponse, IFetchTaskDetailsResponse, IUpdateTaskCommentResponse, IFetchTasksRequest, IUpdateTaskStatusRequest, IFetchTaskDetailsRequest, IUpdateTaskCommentRequest, ITaskCount, IFetchTaskCountResponse, IFetchTaskCountRequest };