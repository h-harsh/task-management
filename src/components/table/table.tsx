import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { TABLE_HEADERS } from "../../constants/table";
import { Table as MantineTable, LoadingOverlay, Loader, ActionIcon, Group, Flex, Badge, Pill } from "@mantine/core";
import { ITask, ITaskStatus } from "../../types";
import { toTitleCase } from "../../utils";
import ActionModal from "../actionModal/actionModal";
import { useTasksFetch } from "../../hooks";
import { useIntersection } from '@mantine/hooks';
import { IconTriangleFilled, IconTriangleInvertedFilled } from '@tabler/icons-react';
import { useUiStore } from '../../store';
import RowSkeleton from "./rowSkeleton";
import classes from './tables.module.css';

const BUFFER_THRESHOLD = 0.5;

const Table = ({ currentStatus }: { currentStatus: ITaskStatus }) => {
    const { tasks, loading, error, hasMore, loadMore } = useTasksFetch(currentStatus);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const isLoadingRef = useRef(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastScrollPositionRef = useRef(0);
    const tableRef = useRef<HTMLDivElement>(null);
    
    const { sortConfig, setSortConfig } = useUiStore();
    const searchFilter = useUiStore((state) => state.searchFilter);
    const currentViewedTask = useUiStore((state) => state.currentViewedTask);

    const { ref: bottomRef, entry: bottomEntry } = useIntersection({
        threshold: BUFFER_THRESHOLD,
        root: scrollContainerRef.current,
        rootMargin: '200px 0px',
    });

    const keyMap: { [key: string]: string } = {
        'Priority': 'priority',
        'ID': 'id',
        'Status': 'status',
        'Labels': 'labels',
        'Name': 'name',
        'Due Date': 'due_date',
        'Created At': 'created_at',
        'Assignee': 'assignee'
    };

    useEffect(() => {
        const shouldLoadMore = 
            bottomEntry?.isIntersecting && 
            hasMore && 
            !loading && 
            !isLoadingRef.current;

        if (shouldLoadMore) {
            isLoadingRef.current = true;
            lastScrollPositionRef.current = scrollContainerRef.current?.scrollTop || 0;
            
            Promise.resolve(loadMore())
                .then(() => {
                    isLoadingRef.current = false;
                })
                .catch(() => {
                    isLoadingRef.current = false;
                });
        }
    }, [bottomEntry?.isIntersecting, hasMore, loading, loadMore]);

    useEffect(() => {
        if (!loading && scrollContainerRef.current && lastScrollPositionRef.current) {
            scrollContainerRef.current.scrollTop = lastScrollPositionRef.current;
        }
    }, [loading]);

    useEffect(() => {
        if (!loading) {
            isLoadingRef.current = false;
        }
    }, [loading, tasks]);

    const handleRowClick = useCallback((task: ITask) => {
        setSelectedTask(task);
    }, []);

    const handleCloseModal = () => {
        setSelectedTask(null);
    };

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!tableRef.current?.contains(document.activeElement)) {return;}
        if (tasks.length === 0) {return;}

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setFocusedIndex(prev => 
                    prev < tasks.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                event.preventDefault();
                setFocusedIndex(prev => 
                    prev > 0 ? prev - 1 : prev
                );
                break;
            case 'Enter':
                event.preventDefault();
                if (focusedIndex >= 0 && focusedIndex < tasks.length) {
                    handleRowClick(tasks[focusedIndex]);
                }
                break;
            default:
                break;
        }
    }, [tasks, focusedIndex, handleRowClick]);

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
        const dataKey = keyMap[key];
        
        setSortConfig((current) => {
            // If clicking the same direction that's already active, clear the sort
            if (current.key === dataKey && current.direction === direction) {
                return { key: null, direction: null };
            }
            // Set new sort configuration
            return { key: dataKey, direction };
        });
    };

    const filteredAndSortedTasks = useMemo(() => {
        // First sort by created_at as base ordering
        let filtered = [...tasks].sort((a, b) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        
        // Remove the currently viewed task if its status doesn't match current tab
        if (currentViewedTask && currentViewedTask.status !== currentStatus) {
            filtered = filtered.filter(task => task.id !== currentViewedTask.id);
        }
        
        // Apply search filter
        if (searchFilter?.value) {
            filtered = filtered.filter(task => {
                const value = task[searchFilter.column as keyof ITask];
                
                if (!value) {return false;}
                
                const stringValue = value.toString().toLowerCase();
                const searchValue = searchFilter.value.toLowerCase();
                
                if (Array.isArray(value)) {
                    return value.some(v => 
                        v?.toString().toLowerCase().includes(searchValue)
                    );
                }
                
                return stringValue.includes(searchValue);
            });
        }

        // Apply user-selected sorting if any
        if (sortConfig.key && sortConfig.direction) {
            filtered.sort((a: ITask, b: ITask) => {
                const aValue = a[sortConfig.key as keyof ITask];
                const bValue = b[sortConfig.key as keyof ITask];

                // Handle dates
                if (sortConfig.key === 'created_at' || sortConfig.key === 'due_date') {
                    const aTime = new Date(aValue as string).getTime();
                    const bTime = new Date(bValue as string).getTime();
                    return sortConfig.direction === 'asc'
                        ? aTime - bTime
                        : bTime - aTime;
                }

                // Handle arrays (like labels)
                if (Array.isArray(aValue) && Array.isArray(bValue)) {
                    const aStr = aValue.join(',');
                    const bStr = bValue.join(',');
                    return sortConfig.direction === 'asc'
                        ? aStr.localeCompare(bStr)
                        : bStr.localeCompare(aStr);
                }

                // Handle strings and other values
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                // Handle numbers and other types
                const numA = Number(aValue);
                const numB = Number(bValue);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return sortConfig.direction === 'asc' ? numA - numB : numB - numA;
                }

                return 0;
            });
        }

        return filtered;
    }, [tasks, sortConfig, searchFilter, currentViewedTask, currentStatus]);


    if (loading && tasks.length === 0) { return (
        <Flex justify="center" align="center" h="500px">
            <Loader />
        </Flex>
    ); }
    if (error) { return <div>Error: {error}</div>; }

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading && tasks.length === 0} />
            
            <div 
                ref={tableRef}
                tabIndex={0}
                role="grid"
                aria-label="Tasks table"
                className={classes.tableWrapper}
                onKeyDown={handleKeyDown}
            >
                <MantineTable highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs">
                    <MantineTable.Thead className={classes.tableHeader}>
                        <MantineTable.Tr>
                            {TABLE_HEADERS.map((header) => (
                                <MantineTable.Th key={header}>
                                    <Group gap="xs" justify="space-between" align="center">
                                        {toTitleCase(header)}
                                        <Flex direction="column" gap={0}>
                                            <ActionIcon 
                                                size="xs" 
                                                variant="transparent"
                                                onClick={() => handleSort(header, 'asc')}
                                                h="auto"
                                                mih="auto"
                                            >
                                                <IconTriangleFilled 
                                                    color={sortConfig.key === keyMap[header] && sortConfig.direction === 'asc' 
                                                        ? 'var(--mantine-color-blue-filled)' 
                                                        : '#ced4da'} 
                                                    size={8} 
                                                />
                                            </ActionIcon>
                                            <ActionIcon 
                                                size="xs" 
                                                variant="transparent"
                                                onClick={() => handleSort(header, 'desc')}
                                                h="auto"
                                                mih="auto"
                                            >
                                                <IconTriangleInvertedFilled
                                                    color={sortConfig.key === keyMap[header] && sortConfig.direction === 'desc' 
                                                        ? 'var(--mantine-color-blue-filled)' 
                                                        : '#ced4da'} 
                                                    size={8} 
                                                />
                                            </ActionIcon>
                                        </Flex>
                                    </Group>
                                </MantineTable.Th>
                            ))}
                        </MantineTable.Tr>
                    </MantineTable.Thead>
                    <MantineTable.Tbody>
                        {filteredAndSortedTasks.map((task, index) => (
                            <MantineTable.Tr 
                                key={`${task.id}-${index}`}
                                onClick={() => handleRowClick(task)}
                                className="task-row"
                                style={{ 
                                    cursor: 'pointer',
                                    backgroundColor: index === focusedIndex ? 'var(--mantine-color-blue-1)' : undefined
                                }}
                                tabIndex={0}
                            >
                                <MantineTable.Td>
                                    <Badge
                                        color={task.priority === 'HIGH' ? 'red' : task.priority === 'MEDIUM' ? 'yellow' : 'green'}
                                        size="sm" w={70} 
                                        variant="light" 
                                        radius="sm"
                                    >
                                        {toTitleCase(task.priority)}
                                    </Badge>
                                </MantineTable.Td>
                                <MantineTable.Td>{task.id}</MantineTable.Td>
                                <MantineTable.Td>{toTitleCase(task.status)}</MantineTable.Td>
                                <MantineTable.Td>{task.labels.map(label => {
                                    return <Pill key={label}>{label}</Pill>;
                                })}</MantineTable.Td>
                                <MantineTable.Td>{task.name}</MantineTable.Td>
                                <MantineTable.Td>{task.due_date.split('T')[0]}</MantineTable.Td>
                                <MantineTable.Td>{task.created_at.split('T')[0]}</MantineTable.Td>
                                <MantineTable.Td>{task.assignee}</MantineTable.Td>
                            </MantineTable.Tr>
                        ))}
                    </MantineTable.Tbody>
                </MantineTable>

                {(hasMore || loading) && (
                    <div 
                        ref={bottomRef} 
                        style={{ 
                            padding: '20px 0',
                            background: loading ? 'var(--mantine-color-gray-0)' : 'transparent',
                            transition: 'background-color 0.2s',
                            minHeight: '300px',
                            opacity: loading ? 1 : 0
                        }}
                    >
                        {loading && (
                            <MantineTable withTableBorder withColumnBorders>
                                <MantineTable.Tbody>
                                    {Array(5).fill(0).map((_, index) => (
                                        <RowSkeleton key={index} />
                                    ))}
                                </MantineTable.Tbody>
                            </MantineTable>
                        )}
                    </div>
                )}
            </div>

            <ActionModal 
                task={selectedTask}
                onClose={handleCloseModal}
                tasks={filteredAndSortedTasks}
                onTaskChange={setSelectedTask}
            />
        </div>
    );
};

export default Table;