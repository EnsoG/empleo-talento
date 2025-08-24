import { useEffect } from "react";
import {
    Routes,
    Route,
    Navigate,
    useLocation
} from "react-router";

import { AppPaths, UserPosition, UserRole } from "../types";
import { GuestRoutes } from "./GuestRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes";
import {
    MyAccount,
    MyJobs,
    MyCompany,
    PublishJob,
    JobManagement,
    MyStaff,
    MyCompanies,
    CompanyDetail,
    MySoftwares,
    MyJobSchedules,
    MyCandidatePlans,
    AddCandidatePlan,
    CandidatePlanDetail,
    MyCompanyPlans,
    MyLanguages,
    MyCompanySectors,
    MyCertificationTypes,
    MyPerformanceAreas,
    MyRolePositions,
    MyGenericPositions,
    MyContractTypes,
    MyJobDays,
    AddCompanyPlan,
    CompanyPlanDetail,
    MyJobTypes,
    MyPendingJobs,
    MyPublicationCategories,
    MyPublications,
    AddPublication,
    PublicationDetail,
    MyShifts
} from "../pages/panel";
import {
    Home,
    JobBoard,
    JobDetail,
    CompanyOverview,
    ProfesionalInfo,
    PersonalInfo,
    Postulations,
    Services,
    Contact,
    AboutUs,
    TermsPolicies,
    Publications,
    PublicationDetail as PortalPublicationDetail
} from "../pages/portal";
import {
    Login,
    RegisterCandidate,
    RegisterCompany,
    ForgetPassword,
    ChangePassword,
    AdminLogin
} from "../pages/auth";
import { NotFound } from "../pages/NotFound";

export const AppRouter = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    return (
        <Routes>
            {/* Portal */}
            <Route path={AppPaths.home} element={<Home />} />
            <Route path={AppPaths.contact} element={<Contact />} />
            <Route path={AppPaths.aboutUs} element={<AboutUs />} />
            <Route path={AppPaths.termsPolicies} element={<TermsPolicies />} />
            <Route path={AppPaths.jobBoard} element={<JobBoard />} />
            <Route path={`${AppPaths.jobDetail}/:id`} element={<JobDetail />} />
            <Route path={`${AppPaths.companyOverview}/:id`} element={<CompanyOverview />} />
            <Route path={AppPaths.publications} element={<Publications />} />
            <Route path={`${AppPaths.portalPublicationDetail}/:id`} element={<PortalPublicationDetail />} />
            {/* Auth */}
            <Route element={<GuestRoutes />}>
                <Route path={AppPaths.login} element={<Login />} />
                <Route path={`${AppPaths.adminLogin}-${import.meta.env.VITE_ADMIN_LOGIN_SECRET}`} element={<AdminLogin />} />
                <Route path={AppPaths.registerCandidate} element={<RegisterCandidate />} />
                <Route path={AppPaths.registerCompany} element={<RegisterCompany />} />
                <Route path={AppPaths.forgetPassword} element={<ForgetPassword />} />
                <Route path={AppPaths.changePassword} element={<ChangePassword />} />
            </Route>
            {/* Portal (Candidate) */}
            <Route element={<ProtectedRoutes requiredRoles={[UserRole.candidate]} />}>
                <Route path={AppPaths.profesionalInfo} element={<ProfesionalInfo />} />
                <Route path={AppPaths.personalInfo} element={<PersonalInfo />} />
                <Route path={AppPaths.postulations} element={<Postulations />} />
            </Route>
            {/* Portal (Candidate And Company) */}
            <Route element={<ProtectedRoutes requiredRoles={[UserRole.candidate, UserRole.company]} />}>
                <Route path={AppPaths.services} element={<Services />} />
            </Route>
            {/* Panel */}
            <Route element={<ProtectedRoutes requiredRoles={[UserRole.admin, UserRole.company]} />}>
                <Route path={AppPaths.myAccount} element={<MyAccount />} />
                <Route path={AppPaths.myJobs} element={<MyJobs />} />
                <Route path={AppPaths.publishJob} element={<PublishJob />} />
                <Route path={`${AppPaths.jobManagement}/:id`} element={<JobManagement />} />
            </Route>
            {/* Panel (Admin)*/}
            <Route element={<ProtectedRoutes requiredRoles={[UserRole.admin]} />}>
                <Route path={AppPaths.myCompanies} element={<MyCompanies />} />
                <Route path={AppPaths.myPendingJobs} element={<MyPendingJobs />} />
                <Route path={`${AppPaths.companyDetail}/:id`} element={<CompanyDetail />} />
                <Route path={AppPaths.mySoftwares} element={<MySoftwares />} />
                <Route path={AppPaths.myLanguages} element={<MyLanguages />} />
                <Route path={AppPaths.myCompanySectors} element={<MyCompanySectors />} />
                <Route path={AppPaths.myCertificationTypes} element={<MyCertificationTypes />} />
                <Route path={AppPaths.myPerformanceAreas} element={<MyPerformanceAreas />} />
                <Route path={AppPaths.myJobSchedules} element={<MyJobSchedules />} />
                <Route path={AppPaths.myGenericPositions} element={<MyGenericPositions />} />
                <Route path={AppPaths.myRolePositions} element={<MyRolePositions />} />
                <Route path={AppPaths.myContractTypes} element={<MyContractTypes />} />
                <Route path={AppPaths.myJobTypes} element={<MyJobTypes />} />
                <Route path={AppPaths.myShifts} element={<MyShifts />} />
                <Route path={AppPaths.myJobDays} element={<MyJobDays />} />
                <Route path={AppPaths.myPublications} element={<MyPublications />} />
                <Route path={AppPaths.addPublication} element={<AddPublication />} />
                <Route path={`${AppPaths.publicationDetail}/:id`} element={<PublicationDetail />} />
                <Route path={AppPaths.myPublicationCategories} element={<MyPublicationCategories />} />
                <Route path={AppPaths.myCandidatePlans} element={<MyCandidatePlans />} />
                <Route path={AppPaths.addCandidatePlan} element={<AddCandidatePlan />} />
                <Route path={`${AppPaths.candidatePlanDetail}/:id`} element={<CandidatePlanDetail />} />
                <Route path={AppPaths.myCompanyPlans} element={<MyCompanyPlans />} />
                <Route path={AppPaths.addCompanyPlan} element={<AddCompanyPlan />} />
                <Route path={`${AppPaths.companyPlanDetail}/:id`} element={<CompanyPlanDetail />} />
            </Route>
            {/* Panel (Only Founder)*/}
            <Route element={<ProtectedRoutes
                requiredRoles={[UserRole.company]}
                requiredPositions={[UserPosition.founder]} />
            }>
                <Route path={AppPaths.myStaff} element={<MyStaff />} />
                <Route path={AppPaths.myCompany} element={<MyCompany />} />
            </Route>
            {/* Other */}
            <Route path="*" element={<Navigate to={AppPaths.notFound} />} />
            <Route path={AppPaths.notFound} element={<NotFound />} />
        </Routes>
    )
}