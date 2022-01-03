import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

// export const socket = io(SOCKET_URL);
export const AppContext = createContext(undefined);
export const useApp = () => useContext(AppContext);

const AppProvider = ({ children }) => {
  const [quiz, _setQuiz] = useState({
    // title: "Biology",
    // description: "Geta afbjafa",
    questions: [
      // {
      //   question: "Who is a man?",
      //   answer: "human",
      //   options: ["human", "Buhari", "Donald", "Titi"],
      // },
      // {
      //   question: "Who is the president of Nigeria",
      //   answer: "Omalicha",
      //   options: ["Omalicha", "Bwari", "Abuja", "Sonwolu"],
      // },
      // {
      //   question: "Who is her daddy?",
      //   answer: "Zaddy",
      //   options: ["Zaddy", "Atata", "Gbagaga", "Arteta"],
      // },
      // {
      //   question: "Shade is a man of the boy?",
      //   answer: "H.E.R",
      //   options: ["H.E.R", "H.I.M", "T.H.E.M", "W.H.O"],
      // },
      // {
      //   question: "Unilorin stands for what?",
      //   answer: "Stress",
      //   options: ["Stress", "suffering", "Agege", "Alomo bitters"],
      // },
    ],
  });

  const setQuiz = useCallback((val) => _setQuiz((q) => ({ ...q, ...val })), []);
  const setQuestion = useCallback(
    (val) =>
      _setQuiz((q) => ({ ...q, questions: [...(q.questions ?? []), val] })),
    []
  );

  const values = useMemo(
    () => ({ quiz, setQuiz, setQuestion }),
    [quiz, setQuestion, setQuiz]
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppProvider;
