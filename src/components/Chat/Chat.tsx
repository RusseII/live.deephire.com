import React, { useState, useContext } from 'react';
import 'antd/dist/antd.css';
import { Comment, Form, Button, List, Input, Avatar, Row } from 'antd';
import moment from 'moment';
import { GlobalContext } from '../../ContextWrapper';
// import useLocalTracks from '../VideoProvider/useLocalTracks/useLocalTracks';
import { VideoContext } from '../VideoProvider/index';
import { SendOutlined } from '@ant-design/icons';

const { TextArea, Search } = Input;

const CommentList = ({ comments }: any) => (
  <List
    dataSource={comments}
    // header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props: any) => <Comment {...props} />}
  />
);

const Editor = ({ handleSubmit }: any) => (
  <Search
    style={{ width: '100%' }}
    placeholder="Type group message"
    onSearch={handleSubmit}
    enterButton={<SendOutlined />}
  />
  // <>
  //   <Form.Item>
  //     <TextArea rows={4} onChange={onChange} value={value} />
  //   </Form.Item>
  //   <Form.Item>
  //     <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
  //       Send Message
  //     </Button>
  //   </Form.Item>
  // </>
);

export interface MessagesProps {
  author: string;
  // avatar: any;
  content: any;
  datetime: any;
}
const Chat = ({ name }: { name: string }) => {
  const { messages, setMessages } = useContext(GlobalContext);
  const { dataTrack } = useContext(VideoContext);
  // const [comments, setComments] = useState<MessagesProps[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (value: string) => {
    if (!value) {
      return;
    }

    setSubmitting(true);

    const data = {
      author: name,
      // avatar: 'h',
      content: value,
      datetime: moment().fromNow(),
    };
    // console.log("sending to datatrack in chat", value, dataTrack)
    dataTrack.send(JSON.stringify(data));

    setSubmitting(false);
    setMessages!([...messages, data]);
  };

  return (
    <Row style={{ height: '100%', marginRight: 24 }}>
      <div style={{ height: 'calc(100% - 40px)', overflow: 'auto', flexDirection: 'column-reverse', display: 'flex' }}>
        {' '}
        {messages.length > 0 ? <CommentList comments={messages} /> : <div style={{ height: 50, width: 50 }} />}
      </div>
      <div style={{ width: '100%' }}>
        {' '}
        <Editor handleSubmit={handleSubmit} />
      </div>
    </Row>
  );
};

export default Chat;
