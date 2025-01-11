import { useLocation } from "wouter";
import { Tabs as MantineTabs } from '@mantine/core';

const ROUTES_DATA = [
    {
        label: "Open",
        key: "open",
        to: "/open",
    },
    {
        label: "In Progress",
        key: "in-progress",
        to: "/in-progress",
    },
    {
        label: "Closed",
        key: "closed",
        to: "/closed",
    },
]

const Tabs = () => {
    const [location, setLocation] = useLocation();
    const currentTab = location.split('/')[1] || 'open';

    return (
        <MantineTabs
            value={currentTab}
            onChange={(value) => setLocation(`/${value}`)}
        >
            <MantineTabs.List>
                {ROUTES_DATA.map((route) => (
                    <MantineTabs.Tab 
                        key={route.key} 
                        value={route.key}
                    >
                        {route.label}
                    </MantineTabs.Tab>
                ))}
            </MantineTabs.List>
        </MantineTabs>
    );
};

export default Tabs;
