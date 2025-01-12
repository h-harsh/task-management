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
    clearSearch: () => void;
}

// Get initial search state from localStorage
const getInitialSearchState = (): SearchFilter => {
    const savedSearch = localStorage.getItem('taskSearchFilter');
    if (savedSearch) {
        const parsed = JSON.parse(savedSearch) as SearchFilter;
        if (typeof parsed.column === 'string' && typeof parsed.value === 'string') {
            return parsed;
        }
    }
    return { column: 'name', value: '' };
};

const useTaskStore = create<TaskStore>((set) => ({
    fetchTasksState: {
        data: null,
        loading: false,
        error: null
    },
    searchFilter: getInitialSearchState(),
    currentViewedTask: null,
    setSearchFilter: (filter: SearchFilter) => {
        localStorage.setItem('taskSearchFilter', JSON.stringify(filter));
        set((state) => ({
            ...state,
            searchFilter: filter
        }));
    },
    clearSearch: () => {
        localStorage.removeItem('taskSearchFilter');
        set((state) => ({
            ...state,
            searchFilter: { column: 'name', value: '' }
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