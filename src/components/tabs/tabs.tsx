import { useLocation } from "wouter";
import { Tabs as MantineTabs, Badge } from '@mantine/core';
import { useApiStore } from '../../store';
import { useEffect } from 'react';
import { fetchTaskCountsHandler } from '../../api/handlers';
import { ITaskStatus } from '../../types';

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
    );
};

export default Tabs;
