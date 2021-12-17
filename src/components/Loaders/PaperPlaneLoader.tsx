import { useLottie, Lottie } from "react-lottie-hook";
import animationData from "assets/paperplane.json";

const PaperPlaneLoader = () => {
  const [lottieRef] = useLottie({
    // renderer: "svg",
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
      progressiveLoad: false,
    },
    animationData,
  });

  return <Lottie lottieRef={lottieRef} width={300} height={300} />;
};

export default PaperPlaneLoader;
