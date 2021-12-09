import clsx from "classnames";
import { motion } from "framer-motion";
import React, { FC } from "react";

import { Props } from "./props";

export const MediaIcon: FC<Props> = ({ icon, href, className }: Props) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      whileHover="hover"
      initial="initial"
      className={clsx("relative", className)}
    >
      <motion.div
        variants={{
          initial: {
            rotate: 0,
            scale: 1,
          },
          hover: {
            rotate: 10,
            scale: 1.2,
          },
        }}
        className="text-dark-900 dark:text-light-900"
      >
        {icon}
      </motion.div>
    </motion.a>
  );
};
