import {
  type CSSVariablesResolver,
  DEFAULT_THEME,
  createTheme,
  mergeMantineTheme,
  rem,
} from '@mantine/core';

const themeVars = {
  navHeight: 60,
} as const;

const resolver: CSSVariablesResolver = () => ({
  variables: {
    '--nav-height': rem(themeVars.navHeight),
  },
  light: {},
  dark: {},
});

const themeOverride = createTheme({
  other: {
    navHeight: themeVars.navHeight,
  },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOverride);
export { resolver, themeVars };