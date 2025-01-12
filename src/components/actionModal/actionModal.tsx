import { Modal, Text, Group, Button, Stack, Select, Textarea, Alert } from '@mantine/core';
import { ITask } from '../../types';
import { useState, useEffect } from 'react';
import { updateTaskStatusHandler, updateTaskCommentHandler, fetchTaskCountsHandler } from '../../api/handlers';
import { useUiStore } from '../../store';

interface ActionModalProps {
    task: ITask | null;
    onClose: () => void;
    currentStatus: string;
}

const ActionModal = ({ task, onClose }: ActionModalProps) => {
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

    const handleStatusChange = (value: string | null) => {
        if (!value) {return;}
        setStatus(value);
        setIsStatusChanged(value !== task?.status);
    };

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
                        <Text>{task.priority}</Text>
                    </Group>

                    <Group>
                        <Text fw={500}>Assignee:</Text>
                        <Text>{task.assignee}</Text>
                    </Group>

                    <Group>
                        <Text fw={500}>Labels:</Text>
                        <Text>{task.labels.join(', ')}</Text>
                    </Group>

                    <Select
                        label="Status"
                        value={status}
                        onChange={handleStatusChange}
                        data={[
                            { value: 'OPEN', label: 'Open' },
                            { value: 'IN_PROGRESS', label: 'In Progress' },
                            { value: 'CLOSED', label: 'Closed' }
                        ]}
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