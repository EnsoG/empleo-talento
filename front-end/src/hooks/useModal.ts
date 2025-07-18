import { useContext } from "react";

import { ModalContext } from "../contexts/ModalContext";

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be inside of ModalProvider");
    }
    return context;
}