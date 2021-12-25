import { useCallback, useState } from "react";

import useInterval from "./useInterval";

const useCountDownTimer = (props): [string, () => void] => {
  // For Total seconds
  const [timeStamp, setTimeStamp] = useState(
    props.timestamp ? props.timestamp : 0
  );
  // Delay Required
  const [delay] = useState(props.delay ? props.delay : 1000);

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
    const _days = Math.floor(delta / 86400);
    delta -= _days * 86400;

    // calculate (and subtract) whole hours
    const _hours = Math.floor(delta / 3600) % 24;
    delta -= _hours * 3600;

    // calculate (and subtract) whole minutes
    const _minutes = Math.floor(delta / 60) % 60;
    delta -= _minutes * 60;

    // what's left is seconds
    const _seconds = delta % 60;

    setDays(_days);
    setHours(_hours);
    setMinutes(_minutes);
    setSeconds(_seconds);

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

  const resetTimer = useCallback(() => {
    // Clearing days, hours, minutes and seconds
    setDays(props.days || 0);
    setHours(props.hours || 0);
    setMinutes(props.minutes || 0);
    setSeconds(props.seconds || 0);
    // Clearing Timestamp
    setTimeStamp(props.timestamp);
    setSendOnce(true);
  }, [props.days, props.hours, props.minutes, props.seconds, props.timestamp]);

  return [finalDisplayTime, resetTimer];
};

export default useCountDownTimer;
