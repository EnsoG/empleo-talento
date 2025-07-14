import { PropsWithChildren, ReactNode, useState } from "react";
import { Modal } from "@mantine/core";

import { ModalContext } from "../contexts/ModalContext";

interface ModalProviderProps extends PropsWithChildren { }

export const ModalProvider = ({ children }: ModalProviderProps) => {
    const [openedModal, setOpenedModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

    const openModal = (content: ReactNode, title: string) => {
        setOpenedModal(true);
        setModalContent(content);
        setModalTitle(title);
    }

    const closeModal = () => {
        setOpenedModal(false);
        setModalContent(null);
        setModalTitle(undefined)
    }

    return (
        <ModalContext.Provider value={{ openedModal, openModal, closeModal }}>
            {children}
            <Modal
                title={modalTitle}
                opened={openedModal}
                onClose={closeModal}
                size="lg"
                centered
                closeOnClickOutside={false}>
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    )
}