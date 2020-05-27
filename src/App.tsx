import React from 'react';
import { styled } from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';
import { Button, Result } from 'antd';
import { ChromeFilled } from '@ant-design/icons';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

import 'antd/dist/antd.less';
Sentry.init({ dsn: 'https://ba050977b865461497954ae331877145@sentry.io/5187820' });

const { isSupported } = require('twilio-video');

const Container = styled('div')({
  display: 'grid',
  gridTemplateRows: 'auto 1fr',
});

const Main = styled('main')({
  overflow: 'hidden',
});

export default function App() {
  const roomState = useRoomState();

  // Here we would like the height of the main container to be the height of the viewport.
  // On some mobile browsers, 'height: 100vh' sets the height equal to that of the screen,
  // not the viewport. This looks bad when the mobile browsers location bar is open.
  // We will dynamically set the height with 'window.innerHeight', which means that this
  // will look good on mobile browsers even after the location bar opens or closes.
  const height = useHeight();


  if (isSupported) {
    return (
      <Container style={{ height }}>
        <MenuBar />
        <Main>
          {roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}
          <Controls />
        </Main>
        <ReconnectingNotification />
      </Container>
    );
  } else {
    return (
      <Container style={{ height }}>
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
      </Container>
    );
  }
}
