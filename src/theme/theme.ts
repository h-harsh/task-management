import {
  type CSSVariablesResolver,
  DEFAULT_THEME,
  createTheme,
  mergeMantineTheme,
  rem,
} from '@mantine/core';

// Define theme variables
const themeVars = {
  navHeight: 60,
} as const;

// CSS Variables resolver to make variables available in styles
const resolver: CSSVariablesResolver = () => ({
  variables: {
    '--nav-height': rem(themeVars.navHeight),
  },
  light: {},
  dark: {},
});

const themeOverride = createTheme({
  colors: {
    // ...DEFAULT_THEME.colors,
    // purple: [
    //   '#fafaff',
    //   '#f4f3ff',
    //   '#ebe9fe',
    //   '#d9d6fe',
    //   '#bdb4fe',
    //   '#9b8afb',
    //   '#7a5af8',
    //   '#6938ef',
    //   '#5925dc',
    //   '#4a1fb8',
    //   '#3e1c96'
    // ],
  },
//   primaryColor: 'purple',
//   defaultRadius: 0,
  other: {
    navHeight: themeVars.navHeight,
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
export { resolver, themeVars };