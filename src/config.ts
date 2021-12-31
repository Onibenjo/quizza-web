export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;
// export const SOCKET_URL = "http://192.168.186.52";
// export const SOCKET_URL = "http://13.245.101.82";
// export const SOCKET_URL = "http://localhost:3001";
export const BASE_API = import.meta.env.VITE_BASE_API;

export const screens = {
  home: "/",
  admin: "/admin",
  quizRoot: "/quiz",
  quiz: (id = ":quizId") => "/quiz/" + id,
  selectQuestion: "/select-question",
  createQuiz: "/admin/create-quiz",
  addQuestion: "/admin/add-question",
};

export const API = {
  createQuiz: "/quiz",
  createQuestion: (quizId: string) => `/quiz/${quizId}/question`,
  getAllQuizzes: "/quiz",
  getAllQuizMasters: "/quizmasters",
  getAllQuestions: (id: string) => `/quiz/${id}/question`,
};
