// @ts-nocheck
import { useApiStore } from '../store';
import { fetchTasks, updateTaskStatus, fetchTaskDetails, updateTaskComment, fetchTaskCounts } from './backend';
import type {
    IFetchTasksRequest,
    IUpdateTaskStatusRequest,
    IFetchTaskDetailsRequest, 
    IUpdateTaskCommentRequest,
    IFetchTaskCountRequest
} from '../types/api';

 const fetchTasksHandler = (request: IFetchTasksRequest): void => {
    const set = useApiStore.getState().setFetchTasksState;
    set({ status: 'loading', data: null, loading: true, error: null });
    fetchTasks(request)
        .then(({ tasks, pagination }) => {
            set({ status: 'success', data: { tasks, pagination }, loading: false, error: null });
        })
        .catch((error) => {
            set({
                status: 'error',
                data: null,
                loading: false,
                error: (error as Error).message || 'Failed to fetch tasks',
            });
        });
};

 const updateTaskStatusHandler = (request: IUpdateTaskStatusRequest): void => {
    const set = useApiStore.getState().setUpdateTaskStatusState;
    set({ status: "loading", data: null, loading: true, error: null });
    updateTaskStatus(request)
        .then(() => {
            set({ status: "success", data: null, loading: false, error: null });
        })
        .catch((error) => {
            set({
                status: "error",
                data: null,
                loading: false,
                error: (error as Error).message || "Failed to update task status",
            });
        });
};

 const fetchTaskDetailsHandler = (request: IFetchTaskDetailsRequest): void => {
    const set = useApiStore.getState().setFetchTaskDetailsState;
    set({ status: "loading", data: null, loading: true, error: null });
    fetchTaskDetails(request)
        .then((task) => {
            set({ status: "success", data: task, loading: false, error: null });
        })
        .catch((error) => {
            // Set error state
            set({
                status: "error",
                data: null,
                loading: false,
                error: (error as Error).message || "Failed to fetch task details",
            });
        });
};

 const updateTaskCommentHandler = (request: IUpdateTaskCommentRequest): void => {
    const set = useApiStore.getState().setUpdateTaskCommentState;
    set({ status: "loading", data: null, loading: true, error: null });
    updateTaskComment(request)
        .then(() => {
            set({ status: "success", data: null, loading: false, error: null });
        })
        .catch((error) => {
            set({
                status: "error",
                data: null,
                loading: false,
                error: (error as Error).message || "Failed to update task comment",
            });
        });
};

const fetchTaskCountsHandler = (request: IFetchTaskCountRequest): void => {
    const set = useApiStore.getState().setFetchTaskCountState;
    set({ status: 'loading', data: null, loading: true, error: null });
    fetchTaskCounts(request)
        .then((response) => {
            set({ 
                status: 'success', 
                data: response, 
                loading: false, 
                error: null 
            });
        })
        .catch((error) => {
            set({
                status: 'error',
                data: null,
                loading: false,
                error: (error as Error).message || 'Failed to fetch task counts'
            });
        });
};

export { fetchTasksHandler, updateTaskStatusHandler, fetchTaskDetailsHandler, updateTaskCommentHandler, fetchTaskCountsHandler };