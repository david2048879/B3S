import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import SideNav from "../../components/leaveComponents/sideNavigation/sideNav";;
import AnnualLeavePlanning from "../../components/leaveComponents/MainComponent/annualLeavePlanning";;
import Layout from "../../components/Layout";
import LeaveView from "../../components/leaveComponents/MainComponent/LeaveView";;
import AnnualLeaveRequest from "../../components/leaveComponents/MainComponent/AnnualLeaveRequest";
import RequestLeave from "../../components/leaveComponents/MainComponent/requestLeave";;
import PendingLeaveRequestInfo from "../../components/leaveComponents/MainComponent/actualLeaveRequestInfo";;
import SupervisorPendingLeaveRequest from "../../components/leaveComponents/MainComponent/supervisorReviewRequest";;
import LineManagerPendingRequests from "../../components/leaveComponents/MainComponent/LineManagerReviewRequests";;
import HRManagerPendingRequest from "../../components/leaveComponents/MainComponent/HrManagerReviewRequest";;
import ManageOffDays from "../../components/leaveComponents/MainComponent/ManageOffdays";
import Dashboard from "../../components/leaveComponents/MainComponent/dashboard";
import StatisticsDashboard from "../../components/leaveComponents/MainComponent/statisticsDashboard";
import AdminSupervisorOperation from "../../components/leaveComponents/MainComponent/adminSupervisorOperations";
import EXecStatisticsDashboard from "../../components/leaveComponents/MainComponent/executivesStatisticsDashboard";
import withLeave from "./withLeave";


const Index = ({ token, userDetails }) => {
    const [page, setPage] = useState("Dashboard");
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen)
    }
    useEffect(() => {
        console.log(page);
    }, [page]);


    return (
        <>
            <Layout>
                <div className="row">
                    <div className="col-2">
                        <SideNav setPage={setPage} addLeave={toggleModal} staffRole={userDetails} />
                    </div>
                    <div className="col-9">
                        <div className="">
                            {page === "Dashboard" && (
                                <Dashboard token={token} setPage={setPage} />
                            )}
                            {page === "Add leave plan" && (
                                <AnnualLeavePlanning token={token} />
                            )}
                            {page === "View leave plan" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <LeaveView token={token} />
                                </div>
                            )}
                            {page === "Review staff leave plan" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <AnnualLeaveRequest token={token} role={userDetails.empRole} />
                                </div>
                            )}
                            {page === "Leave request info" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <PendingLeaveRequestInfo token={token} />
                                </div>
                            )}
                            {page === "Supervisor dashboard" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <SupervisorPendingLeaveRequest token={token} role={userDetails.empRole} />
                                </div>
                            )}
                            {page === "Manager dashboard" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <LineManagerPendingRequests token={token} role={userDetails.empRole} />
                                </div>
                            )}
                            {page === "Human resource" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <HRManagerPendingRequest token={token} />
                                </div>
                            )}
                            {page === "Off days Management" && (
                                <div className="" style={{ marginLeft: "50px" }}>
                                    <ManageOffDays token={token} />
                                </div>
                            )}
                            {page === "Statistics" && (
                                (userDetails.empRole === "SYSTEMADMIN" || userDetails.empRole === "EXCO" || userDetails.empRole === "CEO") ? (
                                    <EXecStatisticsDashboard token={token} setPage={setPage} userDetails={userDetails} />
                                ) : (
                                    <StatisticsDashboard token={token} setPage={setPage} userDetails={userDetails} />
                                )
                            )}
                            {page === "Manage supervisors" && (
                                <AdminSupervisorOperation token={token} setPage={setPage} />
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    {modalIsOpen && <RequestLeave modalIsOpen={modalIsOpen}
                        toggleModal={toggleModal} token={token}
                    />}
                </div>
            </Layout>
        </>
    );
};

export default withLeave(Index);
