import {useTaskStore} from '../store';
import { fetchTasks, updateTaskStatus, fetchTaskDetails, updateTaskComment } from './backend';
import type {
    IFetchTasksRequest,
    IUpdateTaskStatusRequest,
    IFetchTaskDetailsRequest, 
    IUpdateTaskCommentRequest 
} from '../types/api';

 const fetchTasksHandler = (request: IFetchTasksRequest): void => {
    const set = useTaskStore.getState().setFetchTasksState;

    // Set loading state
    set({ status: 'loading', data: null, loading: true, error: null });

    // Handle the API call and state updates
    fetchTasks(request)
        .then(({ tasks, pagination }) => {
            // Set success state
            set({ status: 'success', data: { tasks, pagination }, loading: false, error: null });
        })
        .catch((error) => {
            // Set error state
            set({
                status: 'error',
                data: null,
                loading: false,
                error: (error as Error).message || 'Failed to fetch tasks',
            });
        });
};

// Handler: Update Task Status
 const updateTaskStatusHandler = (request: IUpdateTaskStatusRequest): void => {
    const set = useTaskStore.getState().setUpdateTaskStatusState;

    // Set loading state
    set({ status: "loading", data: null, loading: true, error: null });

    updateTaskStatus(request)
        .then(() => {
            // Set success state
            set({ status: "success", data: null, loading: false, error: null });
        })
        .catch((error) => {
            // Set error state
            set({
                status: "error",
                data: null,
                loading: false,
                error: (error as Error).message || "Failed to update task status",
            });
        });
};

// Handler: Fetch Task Details
 const fetchTaskDetailsHandler = (request: IFetchTaskDetailsRequest): void => {
    const set = useTaskStore.getState().setFetchTaskDetailsState;

    // Set loading state
    set({ status: "loading", data: null, loading: true, error: null });

    fetchTaskDetails(request)
        .then((task) => {
            // Set success state
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

// Handler: Update Task Comment
 const updateTaskCommentHandler = (request: IUpdateTaskCommentRequest): void => {
    const set = useTaskStore.getState().setUpdateTaskCommentState;

    // Set loading state
    set({ status: "loading", data: null, loading: true, error: null });

    updateTaskComment(request)
        .then(() => {
            // Set success state
            set({ status: "success", loading: false, error: null });
        })
        .catch((error) => {
            // Set error state
            set({
                status: "error",
                data: null,
                loading: false,
                error: (error as Error).message || "Failed to update task comment",
            });
        });
};

export { fetchTasksHandler, updateTaskStatusHandler, fetchTaskDetailsHandler, updateTaskCommentHandler };