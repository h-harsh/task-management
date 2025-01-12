import { Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './navbar.module.css';
import ThemeToggle from '../themeToggle/themeToggle';
import SearchBar from '../searchBar/searchBar';

function NavBar() {
    const [opened, { toggle }] = useDisclosure(false);

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    <Text>Logo</Text>
                </Group>

                <Group>
                    <SearchBar />
                    <ThemeToggle />
                </Group>
            </div>
        </header>
    );
}

export default NavBar;