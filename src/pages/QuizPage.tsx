import useAxios from "axios-hooks";
import classNames from "classnames";
import { FadeLayout } from "components";
import { API, SOCKET_URL } from "config";
import { useApp } from "context/app";
import { useSocket, useSocketEvent } from "context/socket";
import { useEffect, useMemo, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useParams } from "react-router";
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

const QuizPage = () => {
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
  const timerCallback: (v: number) => void | [boolean, number] = () => {
    console.log(
      step,
      quiz.questions.length - 1,
      step <= quiz.questions.length - 1
    );
    // stopTick();
    if (step <= quiz.questions.length - 1) {
      setStep((prev) => prev + 1);
      playTick();
      return [true, 1000] as [boolean, number];
    } else {
      stopTick();
    }
  };

  const [playTick, { stop: stopTick }] = useSound("/sounds/Clock-Ticking.mp3");
  const { quizId } = useParams();
  const [{ data: questionData, loading }] = useAxios(
    API.getAllQuestions(quizId)
  );
  console.log(questionData, loading);
  const { setQuiz, quiz } = useApp();

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // use WebSocket first, if available
      reconnectionDelayMax: 20000,
    });
    socket.on("response", () => {
      console.log("response");
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

  useEffect(() => {
    if (questionData?.data)
      setQuiz({
        questions: questionData?.data,
      });
  }, [questionData, setQuiz]);

  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [yourPick, setYourPick] = useState("");

  const currentQuestion = useMemo(
    () => quiz.questions[step],
    [quiz.questions, step]
  );

  return (
    <FadeLayout>
      <div className="flex justify-around min-h-screen items-center px-4">
        <div className="bg-gray-100 rounded-xl max-w-[500px] py-8 px-4 mx-auto">
          <div className="text-center font-bold text-2xl">{quiz.title}</div>
          <div className="">
            <div className="text-2xl my-4">
              Question {step + 1}: {currentQuestion?.question}
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
              {currentQuestion?.options.map((v, i) => (
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
          <div className="flex justify-center">
            <CountdownCircleTimer
              isPlaying
              duration={16}
              colors={[
                ["#004777", 0.33],
                ["#F7B801", 0.33],
                ["#A30000", 1],
              ]}
              onComplete={timerCallback}
              // onComplete={() => [true, 1000]}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
        </div>
      </div>
    </FadeLayout>
  );
};

export default QuizPage;
