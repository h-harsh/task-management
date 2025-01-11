import {useTaskStore} from '../store';
import { fetchTasks, updateTaskStatus, fetchTaskDetails, updateTaskComment } from './backend';
import type {
    IFetchTasksRequest,
    IUpdateTaskStatusRequest,
    IFetchTaskDetailsRequest, 
    IUpdateTaskCommentRequest 
} from '../types/api';

// Handler: Fetch Tasks
//  const fetchTasksHandler = async (request: IFetchTasksRequest) => {
//     const set = useTaskStore.getState().setFetchTasksState;

//     // Set loading state
//     set({ status: "loading", data: null, loading: true, error: null });

//     try {
//         const { tasks, pagination } = await fetchTasks(request);

//         // Set success state
//         set({ status: "success", data: { tasks, pagination }, loading: false, error: null });
//     } catch (error) {
//         // Set error state
//         set({
//             status: "error",
//             data: null,
//             loading: false,
//             error: (error as Error).message || "Failed to fetch tasks",
//         });
//     }
// };
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
 const updateTaskStatusHandler = async (request: IUpdateTaskStatusRequest) => {
    const set = useTaskStore.getState().setUpdateTaskStatusState;

    // Set loading state
    set({ status: "loading", data: null, loading: true, error: null });

    try {
        await updateTaskStatus(request);

        // Set success state
        set({ status: "success", data: null, loading: false, error: null });
    } catch (error) {
        // Set error state
        set({
            status: "error",
            data: null,
            loading: false,
            error: (error as Error).message || "Failed to update task status",
        });
    }
};

// Handler: Fetch Task Details
 const fetchTaskDetailsHandler = async (request: IFetchTaskDetailsRequest) => {
    const set = useTaskStore.getState().setFetchTaskDetailsState;

    // Set loading state
    set({ status: "loading", data: null, loading: true, error: null });

    try {
        const task = await fetchTaskDetails(request);

        // Set success state
        set({ status: "success", data: task, loading: false, error: null });
    } catch (error) {
        // Set error state
        set({
            status: "error",
            data: null,
            loading: false,
            error: (error as Error).message || "Failed to fetch task details",
        });
    }
};

// Handler: Update Task Comment
 const updateTaskCommentHandler = async (request: IUpdateTaskCommentRequest) => {
    const set = useTaskStore.getState().setUpdateTaskCommentState;

    // Set loading state
    set({ status: "loading", data: null, loading: true, error: null });

    try {
        await updateTaskComment(request);

        // Set success state
        set({ status: "success", loading: false, error: null });
    } catch (error) {
        // Set error state
        set({
            status: "error",
            data: null,
            loading: false,
            error: (error as Error).message || "Failed to update task comment",
        });
    }
};

export { fetchTasksHandler, updateTaskStatusHandler, fetchTaskDetailsHandler, updateTaskCommentHandler };