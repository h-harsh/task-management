import '@mantine/core/styles.css';
import { localStorageColorSchemeManager, MantineProvider } from '@mantine/core';
import Routes from './routes';
import { resolver, theme } from './theme/theme'
import { NavBar, Tabs } from './components';
const colorSchemeManager = localStorageColorSchemeManager({
  key: 'my-app-color-scheme',
});

export default function App() {
  return (
    <MantineProvider defaultColorScheme='light' theme={theme} cssVariablesResolver={resolver} colorSchemeManager={colorSchemeManager}>
      <NavBar />
      <Tabs />
      <Routes />
    </MantineProvider>
  );
}

