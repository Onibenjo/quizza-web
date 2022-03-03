import classNames from "classnames";
import { Line } from "rc-progress";
import React from "react";
export function QuizCardHeader({
  step,
  isBonus,
  currentQuestion,
  questions,
  currentOptionSelected,
  yourPick,
}) {
  return (
    <div className="">
      <Line
        percent={((step + 1) / questions.length) * 100}
        strokeWidth={3}
        trailWidth={3}
        strokeColor="rgba(5, 150, 105, 1)"
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
            "text-red-700": !currentOptionSelected === currentQuestion.answer,
            "text-green-700": currentOptionSelected === currentQuestion.answer,
          })}
        >
          You picked {yourPick} and you're{" "}
          {currentOptionSelected === currentQuestion.answer
            ? "Correct"
            : "Wrong"}
        </div>
      ) : null}
    </div>
  );
}
