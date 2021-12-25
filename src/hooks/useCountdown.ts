/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";

interface IOptions {
  intervalTime?: number;
  now?: () => Date;
}

function useCountdown(date: () => Date, options = {} as IOptions) {
  const { intervalTime = 1000, now = () => Date.now() } = options;
  const [timeLeft, setTimeLeft] = useState(
    // @ts-ignore
    () => new Date(date()) - new Date(now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 0) {
          clearInterval(interval);

          return 0;
        }

        return current - intervalTime;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [intervalTime]);

  return timeLeft;
}

export default useCountdown;
