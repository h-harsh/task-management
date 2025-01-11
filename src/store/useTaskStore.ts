import { create } from 'zustand';
import { APIState } from '../types/store';
import type { 
    IFetchTasksResponse,
    IUpdateTaskStatusResponse, 
    IFetchTaskDetailsResponse, 
    IUpdateTaskCommentResponse 
} from '../types/api';

interface TaskStore {
    fetchTasksState: APIState<IFetchTasksResponse>;
    updateTaskStatusState: APIState<IUpdateTaskStatusResponse>;
    fetchTaskDetailsState: APIState<IFetchTaskDetailsResponse>;
    updateTaskCommentState: APIState<IUpdateTaskCommentResponse>;

    // State updaters
    setFetchTasksState: (newState: APIState<IFetchTasksResponse>) => void;
    setUpdateTaskStatusState: (newState: APIState<IUpdateTaskStatusResponse>) => void;
    setFetchTaskDetailsState: (newState: APIState<IFetchTaskDetailsResponse>) => void;
    setUpdateTaskCommentState: (newState: APIState<IUpdateTaskCommentResponse>) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
    // Initial states
    fetchTasksState: { status: "idle", data: null, loading: false, error: null },
    updateTaskStatusState: { status: "idle", data: null, loading: false, error: null },
    fetchTaskDetailsState: { status: "idle", data: null, loading: false, error: null },
    updateTaskCommentState: { status: "idle", data: null, loading: false, error: null },

    // State updaters
    setFetchTasksState: (newState) => set(() => ({ fetchTasksState: newState })),
    setUpdateTaskStatusState: (newState) => set(() => ({ updateTaskStatusState: newState })),
    setFetchTaskDetailsState: (newState) => set(() => ({ fetchTaskDetailsState: newState })),
    setUpdateTaskCommentState: (newState) => set(() => ({ updateTaskCommentState: newState })),
}));

export default useTaskStore;
