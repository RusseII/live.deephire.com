import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import Chat from '../Chat/Chat';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { Tabs, Input, Button } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../ContextWrapper';
import { isMobile } from '../../utils';

import { putDeviceInfo } from '../../api';

const DetectRTC = require('detectrtc');

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Room() {
  const globalData = useContext(GlobalContext);
  const { candidateData, userName } = globalData;

  let { URLRoomName } = useParams();

  const Container = styled('div')(({ theme }) => ({
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'grid',
    gridGap: '16px',
    gridTemplateColumns: `${theme.sidebarWidth}px 1fr ${sidebarVisible ? '40vw' : '0px'}`,

    gridTemplateAreas: '". participantList ."',
    gridTemplateRows: '1fr',
    [theme.breakpoints.down('xs')]: {
      gridTemplateAreas: '"participantList" "."',
      gridTemplateColumns: `auto`,
      gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
      gridGap: '6px',
    },
  }));

  useEffect(() => {
    DetectRTC.load(() => {
      const {
        browser,
        displayResolution,
        displayAspectRatio,
        osName,
        osVersion,
        isWebsiteHasWebcamPermissions,
        isWebsiteHasMicrophonePermissions,
        isWebRTCSupported,
        hasWebcam,
        hasSpeakers,
        hasMicrophone,
      } = DetectRTC;
      const usefulData = {
        ...browser,
        displayResolution,
        displayAspectRatio,
        osName,
        osVersion,
        isWebsiteHasWebcamPermissions,
        isWebsiteHasMicrophonePermissions,
        isWebRTCSupported,
        hasWebcam,
        hasSpeakers,
        hasMicrophone,
      };
      putDeviceInfo(URLRoomName, { ...usefulData, userName });

      (window as any).$crisp.push(['set', 'user:nickname', [userName]]);
      (window as any).$crisp.push(['set', 'session:segments', [['live-interview']]]);
      (window as any).$crisp.push([
        'set',
        'session:event',
        [[['room_join', { URLRoomName, ...usefulData, userName }, 'green']]],
      ]);
    });
  }, [URLRoomName, userName]);

  const [sidebarVisible, setSidebarVisible] = useState(
    !!(!isMobile && candidateData && candidateData.files && candidateData.files[0])
  );

  return (
    <Container>
      <ParticipantStrip />
      <div style={{ marginBottom: 24 }}>
        <MainParticipant />
        <Button onClick={() => setSidebarVisible(flag => !flag)}>Toggle Sidebar</Button>

        <Text></Text>
      </div>
      <div>{candidateData && <Documents candidateData={candidateData} userName={userName} />}</div>
      <div></div>
    </Container>
  );
}

const Text = () => {
  const [value, setValue] = useState('');

  return <ReactQuill theme="snow" value={value} style={{ height: '100%' }} onChange={setValue} />;
};
interface ResumeDrawerProps {
  candidateData: CandidateData | null;
  userName: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface DocumentsProps {
  candidateData: CandidateData;
  userName: string;
}
interface CandidateData {
  files: File[];
  email: string;
}

interface File {
  name: string;
  uid: string;
}

const Documents = ({ candidateData, userName }: DocumentsProps) => {
  return (
    <Tabs defaultActiveKey="0">
      {userName && userName.toLowerCase() === 'steven gates' && (
        <TabPane tab="Notes" key="0">
          <TextArea
            placeholder="Enter notes about the interview. This will be saved along with the recording after the interview."
            rows={8}
          />
        </TabPane>
      )}
      <TabPane tab="Chat" key="0">
        <Chat name={userName} />
      </TabPane>
      {candidateData.files.map((file: File, i: number) => (
        <TabPane tab={file.name} key={i.toLocaleString() + 1}>
          <ShowFile url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`} />
        </TabPane>
      ))}
    </Tabs>
  );
};

const ShowFile = ({ url }: any) => <IframeGoogleDoc url={url} />;

interface IframeGoogleDocsProps {
  url: string;
}

export function IframeGoogleDoc({ url }: IframeGoogleDocsProps) {
  const [iframeTimeoutId, setIframeTimeoutId] = useState<any>();
  const iframeRef: any = useRef(null);

  const getIframeLink = useCallback(() => {
    return `https://docs.google.com/gview?url=${url}&embedded=true`;
  }, [url]);

  const updateIframeSrc = useCallback(() => {
    if (iframeRef.current) {
      iframeRef!.current!.src = getIframeLink();
    }
  }, [getIframeLink]);

  useEffect(() => {
    const intervalId = setInterval(updateIframeSrc, 1000 * 20);
    setIframeTimeoutId(intervalId);
  }, [updateIframeSrc]);

  function iframeLoaded() {
    clearInterval(iframeTimeoutId);
  }

  return (
    <iframe
      title="Candidate Document"
      onLoad={iframeLoaded}
      onError={updateIframeSrc}
      ref={iframeRef}
      style={{ width: '100%', height: 'calc(100vh - (48px + 64px + 46px))' }}
      src={getIframeLink()}
    />
  );
}
