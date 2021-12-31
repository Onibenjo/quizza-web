import Select from "react-select";
import { useState, useEffect } from "react";
import { API, screens } from "config";
import useAxios from "axios-hooks";
import Button from "components/Button";
import { useApp } from "context/app";
import { useNavigate } from "react-router";
import QuizLoader from "components/Loaders/QuizLoader";
import { CitationLayout } from "components/Layout";

const SelectQuestionsPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [canProceed, setCanProceed] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [numQuiz, setNumQuiz] = useState(0);

  const { setQuiz } = useApp();
  const [{ data, loading, error }] = useAxios(API.getAllQuizzes);
  // const [{}, getQuestions] = useAxios({ method: "GET" }, { manual: true });
  const navigate = useNavigate();

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (numQuiz > 0 && selectedOption) {
      try {
        // const {
        //   data: { data: questions },
        // } = await getQuestions({
        //   url: API.getAllQuestions(selectedOption.value),
        // });

        // if (questions.length === 0) {
        //   alert("This quiz has no questions");
        //   return;
        // }

        setQuiz({
          ...data.data.filter((v) => v._id === selectedOption.value)[0],
          numQuiz,
          // questions,
        });
        setShowAnimation(true);
      } catch (error) {
        //
      }
    }
  };

  useEffect(() => {
    if (canProceed) {
      navigate(screens.quiz(selectedOption.value));
    }
  }, [canProceed, navigate, selectedOption]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  if (showAnimation) {
    return <QuizLoader onComplete={() => setCanProceed(true)} />;
  }

  return (
    <CitationLayout>
      <div className="flex justify-center items-center min-h-screen">
        <form
          className="bg-gray-100 rounded-xl min-w-[300px] py-8 px-4 mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="text-center font-bold text-2xl capitalize mb-4">
            Select a quiz
          </div>
          <Select
            value={selectedOption}
            onChange={handleChange}
            options={data.data.map(({ title, _id, ...rest }) => ({
              ...rest,
              value: _id,
              label: title,
            }))}
          />
          <div className="mt-4">
            <label htmlFor="numQuiz">Input number of questions</label>
            <input
              type="number"
              id="numQuiz"
              name="numQuiz"
              className="border p-2 mt-2 rounded w-full"
              placeholder="0"
              value={String(numQuiz)}
              onChange={(e) => setNumQuiz(Number(e.target.value))}
            />
          </div>
          <Button className="mt-4 w-full" type="submit">
            Get Questions
          </Button>
        </form>
      </div>
    </CitationLayout>
  );
};

export default SelectQuestionsPage;
