import React, { useState, useEffect, useContext } from 'react';
import { LocalVideoTrack } from 'twilio-video';
import VideoTrack from '../VideoTrack/VideoTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Col, Row, Typography, Button, Form, Input, Radio } from 'antd';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { isMobile } from '../../utils';

import { GlobalContext } from '../../ContextWrapper';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';

import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
  width: 100,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    preview: {
      height: '100%',
      [theme.breakpoints.down('sm')]: {
        height: 'auto',
      },
    },
  })
);

export default function LocalVideoPreview() {
  const globalData = useContext(GlobalContext);
  const { companyData, liveData, setUserName } = globalData;
  const classes = useStyles();

  const { localTracks } = useVideoContext();
  let { URLRoomName } = useParams();

  if (!URLRoomName) {
    URLRoomName = window.sessionStorage.getItem('room') || '';
  }

  const URLUserName = window.sessionStorage.getItem('user') || '';

  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  const [roomName, setRoomName] = useState<string>('');

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }

    if (URLRoomName && URLUserName) {
      getToken(URLUserName, URLRoomName).then(token => connect(token));
    }
  }, [URLRoomName, URLUserName, connect, getToken, roomName, setUserName]);

  // useEffect(() => {
  //   setUserName('SKIP INTRO SCREEN');
  //   getToken('SKIP INTRO SCREEN', roomName).then(token => connect(token));
  // }, []);

  const handleSubmit = async (values: any) => {
    console.log(values, 'values');
    const { name, selectedName } = values;
    const usableName = name || selectedName;

    const confirmation = await showConfirm();
    if (!confirmation) return;

    Modal.destroyAll();

    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setUserName(usableName);
    getToken(usableName, roomName).then(token => connect(token));
  };

  const showConfirm = async () =>
    new Promise((resolve, reject) =>
      Modal.confirm({
        content: `This meeting will be automatically recorded for note taking purposes. After the meeting, ${companyData?.companyName} will get the recording. Contact them if you need further information.`,
        icon: <ExclamationCircleOutlined />,
        title: 'Meeting will be recorded',
        okText: 'Join Room',
        cancelText: 'Leave',
        maskStyle: { backgroundColor: 'rgba(0,0,0,0.9' },

        onOk() {
          console.log('ok');
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      })
    );

  const videoTrack = localTracks.find(track => track.name.includes('camera')) as LocalVideoTrack;

  const JoinPart = () => {
    const [radioValue, setRadioValue] = useState(null);
    const [nameInput, setNameInput] = useState('');

    const { candidateName, clientName, recruiterName } = liveData || {};
    return (
      <Col xs={24} sm={24} md={7} lg={6}>
        <Row style={{ justifyContent: 'center' }}>
          <Typography.Title level={2}>Ready to Join?</Typography.Title>
        </Row>
        {/* <Row >
          <Typography.Paragraph>{`${companyData?.companyName ? companyData?.companyName + ',' : ''} ${
            liveData?.jobName ? liveData.jobName + ',' : ''
          } ${liveData?.candidateName ? liveData?.candidateName : ''}`}</Typography.Paragraph>
        </Row> */}
        <Row justify="center" style={{ marginBottom: 4 }}>
          Select your name:
        </Row>
        <Row justify="center">
          <Form hideRequiredMark onFinish={handleSubmit}>
            <Form.Item
              name="selectedName"
              // label="Select your name below"
              rules={[{ required: true, message: 'Please select your name above!' }]}
            >
              <Radio.Group onChange={e => setRadioValue(e.target.value)}>
                {candidateName && (
                  <Radio style={radioStyle} value={candidateName}>
                    {candidateName}
                  </Radio>
                )}
                {clientName && (
                  <Radio style={radioStyle} value={clientName}>
                    {clientName}
                  </Radio>
                )}
                {recruiterName && (
                  <Radio style={radioStyle} value={recruiterName}>
                    {recruiterName}
                  </Radio>
                )}
                <Radio style={radioStyle} value={4}>
                  Enter Name...
                  {radioValue === 4 ? (
                    <Form.Item name="name" noStyle rules={[{ required: true, message: 'Please input your name' }]}>
                      <Input
                        placeholder="Enter your name"
                        style={{ width: 150, marginLeft: 10 }}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                      />
                    </Form.Item>
                  ) : null}
                </Radio>
              </Radio.Group>
            </Form.Item>
            {/* <Form.Item name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
            <Input style={{ maxWidth: 200 }} placeholder="Enter your name" />
          </Form.Item> */}
            <Form.Item>
              <Button loading={isFetching || isConnecting} type="primary" htmlType="submit">
                Join Room
              </Button>
            </Form.Item>
          </Form>
        </Row>
        {/* <Row justify='center'><Input style={{maxWidth: 200, marginBottom:24}} placeholder="Name"></Input></Row>
      
      <Row justify='center'><Button onClick={(e: any) => handleSubmit(e)} type='primary'>Join Room</Button></Row> */}
      </Col>
    );
  };

  const PreviewRoom = ({ track }: any) => {
    return (
      <Row gutter={24} align="middle" className={classes.preview}>
        <Col xs={2} sm={2} md={2} lg={4}></Col>
        <Col xs={20} sm={20} md={11} lg={9}>
          {track ? <VideoTrack track={track} isLocal /> : <NoVideo />}
        </Col>
        {!isMobile && <JoinPart />}
      </Row>
    );
  };

  return <PreviewRoom track={videoTrack} />;
}

// const NoVideoTrack = () => {
//   return (
//   <div style={{padding: 20}}><p>There is an issue connecting to your Camera.</p>
//   <div>Please <a target="_blank" rel="noopener noreferrer" href='https://help.deephire.com/en/article/fixing-video-issues-8k7exw/'>click here</a> to learn how to fix common issues</div>
//   </div>)
// }

const NoVideo = () => (
  <div style={{ width: '100%', position: 'relative', display: 'inline-block' }}>
    <div style={{ backgroundColor: 'black', paddingTop: '56.25%', display: 'block', color: 'white' }}>
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
        <Typography.Text style={{ color: 'white', fontSize: 24 }}>Camera is off</Typography.Text>
      </div>
    </div>
  </div>
);
