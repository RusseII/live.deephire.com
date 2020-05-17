import React, { useEffect } from 'react';
import ParticipantStrip from '../ParticipantStrip/ParticipantStrip';
import { styled } from '@material-ui/core/styles';
import MainParticipant from '../MainParticipant/MainParticipant';
import 'antd/dist/antd.css';
import { Drawer, Tabs } from 'antd'
import useAsync from '../../hooks/useAsync';
import { getDocuments } from '../../api'
import { useParams } from 'react-router-dom';

const { TabPane } = Tabs;

function debounce(fn: any, ms: any) {
  let timer: any;
  return function(this: typeof debounce) {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}


export default function Room() {

  let { URLRoomName } = useParams();
  const { execute, value } = useAsync(getDocuments, false);


  const Container = styled('div')(({ theme }) => ({
    position: 'relative',
    height: '100%',
    width: value && dimensions.width > 600 ? 'calc(60vw - 24px)': '100%',
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
    execute(URLRoomName)
  }, [URLRoomName, execute])

  const [dimensions, setDimensions] = React.useState({ 
    height: window.innerHeight,
    width: window.innerWidth
  })
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
  }}, [])
 
  return (
    <Container>
      <ParticipantStrip />
      <MainParticipant />
      {dimensions.width > 600  && <ResumeDrawer candidateData={value} />}
    </Container>
  );
}


interface ResumeDrawerProps {
  candidateData: CandidateData | null
}

const ResumeDrawer = ({ candidateData }: ResumeDrawerProps) => {
  if (candidateData && candidateData.files) {
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
      ><Documents candidateData={candidateData} /></Drawer>)
  }
  return null

}


interface DocumentsProps {
  candidateData: CandidateData
}
interface CandidateData {
  files: File[]
  email: string
}

interface File {
  name: string, uid: string
}

const Documents = ({ candidateData }: DocumentsProps) => (
  <Tabs defaultActiveKey="0">
    {candidateData.files.map((file: File, i: number) => (
      < TabPane tab={file.name} key={i.toLocaleString()}>
        <ShowFile url={`https://a.deephire.com/v1/candidates/${candidateData.email}/documents/${file.uid}`} />
      </TabPane>
    ))}
  </Tabs >
)

const ShowFile = ({ url }: any) => (
  <iframe title='Candidate Document'style={{ width: "100%", height: "60vh" }} src={`https://docs.google.com/gview?url=${url}&embedded=true`}>
    ></iframe>
)
