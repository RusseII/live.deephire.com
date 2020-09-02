import React, { useState, useContext } from 'react';
import 'antd/dist/antd.css';
import { Comment, Form, Button, List, Input, Avatar } from 'antd';
import moment from 'moment';
import { GlobalContext } from '../../ContextWrapper';
// import useLocalTracks from '../VideoProvider/useLocalTracks/useLocalTracks';
import { VideoContext } from '../VideoProvider/index';

const { TextArea } = Input;

const CommentList = ({ comments }: any) => (
  <List
    dataSource={comments}
    // header={`${comments.length} ${comments.length > 1 ? "replies" : "reply"}`}
    itemLayout="horizontal"
    renderItem={(props: any) => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }: any) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Send Message
      </Button>
    </Form.Item>
  </>
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
  const [value, setValue] = useState('');

  const handleSubmit = () => {
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
    setValue('');
    setMessages!([...messages, data]);
  };

  const handleChange = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <div style={{ height: '100%' }}>
      {messages.length > 0 && <CommentList comments={messages} />}
      <Comment
        style={{ width: '100%', position: 'absolute', bottom: 0 }}
        // avatar={
        //   <Avatar
        //     src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        //     alt="Han Solo"
        //   />
        // }
        content={<Editor onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} value={value} />}
      />
    </div>
  );
};

export default Chat;
