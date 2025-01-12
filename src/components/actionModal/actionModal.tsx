import { Modal, Text, Group, Button, Stack, Select, Textarea, Alert, Pill, Badge } from '@mantine/core';
import { ITask } from '../../types';
import { useState, useEffect, useCallback } from 'react';
import { updateTaskStatusHandler, updateTaskCommentHandler, fetchTaskCountsHandler } from '../../api/handlers';
import { useUiStore } from '../../store';
import { toTitleCase } from '../../utils/string';
interface ActionModalProps {
    task: ITask | null;
    onClose: () => void;
    tasks: ITask[];
    onTaskChange: (task: ITask) => void;
}

const ActionModal = ({ task, onClose, tasks, onTaskChange }: ActionModalProps) => {
    const [status, setStatus] = useState<string>(task?.status || 'OPEN');
    const [comment, setComment] = useState('');
    const [isStatusChanged, setIsStatusChanged] = useState(false);
    const [error, setError] = useState('');
    const { updateCurrentViewedTask, setCurrentViewedTask } = useUiStore();

    useEffect(() => {
        if (task) {
            setStatus(task.status);
            setComment('');
            setIsStatusChanged(false);
            setError('');
            setCurrentViewedTask(task);
        }
    }, [task, setCurrentViewedTask]);

    const handleStatusChange = useCallback((value: string | null) => {
        if (!value) {return;}
        setStatus(value);
        setIsStatusChanged(value !== task?.status);
    }, [task?.status]);

    const handleSubmit = () => {
        if (!task) {return;}

        if (!isStatusChanged && !comment.trim()) {
            onClose();
            return;
        }

        if (isStatusChanged && !comment.trim()) {
            setError('Comment is required when changing status');
            return;
        }

        try {
            if (isStatusChanged) {
                updateTaskStatusHandler({
                    id: task.id,
                    newStatus: status,
                    comment: comment.trim()
                });
                
                // Update the current viewed task in the store
                updateCurrentViewedTask({
                    // @ts-ignore
                    status,
                    comment: comment.trim(),
                    updated_at: new Date().toISOString()
                });

                // Refresh task counts
                fetchTaskCountsHandler({ 
                    statuses: ['OPEN', 'IN_PROGRESS', 'CLOSED'] 
                });
            } else if (comment.trim()) {
                updateTaskCommentHandler({
                    id: task.id,
                    comment: comment.trim()
                });
                
                // Update just the comment in the store
                updateCurrentViewedTask({
                    comment: comment.trim(),
                    updated_at: new Date().toISOString()
                });
            }
            
            setComment('');
            setIsStatusChanged(false);
            setError('');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    const isSubmitDisabled = isStatusChanged && !comment.trim();
    const buttonText = isStatusChanged 
        ? 'Update Status' 
        : (comment.trim() ? 'Update Comment' : 'Cancel');

    const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
        
        if (!task || tasks.length === 0) {
            return;
        }

        const currentIndex = tasks.findIndex(t => t.id === task.id);
        
        if (currentIndex === -1) {
            return;
        }

        switch (event.key) {
            case 'ArrowLeft': {
                event.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : tasks.length - 1;
                const prevTask = tasks[prevIndex];
                setCurrentViewedTask(prevTask);
                onTaskChange(prevTask);
                setStatus(prevTask.status);
                setComment('');
                setIsStatusChanged(false);
                setError('');
                break;
            }
            case 'ArrowRight': {
                event.preventDefault();
                const nextIndex = currentIndex < tasks.length - 1 ? currentIndex + 1 : 0;
                const nextTask = tasks[nextIndex];
                setCurrentViewedTask(nextTask);
                onTaskChange(nextTask);
                setStatus(nextTask.status);
                setComment('');
                setIsStatusChanged(false);
                setError('');
                break;
            }
        }
    }, [task, tasks, setCurrentViewedTask, onTaskChange]);

    useEffect(() => {
        if (task) {
            window.addEventListener('keydown', handleKeyNavigation);
            return () => window.removeEventListener('keydown', handleKeyNavigation);
        }
    }, [handleKeyNavigation, task]);

    const handleKeyStatusChange = useCallback((event: KeyboardEvent) => {
        if (!task) {return;}

        switch (event.key) {
            case '1':
                handleStatusChange('OPEN');
                break;
            case '2':
                handleStatusChange('IN_PROGRESS');
                break;
            case '3':
                handleStatusChange('CLOSED');
                break;
            case 'ArrowLeft': {
                event.preventDefault();
                const prevIndex = tasks.findIndex(t => t.id === task.id) > 0 ? tasks.findIndex(t => t.id === task.id) - 1 : tasks.length - 1;
                const prevTask = tasks[prevIndex];
                setCurrentViewedTask(prevTask);
                onTaskChange(prevTask);
                setStatus(prevTask.status);
                setComment('');
                setIsStatusChanged(false);
                setError('');
                break;
            }
            case 'ArrowRight': {
                event.preventDefault();
                const nextIndex = tasks.findIndex(t => t.id === task.id) < tasks.length - 1 ? tasks.findIndex(t => t.id === task.id) + 1 : 0;
                const nextTask = tasks[nextIndex];
                setCurrentViewedTask(nextTask);
                onTaskChange(nextTask);
                setStatus(nextTask.status);
                setComment('');
                setIsStatusChanged(false);
                setError('');
                break;
            }
        }
    }, [task, handleStatusChange, tasks, onTaskChange, setCurrentViewedTask]);

    useEffect(() => {
        if (task) {
            window.addEventListener('keydown', handleKeyStatusChange);
            return () => window.removeEventListener('keydown', handleKeyStatusChange);
        }
    }, [handleKeyStatusChange, task]);

    const statusOptions = [
        { value: 'OPEN', label: '(1) Open' },
        { value: 'IN_PROGRESS', label: '(2) In Progress' },
        { value: 'CLOSED', label: '(3) Closed' }
    ];

    return (
        <Modal 
            opened={!!task} 
            onClose={onClose}
            title={`Task Details - ${task?.name}`}
            size="lg"
        >
            {task && (
                <Stack>
                    <Group>
                        <Text fw={500}>ID:</Text>
                        <Text>{task.id}</Text>
                    </Group>

                    <Group>
                        <Text fw={500}>Priority:</Text>
                        <Badge
                            color={task.priority === 'HIGH' ? 'red' : task.priority === 'MEDIUM' ? 'yellow' : 'green'}
                            size="sm" w={70} 
                            variant="light" 
                            radius="sm"
                        >
                            {toTitleCase(task.priority)}
                        </Badge>
                    </Group>

                    <Group>
                        <Text fw={500}>Assignee:</Text>
                        <Text>{task.assignee}</Text>
                    </Group>

                    <Group>
                        <Text fw={500}>Labels:</Text>
                        <Text>{task.labels.map(label => {
                            return <Pill key={label}>{label}</Pill>;
                        })}</Text>
                    </Group>

                    <Select
                        label="Status (Use number keys 1-3 to change)"
                        value={status}
                        onChange={handleStatusChange}
                        data={statusOptions}
                    />

                    {task.comment && (
                        <Group>
                            <Text fw={500}>Previous Comment:</Text>
                            <Text>{task.comment}</Text>
                        </Group>
                    )}

                    <Textarea
                        label={`Comment ${isStatusChanged ? '(Required)' : '(Optional)'}`}
                        value={comment}
                        onChange={(event) => setComment(event.currentTarget.value)}
                        placeholder="Add a comment..."
                        minRows={3}
                        error={error}
                    />

                    {isStatusChanged && (
                        <Alert color="blue">
                            Status change requires a comment
                        </Alert>
                    )}

                    <Group justify="flex-end" mt="md">
                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitDisabled}
                        >
                            {buttonText}
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
};

export default ActionModal;