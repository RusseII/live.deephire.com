import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
  }
}

export default createMuiTheme({
  palette: {
    type: 'light',
    background: {
      default: "#f1f2f5"
    },
    primary: {
      main: '#1890ff',
    },
  },
  sidebarWidth: 260,
  sidebarMobileHeight: 90,
});
