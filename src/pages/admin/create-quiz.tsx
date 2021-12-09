import Button from "components/Button";
import { screens } from "config";
import { useApp } from "context/app";
import { useRef } from "react";
import { useNavigate } from "react-router";

const CreateQuizPage = () => {
  const { setQuiz } = useApp();
  const navigate = useNavigate();
  const descRef = useRef(null);
  const titleRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleRef.current?.value || !descRef.current?.value) {
      alert("Fill in all fields");
      return;
    }
    setQuiz({
      title: titleRef.current?.value,
      description: descRef.current?.value,
    });
    navigate(screens.addQuestion);
  };

  return (
    <div className="bg-white rounded-xl min-w-[500px] py-8 px-4">
      <h1 className="text-center font-bold">Create Quiz</h1>
      <form className="grid gap-y-4" onSubmit={handleSubmit}>
        <div className="grid">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            className="border p-2 mt-2 rounded"
            ref={titleRef}
          />
        </div>
        <div className="grid mt-4">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            className="border p-2 mt-2 rounded"
            ref={descRef}
          />
        </div>
        <Button type="submit" className="">
          Create Quiz
        </Button>
      </form>
    </div>
  );
};

export default CreateQuizPage;
