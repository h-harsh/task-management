import { IconSearch } from '@tabler/icons-react';
import { Autocomplete, Burger, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './navbar.module.css';
import ThemeToggle from '../themeToggle/themeToggle';

function NavBar() {
    const [opened, { toggle }] = useDisclosure(false);

    return (
        <header className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                    {/* <MantineLogo size={28} /> */}
                    <Text>Logo</Text>
                </Group>

                <Group>
                    <Autocomplete
                        className={classes.search}
                        placeholder="Search"
                        leftSection={<IconSearch size={16} stroke={1.5} />}
                        data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
                        visibleFrom="xs"
                    />

                    <ThemeToggle />
                </Group>
            </div>
        </header>
    );
}

export default NavBar;