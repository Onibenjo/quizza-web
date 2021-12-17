import { motion } from "framer-motion";
import { FC } from "react";

import { Container } from "../Container";
import { NinjaIcon } from "./libs/NinjaIcon";
import { Props } from "./props";
import classNames from "classnames";

const textVariants = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const CitationOverlay: FC<Props> = ({ citation }: Props) => {
  return (
    <motion.div
      className={classNames(
        "absolute flex items-center justify-center w-full bg-transparent"
        // styles.main
      )}
      variants={{
        initial: {
          opacity: 1,
          height: "100%",
        },
        invisible: {
          opacity: 0,
          height: 0,
        },
      }}
      transition={{
        duration: 0.6,
      }}
      initial="initial"
      animate={citation ? "initial" : "invisible"}
    >
      <Container>
        <motion.div
          variants={textVariants}
          initial="initial"
          animate="visible"
          transition={{
            delay: 1.5,
            duration: 0.6,
          }}
        >
          <NinjaIcon className="w-10 mb-2 fill-current md:ml-auto dark:text-light-900 text-dark-900" />
        </motion.div>
        <motion.p
          className="mt-4 mb-2 text-xl font-medium leading-none md:text-2xl dark:text-light-900 text-dark-900 md:my-0"
          variants={textVariants}
          initial="initial"
          animate="visible"
          transition={{
            delay: 0.5,
            duration: 0.6,
          }}
        >
          Welcome to QUIZZA
        </motion.p>
        <motion.p
          className="text-base md:text-right dark:text-light-700 text-dark-700"
          initial="initial"
          animate="visible"
          variants={textVariants}
          transition={{
            delay: 1.0,
            duration: 0.6,
          }}
        >
          onibenjo et. cykic
        </motion.p>
      </Container>
    </motion.div>
  );
};
