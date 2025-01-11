// import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';

export default function App() {
  return (
    <MantineProvider>
      <div>
        <h1>Hello world</h1>
      </div>
    </MantineProvider>
  );
}
