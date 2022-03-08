import { QuizCardHeader } from "./../components/Quiz/QuizCardHeader";
import { FadeLayout } from "components";
import { useApp } from "context/app";
import { useSocket, useSocketEvent } from "context/socket";
// import { useFetchQuizQuestions } from "hooks/useFetchQuizQuestions";
import { useEffect, useMemo, useState, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import useSound from "use-sound";
import { IoCheckbox, IoCloseCircle } from "react-icons/io5";
import { ScoreBoard } from "components/ScoreBoard";
import BottomScoreboard from "components/Quiz/BottomScoreboard";
import useKeyPress from "hooks/useKeyPress";
// import { socket } from "lib/socket";

type ITimerCallback = void | { shouldRepeat: boolean; delay: number };

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

const TIMER_CONSTANT = 4000;
const Quiz = ({ questions }) => {
  const socket = useSocket();
  // useFetchQuizQuestions();

  const [playTick, { stop: stopTick }] = useSound("/sounds/Clock-Ticking.mp3");
  const isMPressed = useKeyPress("m");
  const { quiz } = useApp();

  const [step, setStep] = useState(0);
  const [timerKey, setTimerKey] = useState(0);
  // const [isBonus, setIsBonus] = useState(false);
  const isBonus = useRef(false);
  const [yourPick, setYourPick] = useState("");
  const [answeredContestant, setAnsweredContestant] = useState(null);

  const [currentOptionSelected, setCurrentOptionSelected] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [isOptionsDisabled, setIsOptionsDisabled] = useState(false);
  // const isOptionsDisabled = useRef(false);
  const [score, setScore] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [showScore, setShowScore] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    setTimerKey((prev) => prev + 1);
  }, [isBonus, step]);

  const currentQuestion = useMemo(() => questions[step], [questions, step]);

  const timerCallback: (v: number) => ITimerCallback = () => {
    console.log(step, questions.length - 1, step <= questions.length - 1);

    if (!isOptionsDisabled) {
      if (isBonus.current) {
        // setIsBonus(false);
        isBonus.current = false;
      }
      if (step < questions.length - 1) {
        setCurrentOptionSelected(null);
        setCorrectOption(null);
        setIsOptionsDisabled(false);
        // isOptionsDisabled.current = false;
        setStep((prev) => prev + 1);
        // playTick();
        return { shouldRepeat: true, delay: 1 };
        // return [true, 1000] as [boolean, number];
      } else {
        // stopTick();
        setShowScore(true);
      }
    }
  };

  // const {} = useSocketEvent("response", validateAnswer);

  useEffect(() => {
    // socket.connect();
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("disconnect", (reason) =>
      console.log(`Client disconnected: ${reason}`)
    );
    socket.on("reconnect", (socket) => {
      console.log("Sono riconnesso!", socket);
    });

    socket.on("connect_error", (reason) =>
      console.log(`Client connect_error: ${reason}`)
    );

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    function handler(_val) {
      const val = { device: _val.device, option: _val.option.toUpperCase() };
      console.log("socket:=> response connected", val);
      const _currentQuestion = questions[step];
      const answer = _currentQuestion.answer;
      if (isOptionsDisabled) return;
      if (isBonus.current && answeredContestant === val.device) return;
      if (!isBonus.current && answeredContestant) setAnsweredContestant(null);
      const selectedOption =
        _currentQuestion.options[options.indexOf(val.option)];
      console.log(selectedOption, answer);

      setIsOptionsDisabled(true);
      setCurrentOptionSelected(selectedOption);
      setCorrectOption(answer);

      setYourPick(
        `Contestant ${val.device} chose ${val.option}, ${selectedOption}`
      );

      if (selectedOption === answer) {
        // alert("CORRECT");
        setScore((oldScore) => ({
          ...oldScore,
          [val.device]: oldScore[val.device] + (isBonus.current ? 5 : 10),
        }));
        timerRef.current = setTimeout(() => {
          if (step < questions.length) {
            setStep((v) => v + 1);
            setCurrentOptionSelected(null);
            setCorrectOption(null);
            setIsOptionsDisabled(false);
            // setIsBonus(false);
            isBonus.current ? (isBonus.current = false) : null;
          } else {
            setShowScore(true);
          }
        }, TIMER_CONSTANT);
      } else {
        if (!isBonus.current) {
          setAnsweredContestant(val.device);
          setScore((oldScore) => ({
            ...oldScore,
            [val.device]:
              oldScore[val.device] >= 5 ? oldScore[val.device] - 5 : 0,
          }));
        }
        console.log("out timeout", { isBonus });
        timerRef.current = setTimeout(() => {
          console.log("in timeout", { isBonus });
          if (isBonus.current) {
            setStep((v) => v + 1);
            // setIsBonus(false);
          } else {
            // setIsBonus(true);
          }
          isBonus.current = !isBonus.current;
          setIsOptionsDisabled(false);
          setTimerKey((prev) => prev + 1);
          // setIsBonus((v) => !v);
          setCurrentOptionSelected(null);
          setCorrectOption(null);
          // setIsOptionsDisabled(false);
        }, TIMER_CONSTANT);
      }
    }
    socket.on("response", handler);

    return () => {
      socket.off("response", handler);
      // socket.disconnect();
    };
  }, [answeredContestant, isOptionsDisabled, questions, socket, step]);

  useEffect(() => {
    if (isMPressed) {
      console.log("m pressed");
      playTick();
    } else stopTick();
  }, [isMPressed, playTick, stopTick]);

  useEffect(() => {
    if (isOptionsDisabled) {
      stopTick();
    } else playTick();
    // //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOptionsDisabled, playTick, stopTick]);

  // console.log({ currentQuestion });

  if (showScore || step >= questions.length) {
    return <ScoreBoard score={score} />;
  }
  return (
    <FadeLayout>
      <div className="flex justify-around min-h-screen items-center px-4">
        <div className="bg-gray-100 rounded-xl max-w-[450px] py-8 px-6 mx-auto w-full">
          <div className="text-center font-bold text-2xl">{quiz.title}</div>
          <div className="">
            <QuizCardHeader
              step={step}
              isBonus={isBonus.current}
              currentQuestion={currentQuestion}
              questions={questions}
              currentOptionSelected={currentOptionSelected}
              yourPick={yourPick}
            />
            <ul>
              {currentQuestion?.options?.map((option, i) => (
                <li key={i} className="bg-white rounded-lg shadow flex my-3">
                  <div className="w-10 text-center bg-green-600 text-white flex justify-center items-center">
                    {options[i]}
                  </div>
                  <div className="py-4 px-2 max-w-[500px] flex justify-between items-center w-full">
                    <p
                      className=""
                      dangerouslySetInnerHTML={{ __html: option }}
                    ></p>
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
            {isBonus.current && (
              <p className="text-2xl text-center mb-4 uppercase font-bold">
                Bonus
              </p>
            )}
            <CountdownCircleTimer
              key={timerKey}
              isPlaying={!isOptionsDisabled}
              duration={isBonus.current ? 15 : 135}
              colors={["#004777", "#F7B801", "#A30000"]}
              colorsTime={[135, 135 / 2, 135 / 3]}
              onComplete={timerCallback}
              // onComplete={() => [true, 1000]}
            >
              {renderTime}
            </CountdownCircleTimer>
          </div>
        </div>
        <BottomScoreboard score={score} />
      </div>
    </FadeLayout>
  );
};

export default Quiz;
