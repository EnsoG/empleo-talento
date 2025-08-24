import { PropsWithChildren } from "react";

import { Navbar } from "../components/portal/Navbar";
import { Footer } from "../components/portal/Footer";

interface PortalLayoutProps extends PropsWithChildren { }

export const PortalLayout = ({ children }: PortalLayoutProps) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    )
}