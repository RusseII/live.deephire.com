import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import ToggleFullscreenButton from './ToggleFullScreenButton/ToggleFullScreenButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from './Menu/Menu';

import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useRoomState from '../../hooks/useRoomState/useRoomState';

import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { Typography } from '@material-ui/core';
import FlipCameraButton from './FlipCameraButton/FlipCameraButton';
import { DeviceSelector } from './DeviceSelector/DeviceSelector';
import useAsync from '../../hooks/useAsync';
import { getCompanyData } from '../../api'
import {Modal} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const {confirm} = Modal;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      // backgroundColor: theme.palette.background.default,
      backgroundColor: 'white',
    },
    toolbar: {
      [theme.breakpoints.down('xs')]: {
        padding: 0,
      },
    },
    rightButtonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
    },
    form: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      [theme.breakpoints.up('md')]: {
        marginLeft: '2.2em',
      },
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      maxWidth: 200,
    },
    loadingSpinner: {
      marginLeft: '1em',
    },
    displayName: {
      margin: '1.1em 0.6em',
      minWidth: '200px',
      fontWeight: 600,
    },
    joinButton: {
      margin: '1em',
    },
  })
);



export default function MenuBar() {
  const classes = useStyles();
  let { URLRoomName } = useParams();


  

  if (!URLRoomName) {
    URLRoomName = window.sessionStorage.getItem('room') || '';
  }

  const URLUserName = window.sessionStorage.getItem('user') || '';

  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName,setRoomName] = useState<string>('');



  interface valueProps {
    execute: () => null
    value: {
      companyName: string
      logo: string
    }
  }
  const { execute, value }: any = useAsync(getCompanyData, false);
  
 
  useEffect(() => {
    execute(URLRoomName)
  }, [URLRoomName, execute])

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }

    if (URLUserName) {
      setName(URLUserName);
    }

    if (URLRoomName && URLUserName) {
      getToken(URLUserName, URLRoomName).then(token => connect(token));
    }
  
  }, [URLRoomName, URLUserName, connect, getToken]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setRoomName(event.target.value);
  // };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    const confirmation = await showConfirm()
    if (!confirmation) return

    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    if (!window.location.origin.includes('twil.io')) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    getToken(name, roomName).then(token => connect(token));
  };


  const showConfirm = async () => (
    new Promise((resolve, reject) => 
    confirm({
      content: `This meeting will be automatically recorded for note taking purposes. After the meeting, ${value.companyName} will get the recording. Contact them if you need further information.`,
      icon: <ExclamationCircleOutlined />,
      title: 'Meeting will be recorded',
      okText: "Join Room",
      cancelText: "Leave",
      maskStyle: {backgroundColor: 'rgba(0,0,0,0.9'},
     
      onOk() {
        console.log("ok")
        resolve(true)
      },
      onCancel() {
        resolve(false)
      },
    })
    )
  )

  return (
    <AppBar className={classes.container} position="static">
      {/* <RecordingConsent company="Company"/> */}
      <Toolbar className={classes.toolbar}>
        {roomState === 'disconnected' ? (
          <form className={classes.form} onSubmit={handleSubmit}>

            {window.location.search.includes('customIdentity=true') || !user?.displayName ? (
              <TextField
                id="menu-name"
                label="Name"
                className={classes.textField}
                value={name}
                onChange={handleNameChange}
                margin="dense"
              />
            ) : (
                <Typography className={classes.displayName} variant="body1">
                  {user.displayName}
                </Typography>
              )}


            {/* <TextField
              id="menu-room"
              label="Room"
              className={classes.textField}
              value={roomName}
              onChange={handleRoomNameChange}
              margin="dense"
            /> */}
            <Button
              className={classes.joinButton}
              type="submit"
              color="primary"
              variant="contained"
              disabled={isConnecting || !name || !roomName || isFetching}
            >
              Join Room
            </Button>
            {(isConnecting || isFetching) && <CircularProgress className={classes.loadingSpinner} />}
          </form>
        ) : (
            // null
            <img alt={value ? value!.companyName: "Company"} style={{ height: 40 }} src= { value ? value!.logo : ''} />
            // <h3>{roomName}</h3
          )}
        <div className={classes.rightButtonContainer}>
          <FlipCameraButton />
          <DeviceSelector />
          <ToggleFullscreenButton />
          <Menu />
        </div>
      </Toolbar>
    </AppBar>
  );
}
