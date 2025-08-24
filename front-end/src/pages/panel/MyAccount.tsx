import { User } from "@phosphor-icons/react"

import { useAuth } from "../../hooks/useAuth"
import { UserRole } from "../../types";
import { PanelLayout } from "../../layouts/PanelLayout"
import { AdminAccount } from "../../components/panel/my_account/AdminAccount";
import { CompanyUserAccount } from "../../components/panel/my_account/CompanyUserAccount";

export const MyAccount = () => {
    const { user } = useAuth();

    return (
        <PanelLayout
            pageName="Mi Cuenta"
            PageIcon={User}>
            {(user?.user_role == UserRole.admin)
                ? <AdminAccount />
                : <CompanyUserAccount />
            }
        </PanelLayout>
    )
}