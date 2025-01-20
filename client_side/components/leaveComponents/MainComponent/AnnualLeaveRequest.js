import { useState, useEffect } from "react";
import axios from "axios";
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import withLeave from "../../../pages/leave/withLeave";
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import 'react-toastify/dist/ReactToastify.css';
import ApprovedLeavePlan from "../leaveFunctionalFiles/ApprovedLeavePlan";
import LeaveDateSupervisorFollowUp from "../leaveFunctionalFiles/LeaveDateSupervisorsFollowUp";
import StaffAnnualLeaveDetailedDescription from "../leaveFunctionalFiles/staffAnnualLeaveDetailedDescription";
import {
    WarningTwoTone,
} from "@ant-design/icons";

const AnnualLeaveRequestPlan = ({ token, role }) => {
    const [staffLeaves, setStaffLeaves] = useState([])
    const [currentStaff, setCurrentStaff] = useState({});
    const [showFollowUpInfo, setShowFollowUpInfo] = useState(false)
    const [dataPresent, setDataPresent] = useState(false)
    const [requestPresent, setRequestPresent] = useState(false)
    const [leavePlanData, setLeavePlanData] = useState([])
    const [showModifyModal, setShowModifyModal] = useState(false)
    const [activeTab, setActiveTab] = useState("pending");
    const toggleShowModifyModal = () => {
        setShowModifyModal(!showModifyModal)
    }
    const [moreInfo, setMoreInfo] = useState(false)
    const [approvedMoreInfo, setApprovedMoreInfo] = useState(false)
    const [leaveInfo, setLeaveInfo] = useState()
    const toggleMoreInfo = () => {
        setMoreInfo(!moreInfo)
    }
    const toggleApprovedMoreInfo = () => {
        setApprovedMoreInfo(!approvedMoreInfo)
    }
    const toggleShowLeaveFollowUp = () => {
        setShowFollowUpInfo(!showFollowUpInfo)
    }
    const [showInitiateDeleteModal, setShowInititateDeleteModal] = useState(false)
    const toggleShowModal = () => {
        setShowModal(!showModal)
    }
    const toggleShowDeleteModal = () => {
        setShowInititateDeleteModal(!showInitiateDeleteModal)
    }
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            let requestData;
            if (role === "CEO") {
                requestData = {
                    empCode: 1,
                };
            }
            else {
                const staffResponse = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
                setCurrentStaff(staffResponse.data.staffProfile);
                requestData = {
                    empCode: staffResponse.data.staffProfile.empCode,
                };
            }
            const leaveResponse = await axios.post(`${API}/leave/supervisor/leaverequest`, requestData, config);
            if (leaveResponse.data.receivedLeaveRequests.length === 0) {
                setRequestPresent(false)
            }
            else {
                setRequestPresent(true)
            }
            setLeavePlanData(leaveResponse.data.receivedLeaveRequests)
            const pendingData = []
            let count = 0
            for (let i = 0; i < leaveResponse.data.receivedLeaveRequests.length; i++) {
                const receivedLeaveRequests = leaveResponse.data.receivedLeaveRequests[i]
                if (receivedLeaveRequests.supervisorValidated === false) {
                    count++;
                    pendingData.push(receivedLeaveRequests)
                }
            }
            setStaffLeaves(pendingData);
            if (count > 0) {
                setDataPresent(true)
            }
            else {
                setDataPresent(false)
            }
        } catch (error) {
            toast.warning('Failed to get leave requests', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 10000,
            });
            console.error(error);
        }
    };
    const showLeaveInfo = (leavedetails) => {
        setLeaveInfo(leavedetails)
        setMoreInfo(true)
    }
    useEffect(() => {
        fetchData();
    }, [showModifyModal, showInitiateDeleteModal, moreInfo]);
    return (
        <>
            <div className="mx-5 mt-4 font-monospace" >
                <p><strong> Staff leave request </strong></p>
                {!showFollowUpInfo ? <div className="card rounded-3 shadow-sm" style={{ width: "119%" }}>
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td>User Leave plan request information</td>
                            </tr>
                        </thead>
                    </table>
                    {!moreInfo && <div className="">
                        <div className="mb-1">
                            <ul className="nav nav-pills" style={{ width: '100%', cursor: "pointer" }}>
                                <li
                                    className={`nav-link text-dark ${activeTab === 'pending' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('pending')}
                                    style={{
                                        width: '50%',
                                        textAlign: 'center',
                                        borderBottom: activeTab === 'pending' ? '2px solid blue' : 'none',
                                        borderRadius: 0,
                                        backgroundColor: activeTab === 'pending' ? '#ffffff' : '',
                                    }}
                                >
                                    Pending Leave Requests
                                </li>
                                <li
                                    className={`nav-link text-dark ${activeTab === 'Approved' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('Approved')}
                                    style={{
                                        width: '50%',
                                        textAlign: 'center',
                                        borderBottom: activeTab === 'Approved' ? '2px solid blue' : 'none',
                                        borderRadius: 0,
                                        backgroundColor: activeTab === 'Approved' ? '#ffffff' : '',
                                    }}
                                >
                                    Approved Leave Requests
                                </li>
                            </ul>
                        </div>
                        {activeTab === "pending" ?
                            <div style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
                                {dataPresent ? <table className="table table-borderless table-hover" >
                                    <thead>
                                        <tr className="table-success">
                                            <th>NO.</th>
                                            <th>Staff names</th>
                                            <th>Staff department</th>
                                            <th>STATUS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {staffLeaves.map((info, index) => {
                                            return (
                                                <tr key={info._id} style={{ cursor: "pointer" }} onClick={() => showLeaveInfo(info)}>
                                                    <td>{index + 1}</td>
                                                    <td>{info.staff.empNames}</td>
                                                    <td>{info.staff.currentAppointment.department}</td>
                                                    <td>
                                                        <span className="badge bg-warning text-dark" style={{ fontSize: "1em" }}>Pending</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </table> : (<div>
                                    <div className="d-flex justify-content-center mt-5">
                                        <div className="d-flex flex-column">
                                            <WarningTwoTone style={{ fontSize: "7rem" }} />
                                            <p style={{ fontSize: '2rem' }} className="mt-3">No leave requests</p>
                                        </div>
                                    </div>
                                </div>)}
                            </div> : <ApprovedLeavePlan data={leavePlanData} moreInfo={approvedMoreInfo} setMoreInfo={setApprovedMoreInfo} />}
                    </div>}
                    {moreInfo && <StaffAnnualLeaveDetailedDescription leaveInfo={leaveInfo} toggleMoreInfo={toggleMoreInfo}
                        showModifyModal={showModifyModal} toggleShowModifyModal={toggleShowModifyModal} token={token}
                        showInitiateDeleteModal={showInitiateDeleteModal} toggleShowDeleteModal={toggleShowDeleteModal} />}
                    {moreInfo ? <div className="card-footer">
                        <div className="row">
                            <div className="col">
                                <button className="btn btn-sm btn-outline-primary" onClick={toggleMoreInfo}>Go back</button>
                            </div>
                            <div className="col">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-sm btn-outline-primary" id="action">Modify</button>
                                </div>
                                <div className="d-flex align-items-center justify-content-center mt-3">
                                    <UncontrolledPopover
                                        placement="top"
                                        target="action"
                                        trigger="legacy"
                                    >
                                        <PopoverHeader style={{ backgroundColor: "#cfe2ff" }}>
                                            <p className='d-flex justify-content-center'>Take action</p>
                                        </PopoverHeader>
                                        <PopoverBody>
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-danger" onClick={toggleShowDeleteModal}>
                                                    Delete planned dates
                                                </button>
                                                <button type="button" className="btn btn-primary" onClick={toggleShowModifyModal}>
                                                    Update planned dates
                                                </button>
                                            </div>

                                        </PopoverBody>
                                    </UncontrolledPopover>
                                </div>
                            </div>
                        </div>
                    </div> : ""}
                    {approvedMoreInfo ? <div className="card-footer">
                        <button className="btn btn-sm btn-outline-primary" onClick={toggleApprovedMoreInfo}>Go back</button>
                    </div> : ""}
                    {requestPresent && !moreInfo && <div className="card-footer">
                        <button className="btn btn-sm btn-outline-primary" disabled={!requestPresent} onClick={toggleShowLeaveFollowUp}>Inspect all leave</button>
                    </div>}
                </div> : <LeaveDateSupervisorFollowUp data={leavePlanData} toggleCalendarView={toggleShowLeaveFollowUp} />}
                <div>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}


export default withLeave(AnnualLeaveRequestPlan)