import { CitationOverlay } from "components/CitationOverlay";
import { motion } from "framer-motion";
import { FC, useState, useEffect } from "react";

import { Props } from "./props";

export const Layout: FC<Props> = ({ children }: Props) => {
  return (
    <div className="min-h-screen font-sans bg-lightTheme dark:bg-darkTheme transition-colors">
      {children}
    </div>
  );
};

export const CitationLayout = ({ children }) => {
  const [citation, setCitation] = useState(true);
  const [main, setMain] = useState(false);

  useEffect(() => {
    const ids = [
      setTimeout(() => setCitation(false), 2800),
      setTimeout(() => setMain(true), 3700),
    ];

    return () => ids.forEach((id) => clearTimeout(id));
  }, [setCitation]);

  return (
    <>
      <CitationOverlay citation={citation} />
      <motion.div
        variants={{
          initial: {
            opacity: 0,
            display: "none",
          },
          visible: {
            opacity: 1,
            display: "grid",
          },
        }}
        initial="initial"
        animate={main ? "visible" : "initial"}
        transition={{
          duration: 0.6,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
export const FadeLayout = ({ children }) => {
  return (
    <>
      <motion.div
        variants={{
          initial: {
            opacity: 0,
          },
          visible: {
            opacity: 1,
          },
        }}
        initial="initial"
        animate={"visible"}
        transition={{
          duration: 1,
        }}
      >
        {children}
      </motion.div>
    </>
  );
};
