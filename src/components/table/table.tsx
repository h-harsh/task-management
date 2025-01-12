import { useState, useEffect, useCallback, useRef } from "react";
import { TABLE_HEADERS } from "../../constants/table";
import { Table as MantineTable, LoadingOverlay, Skeleton, Loader } from "@mantine/core";
import { ITask, ITaskStatus } from "../../types";
import { toTitleCase } from "../../utils";
import ActionModal from "../actionModal/actionModal";
import { useTasksFetch } from "../../hooks";
import { useIntersection } from '@mantine/hooks';

const BUFFER_THRESHOLD = 0.5;

const LoadingRow = () => (
    <MantineTable.Tr>
        {TABLE_HEADERS.map((_, index) => (
            <MantineTable.Td key={index}>
                <Skeleton height={20} radius="sm" />
            </MantineTable.Td>
        ))}
    </MantineTable.Tr>
);

const Table = ({ currentStatus }: { currentStatus: ITaskStatus }) => {
    const { tasks, loading, error, hasMore, loadMore } = useTasksFetch(currentStatus);
    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);
    const isLoadingRef = useRef(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const lastScrollPositionRef = useRef(0);

    const { ref: bottomRef, entry: bottomEntry } = useIntersection({
        threshold: BUFFER_THRESHOLD,
        root: null,
        rootMargin: '500px 0px',
    });

    // Load more when reaching buffer zone
    useEffect(() => {
        if (bottomEntry?.isIntersecting && 
            hasMore && 
            !loading && 
            !isLoadingRef.current && 
            tasks.length > 0) {
            isLoadingRef.current = true;
            lastScrollPositionRef.current = scrollContainerRef.current?.scrollTop || 0;
            loadMore();
        }
    }, [bottomEntry?.isIntersecting, hasMore, loading, loadMore, tasks.length]);

    // Maintain scroll position after loading
    useEffect(() => {
        if (!loading && scrollContainerRef.current && lastScrollPositionRef.current) {
            scrollContainerRef.current.scrollTop = lastScrollPositionRef.current;
            isLoadingRef.current = false;
        }
    }, [loading, tasks]);

    const handleRowClick = useCallback((task: ITask) => {
        setSelectedTask(task);
    }, []);

    const handleCloseModal = () => {
        setSelectedTask(null);
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
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

    // Set up keyboard event listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    if (loading && tasks.length === 0) { return <Loader size="xl" />; }
    if (error) { return <div>Error: {error}</div>; }

    return (
        <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading && tasks.length === 0} />
            
            <div 
                ref={scrollContainerRef}
                style={{ 
                    position: 'relative', 
                    minHeight: '400px', 
                    maxHeight: '80vh', 
                    overflowY: 'auto',
                    scrollBehavior: 'smooth'
                }}
            >
                <MantineTable highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs">
                    <MantineTable.Thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                        <MantineTable.Tr>
                            {TABLE_HEADERS.map((header) => (
                                <MantineTable.Th key={header}>{toTitleCase(header)}</MantineTable.Th>
                            ))}
                        </MantineTable.Tr>
                    </MantineTable.Thead>
                    <MantineTable.Tbody>
                        {tasks.map((task, index) => (
                            <MantineTable.Tr 
                                key={`${task.id}-${index}`}
                                onClick={() => handleRowClick(task)}
                                style={{ 
                                    cursor: 'pointer',
                                    backgroundColor: index === focusedIndex ? 'var(--mantine-color-blue-1)' : undefined
                                }}
                                tabIndex={0}
                            >
                                <MantineTable.Td>{toTitleCase(task.priority)}</MantineTable.Td>
                                <MantineTable.Td>{task.id}</MantineTable.Td>
                                <MantineTable.Td>{toTitleCase(task.status)}</MantineTable.Td>
                                <MantineTable.Td>{task.labels.join(', ')}</MantineTable.Td>
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
                                        <LoadingRow key={index} />
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
                currentStatus={currentStatus}
            />
        </div>
    );
};

export default Table;