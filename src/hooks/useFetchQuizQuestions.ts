import { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import { useApp } from "context/app";
import { useParams } from "react-router";
import { API } from "config";
import shuffle from "lib/shuffle";

export const useFetchQuizQuestions = () => {
  const { setQuiz } = useApp();
  const [q, setQ] = useState([]);

  const { quizId } = useParams();
  const [{ data: questionData, loading }] = useAxios(
    API.getAllQuestions(quizId)
  );
  useEffect(() => {
    if (questionData?.data) {
      const questions = questionData.data.map((v) => ({
        ...v,
        options: shuffle(v.options),
      }));
      setQ(shuffle(questions));
      setQuiz({
        questions: shuffle(questions),
      });
    }
  }, [questionData, setQuiz]);

  return [q, loading] as [any[], boolean];
};
