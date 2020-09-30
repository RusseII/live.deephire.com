import React, { useEffect, useContext } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  LocalAudioTrack,
  LocalVideoTrack,
  LocalDataTrack,
  Participant,
  RemoteAudioTrack,
  RemoteVideoTrack,
  RemoteDataTrack,
} from 'twilio-video';

import { Typography } from 'antd';

import AudioLevelIndicator from '../AudioLevelIndicator/AudioLevelIndicator';
import BandwidthWarning from '../BandwidthWarning/BandwidthWarning';
import NetworkQualityLevel from '../NewtorkQualityLevel/NetworkQualityLevel';
import ParticipantConnectionIndicator from './ParticipantConnectionIndicator/ParticipantConnectionIndicator';
import PinIcon from './PinIcon/PinIcon';
import ScreenShare from '@material-ui/icons/ScreenShare';
import VideocamOff from '@material-ui/icons/VideocamOff';

import useParticipantNetworkQualityLevel from '../../hooks/useParticipantNetworkQualityLevel/useParticipantNetworkQualityLevel';
import usePublications from '../../hooks/usePublications/usePublications';
import useIsTrackSwitchedOff from '../../hooks/useIsTrackSwitchedOff/useIsTrackSwitchedOff';
import useTrack from '../../hooks/useTrack/useTrack';
import { GlobalContext } from '../../ContextWrapper';
import { MessagesProps } from '../Chat/Chat';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: `${(theme.sidebarWidth * 9) / 16}px`,
      overflow: 'hidden',
      cursor: 'pointer',
      '& video': {
        filter: 'none',
      },
      '& svg': {
        stroke: 'black',
        strokeWidth: '0.8px',
      },
      [theme.breakpoints.down('xs')]: {
        height: theme.sidebarMobileHeight,
        width: `${(theme.sidebarMobileHeight * 16) / 9}px`,
        marginRight: '3px',
        fontSize: '10px',
      },
    },
    isVideoSwitchedOff: {
      '& video': {
        filter: 'blur(4px) grayscale(1) brightness(0.5)',
      },
    },
    infoContainer: {
      position: 'absolute',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      padding: '0.4em',
      width: '100%',
      background: 'transparent',
    },
    hideVideo: {
      background: 'black',
    },
    identity: {
      background: 'rgba(255, 255, 255, 0.7)',
      padding: '0.1em 0.3em',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  })
);

interface ParticipantInfoProps {
  participant: Participant;
  children: React.ReactNode;
  onClick: () => void;
  isSelected: boolean;
}

export default function ParticipantInfo({ participant, onClick, isSelected, children }: ParticipantInfoProps) {
  const { setMessages } = useContext(GlobalContext);
  const publications = usePublications(participant);

  const audioPublication = publications.find(p => p.kind === 'audio');
  const videoPublication = publications.find(p => p.trackName.includes('camera'));
  const dataPublication = publications.find(p => p.kind === 'data');
  const networkQualityLevel = useParticipantNetworkQualityLevel(participant);
  const isVideoEnabled = Boolean(videoPublication);
  const isScreenShareEnabled = publications.find(p => p.trackName.includes('screen'));

  const videoTrack = useTrack(videoPublication);
  const isVideoSwitchedOff = useIsTrackSwitchedOff(videoTrack as LocalVideoTrack | RemoteVideoTrack);

  const audioTrack = useTrack(audioPublication) as LocalAudioTrack | RemoteAudioTrack;
  const dataTrack = useTrack(dataPublication) as LocalDataTrack | RemoteDataTrack;

  const classes = useStyles();
  useEffect(() => {
    if (dataTrack) {
      console.log('subscribed to data track', dataTrack);
      dataTrack.on('message', data => {
        console.log('data', data);
        setMessages!((oldMessages: MessagesProps[]) => [...oldMessages, JSON.parse(data)]);
        console.log('Datatrack Data', data);
      });
    }
  }, [dataTrack, setMessages]);
  return (
    <div
      className={clsx(classes.container, {
        [classes.isVideoSwitchedOff]: isVideoSwitchedOff,
      })}
      onClick={onClick}
      data-cy-participant={participant.identity}
    >
      <div className={clsx(classes.infoContainer, { [classes.hideVideo]: !isVideoEnabled })}>
        <div className={classes.infoRow}>
          <h4 className={classes.identity}>
            <ParticipantConnectionIndicator participant={participant} />
            {participant.identity}
          </h4>
          <NetworkQualityLevel qualityLevel={networkQualityLevel} />
        </div>
        <div>
          <AudioLevelIndicator audioTrack={audioTrack} background="white" />
          {!isVideoEnabled && <VideocamOff />}
          {isScreenShareEnabled && <ScreenShare />}
          {isSelected && <PinIcon />}
        </div>
      </div>
      {isVideoSwitchedOff && <BandwidthWarning />}
      {isVideoEnabled ? children : <NoVideoText text="No video" />}
    </div>
  );
}

const NoVideoText = ({ text }: { text: string }) => (
  <div
    style={{
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography.Text style={{ color: 'white', zIndex: 1, fontSize: 16 }}>{text}</Typography.Text>
  </div>
);
