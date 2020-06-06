import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import generateConnectionOptions from './utils/generateConnectionOptions/generateConnectionOptions';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import { Result, Typography } from 'antd';
import { ChromeOutlined, AppleOutlined } from '@ant-design/icons';
import './polyfils.js';
import { ContextWrapper } from './ContextWrapper';
import 'antd/dist/antd.less';
import { isSupported } from 'twilio-video';

const showChromeBrowser = () => (
  <Result
    title="You must be using Google Chrome to access this site"
    icon={<ChromeOutlined />}
    subTitle="Please copy the below link and paste it in Google Chrome"
    extra={<Typography.Paragraph copyable>{window.location.href}</Typography.Paragraph>}
  />
);

const showSafariBrowser = () => (
  <Result
    title="You must be using Safari to access this site"
    icon={<AppleOutlined />}
    subTitle="Please copy the below link and paste it in Safari"
    extra={<Typography.Paragraph copyable>{window.location.href}</Typography.Paragraph>}
  />
);

const VideoApp = () => {
  const { error, setError, settings } = useAppState();
  const connectionOptions = generateConnectionOptions(settings);

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

const WorkingApp = () => {
  if (!isSupported) {
    const { detect } = require('detect-browser');
    const browser = detect();
    if (browser && browser.name === 'chrome') return <FullApp />;
    if (browser && browser.os === 'iOS') {
      return showSafariBrowser();
    }
    return showChromeBrowser();
  }

  return <FullApp />;
};

const FullApp = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <VideoApp />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <ContextWrapper>
              <VideoApp />
            </ContextWrapper>
          </PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(<WorkingApp />, document.getElementById('root'));
