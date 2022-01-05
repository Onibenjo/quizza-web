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
import { Line } from "rc-progress";
import { IoCheckbox, IoCloseCircle } from "react-icons/io5";
import { ScoreBoard } from "components/ScoreBoard";

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
  // const {} = useSocketEvent("response", validateAnswer);
  // const socket = useSocket();
  // useFetchQuizQuestions();

  const [playTick, { stop: stopTick }] = useSound("/sounds/Clock-Ticking.mp3");
  const { quiz } = useApp();

  const [step, setStep] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  const [isBonus, setIsBonus] = useState(false);
  const [yourPick, setYourPick] = useState("");

  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  const [score, setScore] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    setTimerKey((prev) => prev + 1);
  }, [isBonus, step]);

  const currentQuestion = useMemo(() => questions[step], [questions, step]);

  const timerCallback: (v: number) => void | [boolean, number] = () => {
    console.log(step, questions.length - 1, step <= questions.length - 1);

    if (!isOptionsDisabled) {
      if (isBonus) {
        setIsBonus(false);
      }
      if (step < questions.length - 1) {
        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        setStep((prev) => prev + 1);
        playTick();
        return [true, 1000] as [boolean, number];
      } else {
        stopTick();
        setShowScore(true);
      }
    }
  };

  const validateAnswer = useCallback(
    (_val) => {
      const val = { device: _val.device, option: _val.option.toUpperCase() };
      console.log("socket:=> response connected", val);
      console.log(currentQuestion);
      console.log(
        currentQuestion.options[options.indexOf(val.option)],
        currentQuestion.answer
      );
      if (isOptionsDisabled) return;

      const selectedOption =
        currentQuestion.options[options.indexOf(val.option)];

      setIsOptionsDisabled(true);
      setCurrentOptionSelected(selectedOption);
      setCorrectOption(currentQuestion.answer);

      setYourPick(val.option + ", " + selectedOption);
      // return;
      if (selectedOption === currentQuestion.answer) {
        setScore((oldScore) => ({
          ...oldScore,
          [val.device]: oldScore[val.device] + (isBonus ? 5 : 10),
        }));

        setTimeout(() => {
          if (step < questions.length) {
            setStep((v) => v + 1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            setIsBonus(false);
          } else {
            setShowScore(true);
          }
        }, 3000);
      } else {
        setTimeout(() => {
          if (isBonus) {
            setStep((v) => v + 1);
            // setIsBonus(false);
          } else {
            // setIsBonus(true);
          }
          setIsBonus((v) => !v);
          setCurrentOptionSelected(null);
          setCorrectOption(null);
          setIsOptionsDisabled(false);
        }, 2000);
      }
    },
    [currentQuestion, isBonus, isOptionsDisabled, questions, step]
  );

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"], // use WebSocket first, if available
      reconnectionDelayMax: 20000,
    });
    socket.on("response", (val) => {
      console.log("response");
      validateAnswer(val);
    });
    // socket.on("connection", () => {
    //   console.log("socket connected");
    // });

    return () => {
      socket.disconnect();
    };
  }, [validateAnswer]);

  useEffect(() => {
    // playTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log({ currentQuestion });

  if (showScore || step >= questions.length) {
    return <ScoreBoard score={score} />;
  }
  return (
    <FadeLayout>
      <div className="flex justify-around min-h-screen items-center px-4">
        <div className="bg-gray-100 rounded-xl max-w-[450px] py-8 px-6 mx-auto w-full">
          <div className="text-center font-bold text-2xl">{quiz.title}</div>
          <div className="">
            <Line
              percent={((step + 1) / questions.length) * 100}
              strokeWidth={3}
              trailWidth={3}
              strokeColor="rgba(5, 150, 105, 1)"
              // strokeColor="rgba(17, 24, 39, 1)"
            />
            <div className="text-2xl mt-4 text-gray-500">
              <span className="text-4xl">{step + 1}</span>
              <span className="text-2xl">
                {"/"}
                {questions.length}
              </span>
            </div>
            {isBonus && (
              <p className="font-bold text-2xl italic text-green-600">BONUS</p>
            )}
            <div className="text-2xl">{currentQuestion?.question}</div>
            {currentOptionSelected ? (
              <div
                className={classNames("text-xl", {
                  "text-red-700":
                    !currentOptionSelected === currentQuestion.answer,
                  "text-green-700":
                    currentOptionSelected === currentQuestion.answer,
                })}
              >
                You picked {yourPick} and you're{" "}
                {currentOptionSelected === currentQuestion.answer
                  ? "Correct"
                  : "Wrong"}
              </div>
            ) : null}
            <ul>
              {currentQuestion?.options?.map((option, i) => (
                <li key={i} className="bg-white rounded-lg shadow flex my-3">
                  <div className="w-10 text-center bg-green-600 text-white flex justify-center items-center">
                    {options[i]}
                  </div>
                  <div className="py-4 px-2 max-w-[500px] flex justify-between items-center w-full">
                    <p className="">{option}</p>
                    <span>
                      {option === correctOption ? (
                        <IoCheckbox color="rgba(5, 150, 105,1)" size={30} />
                      ) : option === currentOptionSelected ? (
                        <IoCloseCircle color="#A30000" size={30} />
                      ) : null}
                    </span>
                  </div>
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
              key={timerKey}
              isPlaying
              duration={isBonus ? 15 : 135}
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
          </div>
        </div>
        <div className="w-full absolute h-[40px] px-2 pb-8 bg-white bottom-0 grid grid-cols-2 items-center">
          <div className="text-2xl font-bold">Scoreboard:</div>
          <div className="grid grid-cols-2 text-xl">
            <p className="">
              Device 1 {"=>"} {score["1"]}
            </p>
            <p className="">
              Device 2 {"=>"} {score["2"]}
            </p>
            <p className="">
              Device 3 {"=>"} {score["3"]}
            </p>
            <p className="">
              Device 4 {"=>"} {score["4"]}
            </p>
          </div>
        </div>
      </div>
    </FadeLayout>
  );
};

export default Quiz;
