import type {
    ITask,
    ITaskPage, 
    IFetchTasksResponse,
    IUpdateTaskStatusResponse, 
    IUpdateTaskStatusRequest, 
    IFetchTaskDetailsRequest, 
    IFetchTaskDetailsResponse, 
    IUpdateTaskCommentRequest, 
    IUpdateTaskCommentResponse 
} from '../types';

import mockData from './smallData.json';

const tasks: ITask[] = mockData.tasks as ITask[];

// Fetch Task Data for Table
function fetchTasks({ status = "OPEN", page = { size: 100, offset: 0 } }: { status: string, page: ITaskPage }): Promise<IFetchTasksResponse> {
    return new Promise((resolve) => {
        const filteredTasks = tasks.filter(task => task.status === status);
        const paginatedTasks = filteredTasks.slice(
            page.offset,
            page.offset + page.size
        );
        resolve({
            tasks: paginatedTasks,
            pagination: {
                total: filteredTasks.length,
                has_next: page.offset + page.size < filteredTasks.length,
                page_size: page.size,
                offset: page.offset,
            },
        });
    });
}

// Update Task Status with Comment
function updateTaskStatus({ id, newStatus, comment }: IUpdateTaskStatusRequest): Promise<IUpdateTaskStatusResponse> {
    return new Promise((resolve, reject) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            if (!comment || comment.trim() === "") {
                reject(new Error("Comment is required to update the status."));
                return;
            }

            tasks[taskIndex].status = newStatus as ITask['status'];
            tasks[taskIndex].comment = comment;
            tasks[taskIndex].updated_at = new Date().toISOString();

            resolve({ success: true, task: tasks[taskIndex] });
        } else {
            reject(new Error("Task not found."));
        }
    });
}

// Fetch Task Details for Modal
function fetchTaskDetails({ id }: IFetchTaskDetailsRequest): Promise<IFetchTaskDetailsResponse> {
    return new Promise((resolve, reject) => {
        const task = tasks.find(task => task.id === id);
        if (task) {
            resolve(task);
        } else {
            reject(new Error("Task not found."));
        }
    });
}

// Update Task Comment Only
function updateTaskComment({ id, comment }: IUpdateTaskCommentRequest): Promise<IUpdateTaskCommentResponse> {
    return new Promise((resolve, reject) => {
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            if (!comment || comment.trim() === "") {
                reject(new Error("Comment cannot be empty."));
                return;
            }

            tasks[taskIndex].comment = comment;
            tasks[taskIndex].updated_at = new Date().toISOString();

            resolve({ success: true, task: tasks[taskIndex] });
        } else {
            reject(new Error("Task not found."));
        }
    });
}


export { fetchTasks, updateTaskStatus, fetchTaskDetails, updateTaskComment };