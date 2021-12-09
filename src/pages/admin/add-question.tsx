import Button from "components/Button";
import { screens } from "config";
import { useApp } from "context/app";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { GrFormClose } from "react-icons/gr";
import { Link } from "react-router-dom";

const AddQuestionPage = () => {
  const { quiz, setQuestion } = useApp();
  const navigate = useNavigate();
  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const optionOneRef = useRef(null);
  const optionTwoRef = useRef(null);
  const optionThreeRef = useRef(null);
  const isFirstQuestion = useRef(true);

  useEffect(() => {
    if (!quiz) {
      navigate(screens.createQuiz);
    }
  }, [navigate, quiz]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!questionRef.current?.value || !answerRef.current?.value) {
      alert("Fill in all fields");
      return;
    }
    setQuestion({
      question: questionRef.current?.value,
      answer: answerRef.current?.value,
      options: [
        answerRef.current?.value,
        optionOneRef.current?.value,
        optionTwoRef.current?.value,
        optionThreeRef.current?.value,
      ],
    });
    isFirstQuestion.current = false;
    questionRef.current.value = "";
    answerRef.current.value = "";
    optionOneRef.current.value = "";
    optionTwoRef.current.value = "";
    optionThreeRef.current.value = "";
  };

  return (
    <div className="bg-white rounded-xl min-w-[500px] py-8 px-4">
      <div className="flex justify-between">
        <h1 className="font-bold mb-4 text-xl">Add Question</h1>
        <Link to={screens.createQuiz}>
          <GrFormClose size={30} />
        </Link>
      </div>
      <form className="grid gap-y-4" onSubmit={handleSubmit}>
        <div className="grid">
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            name="question"
            className="border p-2 mt-2 rounded"
            ref={questionRef}
          />
        </div>
        {/* <div className="grid"></div> */}
        <div className="grid mt-4 grid-cols-2 gap-2">
          <div className="grid">
            <label htmlFor="description">Correct answer</label>
            <input
              type="text"
              id="description"
              name="description"
              className="border p-2 mt-2 rounded"
              ref={answerRef}
            />
          </div>
          <div className="grid">
            <label htmlFor="description">Option 1</label>
            <input
              type="text"
              id="description"
              name="description"
              className="border p-2 mt-2 rounded"
              ref={optionOneRef}
            />
          </div>
          <div className="grid">
            <label htmlFor="description">Option 2</label>
            <input
              type="text"
              id="description"
              name="description"
              className="border p-2 mt-2 rounded"
              ref={optionTwoRef}
            />
          </div>
          <div className="grid">
            <label htmlFor="description">Option 3</label>
            <input
              type="text"
              id="description"
              name="description"
              className="border p-2 mt-2 rounded"
              ref={optionThreeRef}
            />
          </div>
        </div>
        <Button type="submit" className="">
          {isFirstQuestion.current ? "Add Question" : "Add another question"}
        </Button>
      </form>
    </div>
  );
};

export default AddQuestionPage;
