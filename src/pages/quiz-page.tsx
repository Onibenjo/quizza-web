import Quiz from "./Quiz";
import { useFetchQuizQuestions } from "hooks/useFetchQuizQuestions";

const QuizPage = () => {
  const [questions, isFetching] = useFetchQuizQuestions();
  return isFetching ? <h1>Loading...</h1> : <Quiz questions={questions} />;
};

export default QuizPage;
