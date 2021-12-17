import { useLottie, Lottie } from "react-lottie-hook";
import animationData from "assets/quiz-bump.json";

const QuizLoader = ({ onComplete = () => null }) => {
  const [lottieRef] = useLottie({
    // renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: false,
    },
    loop: false,
    animationData,
    eventListeners: {
      complete: onComplete,
    },
  });
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Lottie lottieRef={lottieRef} width="100vw" height="100vh" />;
};

export default QuizLoader;
