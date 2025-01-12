import { create } from 'zustand';
import { ITask } from '../types';

interface SearchFilter {
    column: string;
    value: string;
}

interface SortConfig {
    key: string | null;
    direction: 'asc' | 'desc' | null;
}

interface TaskStore {
    fetchTasksState: {
        data: {
            tasks: ITask[];
            pagination: {
                total: number;
                has_next: boolean;
                page_size: number;
                offset: number;
            };
        } | null;
        loading: boolean;
        error: string | null;
    };
    searchFilter: SearchFilter;
    sortConfig: SortConfig;
    currentViewedTask: ITask | null;
    setSearchFilter: (filter: SearchFilter) => void;
    setSortConfig: (config: SortConfig | ((prev: SortConfig) => SortConfig)) => void;
    setFetchTasksState: (state: TaskStore['fetchTasksState']) => void;
    setCurrentViewedTask: (task: ITask | null) => void;
    updateCurrentViewedTask: (updates: Partial<ITask>) => void;
    clearSearch: () => void;
    clearSort: () => void;
}

// Get initial search state from localStorage
const getInitialSearchState = (): SearchFilter => {
    try {
        const savedSearch = localStorage.getItem('taskSearchFilter');
        if (!savedSearch) {
            return { column: 'name', value: '' };
        }
        const parsed = JSON.parse(savedSearch) as SearchFilter;
        if (typeof parsed.column === 'string' && typeof parsed.value === 'string') {
            return parsed;
        }
    } catch (error) {
        console.error('Error parsing search filter:', error);
    }
    return { column: 'name', value: '' };
};

// Get initial sort state from localStorage
const getInitialSortState = (): SortConfig => {
    const defaultState: SortConfig = { key: null, direction: null };
    
    try {
        const savedSort = localStorage.getItem('taskSortConfig');
        if (!savedSort) {
            return defaultState;
        }
        
        const parsed = JSON.parse(savedSort) as SortConfig;
        
        // Validate the parsed data structure
        if (parsed && typeof parsed === 'object' && 
            ('key' in parsed) && ('direction' in parsed) &&
            (parsed.key === null || typeof parsed.key === 'string') &&
            (parsed.direction === null || parsed.direction === 'asc' || parsed.direction === 'desc')) {
            return parsed;
        }
        
        return defaultState;
    } catch {
        return defaultState;
    }
};

const useTaskStore = create<TaskStore>((set) => ({
    fetchTasksState: {
        data: null,
        loading: false,
        error: null
    },
    searchFilter: getInitialSearchState(),
    sortConfig: getInitialSortState(),
    currentViewedTask: null,
    setSearchFilter: (filter: SearchFilter) => {
        localStorage.setItem('taskSearchFilter', JSON.stringify(filter));
        set((state) => ({
            ...state,
            searchFilter: filter
        }));
    },
    setSortConfig: (config: SortConfig | ((prev: SortConfig) => SortConfig)) => {
        set((state) => {
            const newConfig: SortConfig = typeof config === 'function' 
                ? config(state.sortConfig) 
                : config;
            localStorage.setItem('taskSortConfig', JSON.stringify(newConfig));
            return {
                ...state,
                sortConfig: newConfig
            };
        });
    },
    clearSearch: () => {
        localStorage.removeItem('taskSearchFilter');
        set((state) => ({
            ...state,
            searchFilter: { column: 'name', value: '' }
        }));
    },
    clearSort: () => {
        localStorage.removeItem('taskSortConfig');
        set((state) => ({
            ...state,
            sortConfig: { key: null, direction: null }
        }));
    },
    setFetchTasksState: (state: TaskStore['fetchTasksState']) => set((prev) => ({ 
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