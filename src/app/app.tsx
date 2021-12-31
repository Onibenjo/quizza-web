import styles from "./app.module.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "components/Home";
import AppProvider from "context/app";
import { screens } from "config";
import { Layout } from "components";
import AdminPage from "pages/admin";
import CreateQuizPage from "pages/admin/create-quiz";
import AddQuestionPage from "pages/admin/add-question";
import SelectQuestionsPage from "pages/select-questions";
import QuizPage from "pages/quiz-page";

const App = (): JSX.Element => {
  return (
    <AppProvider>
      {/* //SocketProvider */}
      <main>
        <Layout>
          <div className={styles.main}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path={screens.quizRoot}>
                <Route path={screens.quiz()} element={<QuizPage />} />
              </Route>
              <Route
                path={screens.selectQuestion}
                element={<SelectQuestionsPage />}
              />
              <Route path={screens.admin} element={<AdminPage />}>
                <Route path={screens.createQuiz} element={<CreateQuizPage />} />
                <Route
                  path={screens.addQuestion}
                  element={<AddQuestionPage />}
                />
              </Route>
              <Route
                path="*"
                element={
                  <main className="h-screen flex justify-center items-center text-4xl flex-col">
                    <h1 className="">Error 404</h1>
                    <p className="text-3xl">There's nothing here!</p>
                  </main>
                }
              />
            </Routes>
          </div>
        </Layout>
      </main>
    </AppProvider>
  );
};

export default App;
