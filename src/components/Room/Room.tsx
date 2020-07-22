import React, { useEffect, useRef, useState, useCallback, useContext } from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import { Drawer, Tabs, Input } from 'antd';

import { useParams } from 'react-router-dom';
import { GlobalContext } from '../../ContextWrapper';

import { isMobile } from '../../utils';

import { putDeviceInfo } from '../../api';

const DetectRTC = require('detectrtc');

const { TabPane } = Tabs;
const { TextArea } = Input;

function debounce(fn: any, ms: any) {
  let timer: any;
  return function(this: typeof debounce) {
    clearTimeout(timer);
    timer = setTimeout(_ => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

export default function Room() {
  const globalData = useContext(GlobalContext);
  const { candidateData, userName } = globalData;

  let { URLRoomName } = useParams();

  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
  });

  const Container = styled('div')(({ theme }) => ({
    position: 'relative',
    height: '100%',
    width:
      candidateData && candidateData!.files && candidateData!.files[0] && dimensions.width > 600
        ? 'calc(60vw - 24px)'
        : '100%',
    display: 'grid',
    gridTemplateColumns: `${theme.sidebarWidth}px 1fr`,
    gridTemplateAreas: '". participantList"',
    gridTemplateRows: '100%',
    [theme.breakpoints.down('xs')]: {
      gridTemplateAreas: '"participantList" "."',
      gridTemplateColumns: `auto`,
      gridTemplateRows: `calc(100% - ${theme.sidebarMobileHeight + 12}px) ${theme.sidebarMobileHeight + 6}px`,
      gridGap: '6px',
    },
  }));

  useEffect(() => {
    DetectRTC.load(() => {
      putDeviceInfo(URLRoomName, { ...DetectRTC, userName });
      // $crisp.push(["set", "session:event", [[["room_join", {URLRoomName,  ...DetectRTC, userName }, "green"]]]]);
    });
  }, [URLRoomName, userName]);

  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });
    }, 1000);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  return (
    <Container>
      <ParticipantStrip />
      <MainParticipant />
      {<ResumeDrawer candidateData={candidateData} userName={userName} />}
    </Container>
  );
}

interface ResumeDrawerProps {
  candidateData: CandidateData | null;
  userName: string | null;
}

const ResumeDrawer = ({ candidateData, userName }: ResumeDrawerProps) => {
  if (!isMobile && candidateData && candidateData.files && candidateData.files[0]) {
    return (
      <Drawer
        mask={false}
        width={'40vw'}
        zIndex={0}
        bodyStyle={{ backgroundColor: '#f1f2f5' }}
        title="Basic Drawer"
        placement="right"
        closable={true}
        visible={true}
      >
        <Documents candidateData={candidateData} userName={userName} />
      </Drawer>
    );
  }
  return null;
};

interface DocumentsProps {
  candidateData: CandidateData;
  userName: string | null;
}
interface CandidateData {
  files: File[];
  email: string;
}

interface File {
  name: string;
  uid: string;
}

const Documents = ({ candidateData, userName }: DocumentsProps) => (
  <Tabs defaultActiveKey="0">
    {userName && userName.toLowerCase() === 'steven gates' && (
      <TabPane tab="Notes" key="0">
        <TextArea
          placeholder="Enter notes about the interview. This will be saved along with the recording after the interview."
          rows={8}
        />
      </TabPane>
    )}
    {candidateData.files.map((file: File, i: number) => (
      <TabPane tab={file.name} key={i.toLocaleString() + 1}>
        <ShowFile url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`} />
      </TabPane>
    ))}
  </Tabs>
);

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
