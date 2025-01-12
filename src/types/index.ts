export * from './api';
export * from './data';

export interface ISortConfig {
    key: string | null;
    direction: 'asc' | 'desc' | null;
}