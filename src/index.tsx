import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ConnectOptions } from 'twilio-video';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import { isMobile } from './utils';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { VideoProvider } from './components/VideoProvider';
import { Result, Button, Typography} from 'antd'
import { ChromeFilled, AppleOutlined } from '@ant-design/icons';
import IEPolyfills from "./polyfils.js"

import 'antd/dist/antd.less';
import { isSupported } from 'twilio-video'



IEPolyfills()

const showChromeBrowser = () => (
 <Result
  title="You must be using Google Chrome to access this site"
  icon={<ChromeFilled />}
  subTitle="Please download this up-to-date, free and excellent browser made by Google:"
  extra={
    <Button href="https://www.google.com/chrome/" target="_parent" size="large" type="primary">
      Get the Google Chrome Browser
    </Button>
  }
/> 
)

const showSafariBrowser = () => (
  <Result
   title="You must be using Safari to access this site"
   icon={<AppleOutlined />}
   subTitle="Please copy the below link and paste it in Safari"
   extra={
     <Typography.Paragraph copyable>{window.location.href}</Typography.Paragraph>
   }
 /> 
 )

// for available connection options.
const connectionOptions: ConnectOptions = {
  // Bandwidth Profile, Dominant Speaker, and Network Quality
  // features are only available in Small Group or Group Rooms.
  // Please set "Room Type" to "Group" or "Small Group" in your
  // Twilio Console: https://www.twilio.com/console/video/configure
  bandwidthProfile: {
    video: {
      mode: 'collaboration',
      dominantSpeakerPriority: 'standard',
      renderDimensions: {
        high: { height: 1080, width: 1920 },
        standard: { height: 720, width: 1280 },
        low: { height: 90, width: 160 },
      },
    },
  },
  dominantSpeaker: true,
  networkQuality: { local: 1, remote: 1 },

  // Comment this line if you are playing music.
  maxAudioBitrate: 16000,

  // VP8 simulcast enables the media server in a Small Group or Group Room
  // to adapt your encoded video quality for each RemoteParticipant based on
  // their individual bandwidth constraints. This has no effect if you are
  // using Peer-to-Peer Rooms.
  preferredVideoCodecs: [{ codec: 'VP8', simulcast: true }],
};

// For mobile browsers, limit the maximum incoming video bitrate to 2.5 Mbps.
if (isMobile && connectionOptions?.bandwidthProfile?.video) {
  connectionOptions!.bandwidthProfile!.video!.maxSubscriptionBitrate = 2500000;
}

const VideoApp = () => {
  const { error, setError } = useAppState();

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
  console.log(browser)
  alert(JSON.stringify(browser))
  if (browser && browser.os === 'iOS')  {
    return showSafariBrowser()
  }
  
  return showChromeBrowser()

}

return (
<MuiThemeProvider theme={theme}>
  <CssBaseline />
  <Router>
    <AppStateProvider>
      <Switch>
        <PrivateRoute exact path="/">
          <VideoApp />
        </PrivateRoute>
        <PrivateRoute path="/room/:URLRoomName">
          <VideoApp />
        </PrivateRoute>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </AppStateProvider>
  </Router>
</MuiThemeProvider>)

}



ReactDOM.render(<WorkingApp/>,
  document.getElementById('root')
);

