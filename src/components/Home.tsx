import { screens } from "config";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(screens.selectQuestion);
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="rounded-lg bg-white shadow-dark-700 max-w-md w-full px-6 py-10">
          <h1 className="text-4xl text-center">QUIZZA</h1>
          <button
            className="px-4 py-2 bg-gray-900 rounded text-white my-4 mx-auto text-center block"
            onClick={handleNavigate}
          >
            Click to start
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
