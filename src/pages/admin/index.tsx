import { screens } from "config";
import { Link, Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="w-full flex flex-col h-full">
      <nav className="py-4 bg-white">
        <ul className="w-4/5 mx-auto flex justify-between items-center">
          <li className="">
            <Link to={screens.createQuiz}>Create Quiz</Link>
          </li>
        </ul>
      </nav>
      <section className="h-full flex justify-center items-center">
        <Outlet />
      </section>
    </div>
  );
};
export default AdminPage;
