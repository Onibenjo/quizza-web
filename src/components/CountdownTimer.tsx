import useInterval from "hooks/useInterval";
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

interface IProp {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  timestamp: number;
  containerStyle?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  delay?: number;
  timerCallback?: (bool: boolean) => void | null;
  TextComp?: any;
}

const CountDownTimer = forwardRef(({ TextComp, ...props }: IProp, ref) => {
  // For Total seconds
  const [timeStamp, setTimeStamp] = useState(
    props.timestamp ? props.timestamp : 0
  );
  // Delay Required
  const [delay, setDelay] = useState(props.delay ? props.delay : 1000);

  // For days, hours, minutes and seconds
  const [days, setDays] = useState(props.days ? props.days : 0);
  const [hours, setHours] = useState(props.hours ? props.hours : 0);
  const [minutes, setMinutes] = useState(props.minutes ? props.minutes : 0);
  const [seconds, setSeconds] = useState(props.seconds ? props.seconds : 0);

  // Flag for informing parent component when timer is over
  const [sendOnce, setSendOnce] = useState(true);

  // Flag for final display time format
  const [finalDisplayTime, setFinalDisplayTime] = useState("");

  useInterval(() => {
    if (timeStamp > 0) {
      setTimeStamp(timeStamp - 1);
    } else if (sendOnce) {
      if (props.timerCallback) {
        props.timerCallback(true);
      } else {
        console.log("Please pass a callback function...");
      }
      setSendOnce(false);
    }

    let delta = timeStamp;

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    const seconds = delta % 60;

    setDays(days);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);

    // Formatting Time for Display Purpose
    const hr = hours < 10 ? `0${hours}` : hours;
    const min = minutes < 10 ? `0${minutes}` : minutes;
    const sec = seconds < 10 ? `0${seconds}` : seconds;

    let displayTime = "";

    if (days !== 0) {
      displayTime = `${days}:${hr}:${min}:${sec}`;
    }

    if (days === 0 && hours !== 0) {
      displayTime = `${hr}:${min}:${sec}`;
    }

    if (hours === 0 && minutes !== 0) {
      displayTime = `${min}:${sec}`;
    }

    if (minutes === 0 && seconds !== 0) {
      displayTime = `${min}:${sec}`;
    }

    setFinalDisplayTime(displayTime);
  }, delay);

  const refTimer = useRef();
  useImperativeHandle(ref, () => ({
    resetTimer: () => {
      // Clearing days, hours, minutes and seconds
      setDays(props.days);
      setHours(props.hours);
      setMinutes(props.minutes);
      setSeconds(props.seconds);
      // Clearing Timestamp
      setTimeStamp(props.timestamp);
      setSendOnce(true);
    },
  }));

  return (
    <div ref={refTimer} style={props.containerStyle}>
      {TextComp ? (
        <TextComp>{finalDisplayTime}</TextComp>
      ) : (
        <p style={props.textStyle}>{finalDisplayTime}</p>
      )}
    </div>
  );
});

export default CountDownTimer;
