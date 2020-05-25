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
  breakpoints: {
    values: {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
}
  },
  palette: {
    type: 'light',
    background: {
      default: "#f1f2f5"
    },
    // primary: {
    //   main: '#1890ff',
    // },
    primary: {
      main: '#55984f',
    },
    
  },
  sidebarWidth: 260,
  sidebarMobileHeight: 90,
});
