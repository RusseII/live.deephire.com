import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dotRed: {
      height: '10px',
      width: '10px',
      backgroundColor: 'red',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '6px',
    },
    dotClear: {
      height: '10px',
      width: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: '6px',
    },
    timer: {
      fontSize: '12px',
      color: 'black',
      padding: '10px 16px 10px 16px',
      borderRadius: '20px',
      // "backgroundColor": "rgba(0, 0, 0, 0.54)"
    },
  })
);

const Timer = ({ style }: any) => {
  const styles = useStyles();

  const [time, setTime] = useState(0);

  const timer = setTimeout(function() {
    setTime(time - 1);
  }, 1000);

  const transformTime = (time: any) => new Date(time * 1000).toISOString().substr(14, 5);

  return (
    <span style={style} className={styles.timer}>
      <span className={time % 2 ? styles.dotClear : styles.dotRed} />
      recording
    </span>
  );
};

export default Timer;
