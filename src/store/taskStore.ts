import { create } from 'zustand';
import { ITask } from '../types';

interface SearchFilter {
    column: string;
    value: string;
}

interface TaskStore {
    fetchTasksState: {
        data: { tasks: ITask[]; pagination: any } | null;
        loading: boolean;
        error: string | null;
    };
    searchFilter: SearchFilter;
    currentViewedTask: ITask | null;
    setSearchFilter: (filter: SearchFilter) => void;
    setFetchTasksState: (state: any) => void;
    setCurrentViewedTask: (task: ITask | null) => void;
    updateCurrentViewedTask: (updates: Partial<ITask>) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
    fetchTasksState: {
        data: null,
        loading: false,
        error: null
    },
    searchFilter: { column: 'name', value: '' },
    currentViewedTask: null,
    setSearchFilter: (filter: SearchFilter) => {
        set((state) => ({
            ...state,
            searchFilter: filter
        }));
    },
    setFetchTasksState: (state) => set((prev) => ({ 
        ...prev,
        fetchTasksState: state 
    })),
    setCurrentViewedTask: (task) => set((state) => ({
        ...state,
        currentViewedTask: task
    })),
    updateCurrentViewedTask: (updates) => set((state) => ({
        ...state,
        currentViewedTask: state.currentViewedTask 
            ? { ...state.currentViewedTask, ...updates }
            : null
    }))
}));

export { useTaskStore }; 