import React from 'react';
import { styled } from '@material-ui/core/styles';
import * as Sentry from '@sentry/browser';

import Controls from './components/Controls/Controls';
import LocalVideoPreview from './components/LocalVideoPreview/LocalVideoPreview';
import MenuBar from './components/MenuBar/MenuBar';
import ReconnectingNotification from './components/ReconnectingNotification/ReconnectingNotification';
import Room from './components/Room/Room';

import useHeight from './hooks/useHeight/useHeight';
import useRoomState from './hooks/useRoomState/useRoomState';

Sentry.init({ dsn: 'https://ba050977b865461497954ae331877145@sentry.io/5187820' });

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

  return (
    <Container style={{ height }}>
      <Data roomState={roomState}></Data>
    </Container>
  );
}

// componentShouldUpdate only when roomState changes
const Data = React.memo((props: { roomState: string }) => {
  return (
    <>
      <MenuBar />
      <Main>
        {props.roomState === 'disconnected' ? <LocalVideoPreview /> : <Room />}
        <Controls />
      </Main>
      <ReconnectingNotification />
    </>
  );
});
