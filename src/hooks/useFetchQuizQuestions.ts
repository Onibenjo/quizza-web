import { useEffect } from "react";
import useAxios from "axios-hooks";
import { useApp } from "context/app";
import { useParams } from "react-router";
import { API } from "config";

export const useFetchQuizQuestions = () => {
  const { setQuiz } = useApp();

  const { quizId } = useParams();
  const [{ data: questionData, loading }] = useAxios(
    API.getAllQuestions(quizId)
  );
  useEffect(() => {
    if (questionData?.data) {
      setQuiz({
        questions: questionData?.data,
      });
    }
  }, [questionData, setQuiz]);

  return [questionData?.data, loading];
};
