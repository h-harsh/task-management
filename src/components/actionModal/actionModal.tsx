import { Modal, Text, Group, Button, Stack, Select, Textarea } from '@mantine/core';
import { ITask } from '../../types';
import { useState } from 'react';
import { updateTaskStatusHandler } from '../../api/handlers';

interface ActionModalProps {
    task: ITask | null;
    onClose: () => void;
    currentStatus: string;
}

const ActionModal = ({ task, onClose, currentStatus }: ActionModalProps) => {
    const [status, setStatus] = useState(task?.status || 'OPEN');
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        if (!task) {return;}
        

        
        updateTaskStatusHandler({
            id: task.id,
            newStatus: status,
            comment
        });
    }

  

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
                        onChange={(value) => setStatus(value || 'OPEN')}
                        data={[
                            { value: 'OPEN', label: 'Open' },
                            { value: 'IN_PROGRESS', label: 'In Progress' },
                            { value: 'CLOSED', label: 'Closed' }
                        ]}
                    />

                    <Textarea
                        label="Comment"
                        value={comment}
                        onChange={(event) => setComment(event.currentTarget.value)}
                        placeholder="Add a comment..."
                        required
                        minRows={3}
                    />

                    <Group justify="flex-end" mt="md">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSubmit} 
                        >
                            Update Status
                        </Button>
                    </Group>
                </Stack>
            )}
        </Modal>
    );
};

export default ActionModal;