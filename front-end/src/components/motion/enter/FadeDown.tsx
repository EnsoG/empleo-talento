import { PropsWithChildren } from "react";
import { motion } from "motion/react";

interface FadeDownProps extends PropsWithChildren { }

export const FadeDown = ({ children }: FadeDownProps) => {
    return (
        <motion.div
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            {children}
        </motion.div>
    )
}