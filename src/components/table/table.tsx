import { useState, useEffect, useCallback } from "react";
import { TABLE_HEADERS } from "../../constants/table";
import { Table as MantineTable } from "@mantine/core";
import { ITask, ITaskStatus } from "../../types";
import { toTitleCase } from "../../utils";
import ActionModal from "../actionModal/actionModal";
import { useTasksFetch } from "../../hooks";

const Table = ({ currentStatus }: { currentStatus: ITaskStatus }) => {
    const { tasks, loading, error } = useTasksFetch(currentStatus);

    const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

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

    // Reset focused index when tasks change
    useEffect(() => {
        setFocusedIndex(tasks.length > 0 ? 0 : -1);
    }, [tasks]);

    if (loading) { return <div>Loading...</div>; }
    if (error) { return <div>Error: {error}</div>; }

    return (
        <div>
            <MantineTable highlightOnHover withTableBorder withColumnBorders verticalSpacing="xs">
                <MantineTable.Thead>
                    <MantineTable.Tr>
                        {TABLE_HEADERS.map((header) => (
                            <MantineTable.Th key={header}>{toTitleCase(header)}</MantineTable.Th>
                        ))}
                    </MantineTable.Tr>
                </MantineTable.Thead>
                <MantineTable.Tbody>
                    {tasks.map((task, index) => (
                        <MantineTable.Tr 
                            key={task.id}
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

            <ActionModal 
                task={selectedTask}
                onClose={handleCloseModal}
                currentStatus={currentStatus}
            />
        </div>
    )
}

export default Table;