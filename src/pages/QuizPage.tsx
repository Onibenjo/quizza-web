import classNames from "classnames";
import { useApp } from "context/app";
import { useSocketEvent } from "context/socket";
import { useMemo, useState } from "react";

const options = ["A", "B", "C", "D"];

const QuizPage = () => {
  const {} = useSocketEvent("response", (val) => {
    console.log("socket:=> response connected", val);
    console.log(
      currentQuestion.options[options.indexOf(val.data.option)],
      currentQuestion.answer
    );
    setHasEntered(true);
    setYourPick(
      val.data.option +
        ", " +
        currentQuestion.options[options.indexOf(val.data.option)]
    );
    if (
      currentQuestion.options[options.indexOf(val.data.option)] ===
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
    }
  });

  const { quiz } = useApp();
  const [step, setStep] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [yourPick, setYourPick] = useState("");
  const currentQuestion = useMemo(
    () => quiz.questions[step],
    [quiz.questions, step]
  );

  return (
    <div className="bg-gray-100 rounded-xl max-w-[500px] py-8 px-4 mx-auto my-20">
      <div className="text-center font-bold text-2xl">{quiz.title}</div>
      <div className="">
        <div className="text-2xl my-4">
          Question {step + 1}: {currentQuestion.question}
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
          {currentQuestion.options.map((v, i) => (
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
  );
};

export default QuizPage;
