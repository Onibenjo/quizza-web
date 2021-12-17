import Button from "components/Button";
import { API, screens } from "config";
import { useApp } from "context/app";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { GrFormClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import useAxios from "axios-hooks";
import PaperPlaneLoader from "components/Loaders/PaperPlaneLoader";

const AddQuestionPage = () => {
  const { quiz, setQuestion } = useApp();
  const navigate = useNavigate();
  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const optionOneRef = useRef(null);
  const optionTwoRef = useRef(null);
  const optionThreeRef = useRef(null);

  const [{ loading, error }, postData] = useAxios(
    { url: API.createQuestion(quiz?.id), method: "POST" },
    { manual: true }
  );
  console.log({ loading, error });

  useEffect(() => {
    if (!quiz?.id) {
      navigate(screens.createQuiz);
    }
  }, [navigate, quiz]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!questionRef.current?.value || !answerRef.current?.value) {
        alert("Fill in all fields");
        return;
      }
      const options: string[] = [
        answerRef.current?.value,
        optionOneRef.current?.value,
        optionTwoRef.current?.value,
        optionThreeRef.current?.value,
      ];
      if (
        [...new Set(options.map((v) => v.toLowerCase()).map((v) => v.trim()))]
          .length !== 4
      ) {
        alert("Holla, wrong");
        return;
      }

      await postData({
        data: {
          question: questionRef.current?.value,
          answer: answerRef.current?.value,
          options,
        },
      });
      setQuestion({
        question: questionRef.current?.value,
        answer: answerRef.current?.value,
        options,
      });

      questionRef.current.value = "";
      answerRef.current.value = "";
      optionOneRef.current.value = "";
      optionTwoRef.current.value = "";
      optionThreeRef.current.value = "";
    } catch (error) {
      //
    }
  };

  // const onSubmit = async () => {
  //   try {
  //     await postData({
  //       data: {
  //         question: questionRef.current?.value,
  //         answer: answerRef.current?.value,
  //         options: [
  //           answerRef.current?.value,
  //           optionOneRef.current?.value,
  //           optionTwoRef.current?.value,
  //           optionThreeRef.current?.value,
  //         ],
  //       },
  //     });
  //   } catch (error) {
  //     //
  //   }
  // };

  if (loading) {
    return (
      <div className="bg-white rounded-xl min-w-[500px] py-8 px-4">
        <PaperPlaneLoader />
        <p className="text-2xl text-center -mt-10">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl min-w-[500px] py-8 px-4">
      <div className="flex justify-between">
        <h1 className="font-bold mb-4 text-xl">
          Add {quiz?.questions.length ? "Next" : null} Question
        </h1>
        {quiz?.questions.length ? (
          <Link to={screens.createQuiz}>
            <GrFormClose size={30} />
          </Link>
        ) : null}
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
          {quiz.questions.length ? "Add Another Question" : "Add Question"}
        </Button>
        {quiz.questions.length ? (
          <>
            <p className="text-xl">
              You have added {quiz.questions.length} question
              {quiz.questions.length > 1 && "s"} so far. <br />
              Are you done?
            </p>
            <Link to={screens.createQuiz}>
              <Button type="submit" className="w-full">
                Close
              </Button>
            </Link>
          </>
        ) : null}
      </form>
    </div>
  );
};

export default AddQuestionPage;
