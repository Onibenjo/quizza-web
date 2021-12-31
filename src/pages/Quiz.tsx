import classNames from "classnames";
import { FadeLayout } from "components";
import { SOCKET_URL } from "config";
import { useApp } from "context/app";
import { useSocket, useSocketEvent } from "context/socket";
import { useFetchQuizQuestions } from "hooks/useFetchQuizQuestions";
import { useEffect, useMemo, useState, useCallback } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { io } from "socket.io-client";
import useSound from "use-sound";

const options = ["A", "B", "C", "D"];

const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="flex flex-col items-center">Too late...</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-[#aaa">Remaining</div>
      <div className="text-[40px]">{remainingTime}</div>
      <div className="text-[#aaa">seconds</div>
    </div>
  );
};

const Quiz = ({ questions }) => {
  // const {} = useSocketEvent("response", (val) => {
  //   console.log("socket:=> response connected", val);
  //   console.log(
  //     currentQuestion.options[options.indexOf(val.data.option)],
  //     currentQuestion.answer
  //   );
  //   setHasEntered(true);
  //   setYourPick(
  //     val.data.option +
  //       ", " +
  //       currentQuestion.options[options.indexOf(val.data.option)]
  //   );
  //   if (
  //     currentQuestion.options[options.indexOf(val.data.option)] ===
  //     currentQuestion.answer
  //   ) {
  //     setCorrect(true);
  //     setTimeout(() => {
  //       setHasEntered(false);
  //       setCorrect(false);
  //       setStep((v) => v + 1);
  //     }, 4000);
  //   } else {
  //     setCorrect(false);
  //   }
  // });
  // const socket = useSocket();
  // useFetchQuizQuestions();

  const [playTick, { stop: stopTick }] = useSound("/sounds/Clock-Ticking.mp3");
  const { quiz } = useApp();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // use WebSocket first, if available
      reconnectionDelayMax: 20000,
    });
    socket.on("response", (val) => {
      console.log("response");
      handlr(val);
    });
    socket.on("connection", () => {
      console.log("socket connected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    playTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [isBonus, setIsBonus] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [yourPick, setYourPick] = useState("");
  console.log({ quiz });
  const currentQuestion = useMemo(() => questions[step], [questions, step]);

  const timerCallback: (v: number) => void | [boolean, number] =
    useCallback(() => {
      console.log(quiz);
      console.log(step, questions.length - 1, step <= questions.length - 1);
      stopTick();
      if (isBonus) {
        setIsBonus(false);
      }
      if (step < questions.length - 1) {
        setStep((prev) => prev + 1);
        playTick();
        return [true, 1000] as [boolean, number];
      } else {
        stopTick();
      }
    }, [quiz, step, stopTick, isBonus, playTick]);

  const handlr = (val) => {
    console.log("socket:=> response connected", val);
    console.log(currentQuestion);
    console.log(
      currentQuestion.options[options.indexOf(val.option)],
      currentQuestion.answer
    );
    setHasEntered(true);
    setYourPick(
      val.option + ", " + currentQuestion.options[options.indexOf(val.option)]
    );
    if (
      currentQuestion.options[options.indexOf(val.option)] ===
      currentQuestion.answer
    ) {
      setCorrect(true);
      setTimeout(() => {
        setHasEntered(false);
        setCorrect(false);
        setStep((v) => v + 1);
      }, 4000);
    } else {
      setCorrect(false);
      setIsBonus(true);
    }
  };
  console.log({ currentQuestion });
  return (
    <FadeLayout>
      <div className="flex justify-around min-h-screen items-center px-4">
        <div className="bg-gray-100 rounded-xl max-w-[450px] py-8 px-6 mx-auto w-full">
          <div className="text-center font-bold text-2xl">{quiz.title}</div>
          <div className="">
            <div className="text-2xl my-4">
              <span className="text-4xl">{step + 1}</span>
              <span className="text-2xl">
                {"/"}
                {questions.length}
              </span>
              : {currentQuestion?.question}
            </div>
            {hasEntered ? (
              <div
                className={classNames("text-3xl", {
                  "text-red-700": !correct,
                  "text-green-700": correct,
                })}
              >
                You picked {yourPick} and you're {correct ? "Correct" : "Wrong"}
              </div>
            ) : null}
            <ul>
              {currentQuestion?.options?.map((v, i) => (
                <li key={i} className="bg-white rounded-lg shadow flex my-3">
                  <div className="w-10 text-center bg-green-600 text-white flex justify-center items-center">
                    {options[i]}
                  </div>
                  <div className="py-4 px-2 max-w-[300px]">{v}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl max-w-[500px] py-8 px-4 mx-auto">
          <div className="flex justify-center flex-col">
            {isBonus && (
              <p className="text-2xl text-center mb-4 uppercase font-bold">
                Bonus
              </p>
            )}
            <CountdownCircleTimer
              key={isBonus ? "bonus" : "norms"}
              isPlaying
              duration={isBonus ? 5 : 15}
              colors={[
                ["#004777", 0.33],
                ["#F7B801", 0.33],
                ["#A30000", 0.33],
              ]}
              onComplete={timerCallback}
              // onComplete={() => [true, 1000]}
            >
              {renderTime}
            </CountdownCircleTimer>
            {/* {isBonus ? (
              <CountdownCircleTimer
                key="bonus"
                isPlaying
                duration={5}
                colors={[
                  ["#004777", 0.33],
                  ["#F7B801", 0.33],
                  ["#A30000", 0.33],
                ]}
                onComplete={timerCallback}
                // onComplete={() => [true, 1000]}
              >
                {renderTime}
              </CountdownCircleTimer>
            ) : (
              <CountdownCircleTimer
                isPlaying
                duration={15}
                colors={[
                  ["#004777", 0.33],
                  ["#F7B801", 0.33],
                  ["#A30000", 0.33],
                ]}
                onComplete={timerCallback}
                // onComplete={() => [true, 1000]}
              >
                {renderTime}
              </CountdownCircleTimer>
            )} */}
          </div>
        </div>
      </div>
    </FadeLayout>
  );
};

export default Quiz;
