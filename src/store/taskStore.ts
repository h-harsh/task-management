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
    setSearchFilter: (filter: SearchFilter) => void;
    setFetchTasksState: (state: any) => void;
}

const useTaskStore = create<TaskStore>((set, get) => ({
    fetchTasksState: {
        data: null,
        loading: false,
        error: null
    },
    searchFilter: { column: 'name', value: '' },
    setSearchFilter: (filter: SearchFilter) => {
        set((state) => {
            return { ...state, searchFilter: filter };
        });
    },
    setFetchTasksState: (state) => set((prev) => ({ 
        ...prev,
        fetchTasksState: state 
    }))
}));

export { useTaskStore }; 