import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import Chat from '../Chat/Chat';
import { styled } from '@material-ui/core/styles';
import styledComponent from 'styled-components';
import MainParticipant from '../MainParticipant/MainParticipant';
import { Tabs, Input, Button, PageHeader, Row, Col } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Controls from '../Controls/Controls';

import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../ContextWrapper';
import { isMobile } from '../../utils';

import { putDeviceInfo } from '../../api';

const DetectRTC = require('detectrtc');

const StyledTabs = styledComponent(Tabs)`
height: 100%;
.ant-tabs-content {
  height: 100%;
}
`;

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Room() {
  const globalData = useContext(GlobalContext);
  const { candidateData, userName } = globalData;

  const { URLRoomName } = useParams();

  const Container = styled('div')(({ theme }) => ({
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'grid',
    gridGap: '0 16px',
    gridTemplateColumns: `${theme.sidebarWidth}px 1fr 40vw`,

    gridTemplateAreas: '". participantList ." "menuBar menuBar menuBar"',
    gridTemplateRows: '1fr 100px',
    [theme.breakpoints.down('xs')]: {
      gridTemplateAreas: '"participantList" "."',
      gridTemplateColumns: `auto`,
      gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
      gridGap: '6px',
    },
  }));

  const VideoPlusComments = styled('div')(({ theme }) => ({
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  }));

  useEffect(() => {
    (window as any).$crisp.push(['do', 'chat:hide']);
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

  // const [sidebarVisible, setSidebarVisible] = useState(
  //   // !!(!isMobile && candidateData && candidateData.files && candidateData.files[0])
  //   '0'
  // );

  // console.log(sidebarVisible)
  return (
    <Container>
      <ParticipantStrip />
      <VideoPlusComments>
        <div>
          <MainParticipant />
        </div>

        {/* <Col> */}
        <div>{/* <Text></Text> */}</div>
      </VideoPlusComments>
      <div>{candidateData && <Documents candidateData={candidateData} userName={userName} />}</div>
      <Controls />
    </Container>
  );
}

const Text = () => {
  const [value, setValue] = useState('');

  return (
    <ReactQuill
      placeholder="Enter your notes here. Your notes will automatically stored in your DeepHire account after the interview."
      theme="snow"
      value={value}
      onChange={setValue}
    />
  );
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
    <div style={{ padding: 24, height: '100%' }}>
      <StyledTabs>
        {/* {userName && userName.toLowerCase() === 'steven gates' && (
        <TabPane tab="Notes" key="0">
          <TextArea
            placeholder="Enter notes about the interview. This will be saved along with the recording after the interview."
            rows={8}
          />
        </TabPane>
      )} */}
        {/* <TabPane tab="Chat" key="0">
        <Chat name={userName} />
      </TabPane> */}
        {candidateData.files.map((file: File, i: number) => (
          <TabPane style={{ height: '100%' }} tab={file.name} key={(i + 1).toLocaleString()}>
            {console.log('key', i + 1)}
            <ShowFile url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`} />
          </TabPane>
        ))}
      </StyledTabs>
    </div>
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
      style={{ width: '100%', height: '100%' }}
      src={getIframeLink()}
    />
  );
}
