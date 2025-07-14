import { createContext, ReactNode } from "react";

interface ModalContextType {
    openedModal: boolean;
    openModal: (content: ReactNode, title: string) => void;
    closeModal: () => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);