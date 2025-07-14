import { PropsWithChildren } from "react";
import { motion } from "motion/react";

interface FadeRightProps extends PropsWithChildren { }

export const FadeRight = ({ children }: FadeRightProps) => {
    return (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            {children}
        </motion.div>
    )
}
