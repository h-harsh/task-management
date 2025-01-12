import { useLocation } from "wouter";
import { Tabs as MantineTabs, Badge, Button, Group } from '@mantine/core';
import { useApiStore, useUiStore } from '../../store';
import { useEffect } from 'react';
import { fetchTaskCountsHandler } from '../../api/handlers';
import { ITaskStatus } from '../../types';
import { IconSortAscending2 } from '@tabler/icons-react';

const ROUTES_DATA = [
    {
        label: "Open",
        key: "open",
        to: "/open",
        status: "OPEN" as ITaskStatus
    },
    {
        label: "In Progress",
        key: "in-progress",
        to: "/in-progress",
        status: "IN_PROGRESS" as ITaskStatus
    },
    {
        label: "Closed",
        key: "closed",
        to: "/closed",
        status: "CLOSED" as ITaskStatus
    },
];

const Tabs = () => {
    const [location, setLocation] = useLocation();
    const currentTab = location.split('/')[1] || 'open';
    const { fetchTaskCountState } = useApiStore();
    const { sortConfig, clearSort } = useUiStore();

    useEffect(() => {
        fetchTaskCountsHandler({ 
            statuses: ROUTES_DATA.map(route => route.status) 
        });
    }, []);

    const getTaskCount = (status: ITaskStatus) => {
        return fetchTaskCountState.data?.counts.find(
            count => count.status === status
        )?.count ?? 0;
    };

    return (
        <Group justify="space-between" align="center">
            <MantineTabs
                value={currentTab}
                onChange={(value) => setLocation(`/${value}`)}
            >
                <MantineTabs.List>
                    {ROUTES_DATA.map((route) => (
                        <MantineTabs.Tab
                            w={170} 
                            key={route.key} 
                            value={route.key}
                            rightSection={
                                <Badge 
                                    size="auto"
                                    variant="light"
                                    circle
                                >
                                    {getTaskCount(route.status)}
                                </Badge>
                            }
                        >
                            {route.label}
                        </MantineTabs.Tab>
                    ))}
                </MantineTabs.List>
            </MantineTabs>

            <Button
                variant="subtle"
                leftSection={<IconSortAscending2 size={16} />}
                onClick={clearSort}
                disabled={!sortConfig.key}
                size="sm"
            >
                Clear Sort
            </Button>
        </Group>
    );
};

export default Tabs;
