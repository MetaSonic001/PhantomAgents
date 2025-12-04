"use client"

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

type Props = HTMLMotionProps<"div"> & {
  children: React.ReactNode
}

export function Animated({ children, className, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export default Animated
