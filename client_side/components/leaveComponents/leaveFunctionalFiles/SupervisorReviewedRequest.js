import { useState, useEffect } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { EllipsisOutlined, LeftSquareOutlined, InfoCircleOutlined } from "@ant-design/icons";
import ReviewedDetailModal from "../Modals/actualLeaveReviewedDetailInformationModal";
import RecallLeaveModal from "../Modals/recallLeaveModal";
import { checkIfLeaveIsStillActive, checkIfLeaveIsInFuture } from "../../../helpers/leaveHelpers";
import {
    WarningTwoTone,
    SearchOutlined,
} from "@ant-design/icons";

const SupervisorReviewedRequest = ({ leaveData, token, openRecallModal, setOpenRecallModal }) => {
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [dataAvailable, setDataAvailable] = useState(false)
    const [showLeaveDetails, setShowLeaveDetails] = useState(false)
    const [info, setInfo] = useState({
        actualLeavedId: "",
        annualLeaveId: "",
        startDate: ""
    })
    const [leaveDetails, setLeaveDetails] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        department: "",
        returnDate: "",
        daysTaken: "",
        managerRequestDate: "",
        staff: "",
        supervisorrequestdate: "",
        supervisor: "",
        hrrequestdate: "",
    })
    const toggleShowLeaveDetails = () => {
        setShowLeaveDetails(!showLeaveDetails)
    }
    const toggleRecallModal = () => {
        setOpenRecallModal(!openRecallModal)
    }
    const initiateRecallModal = (leave) => {
        setInfo({
            actualLeavedId: leave.leaveInfo.leaveid,
            annualLeaveId: leave.actualLeave._id,
            startDate: leave.actualLeave.startDate
        })
        setOpenRecallModal(true)
    }
    const initiateShowLeaveDetails = (leave) => {
        setLeaveDetails({
            leaveType: leave.actualLeave.leaveType,
            startDate: leave.actualLeave.startDate,
            endDate: leave.actualLeave.endDate,
            returnDate: leave.actualLeave.returnDate,
            daysTaken: leave.actualLeave.daysTaken,
            staff: leave.leaveInfo.staff.empNames,
            department: leave.leaveInfo.staff.department,
            supervisorrequestdate: leave.actualLeave.supervisorRequestDate,
            supervisor: leave.actualLeave.supervisorApproval.supervisor.names
        });
        setShowLeaveDetails(true);
    };
    const prepData = async () => {
        const dataStatus = [];
        if (leaveData.dataPresent) {
            let count = 0;
            for (let i = 0; i < leaveData.leave.length; i++) {
                const currentLeaveInformation = leaveData.leave[i]
                if (currentLeaveInformation.actualLeave.supervisorApproval.requestStatus === "REJECTED" || currentLeaveInformation.actualLeave.supervisorApproval.requestStatus === "APPROVED") {
                    count++;
                    dataStatus.push(leaveData.leave[i])
                }
            }
            console.log("data status",dataStatus);
            
            setData(dataStatus)
            if (count > 0) {
                setDataAvailable(true)
            }
            else {
                setDataAvailable(false)
            }
        }
    };
    useEffect(() => {
        prepData();
    }, [leaveData])

    const filteredData = data.filter(searchedLeave => searchedLeave.leaveInfo.staff.empNames.toLowerCase().startsWith(search.toLowerCase()));
    return (
        <>
            <div className="font-monospace mt-1" style={{ width: "100%" }}>
                <div className="mx-1 mt-2">
                    {dataAvailable && <div className="d-flex justify-content-end">
                        <div className="mx-2 mt-1 mb-2">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text"><SearchOutlined /></span>
                                </div>
                                <input type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="form-control" placeholder="Search..." />
                            </div>
                        </div>
                    </div>}
                    <div style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
                        {dataAvailable ? <table className="table mt-3" >
                            <thead>
                                <tr className="table-primary">
                                    <th>NO.</th>
                                    <th>Names</th>
                                    <th>Department</th>
                                    <th>Leave type</th>
                                    <th>Info</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((leaveStatus, index) => {
                                    try {
                                    return (
                                        <tr key={index} style={{ cursor: "pointer" }}>
                                            <td>{index + 1}</td>
                                            <td>{leaveStatus.leaveInfo.staff.empNames}</td>
                                            <td>{leaveStatus.leaveInfo.staff.department}</td>
                                            <td>{leaveStatus.actualLeave.leaveType}</td>
                                            <td>
                                                {leaveStatus.actualLeave.supervisorApproval.requestStatus === "APPROVED" ? (
                                                    checkIfLeaveIsInFuture(leaveStatus.actualLeave.startDate) ? (
                                                        <span className="badge rounded-pill bg-secondary">Upcoming</span>
                                                    ) : checkIfLeaveIsStillActive(leaveStatus.actualLeave.startDate, leaveStatus.actualLeave.returnDate) ? (
                                                        <span className="badge rounded-pill bg-primary">Active</span>
                                                    ) : (
                                                        <span className="badge rounded-pill bg-warning">Completed</span>
                                                    )
                                                ) : (
                                                    <span className="badge rounded-pill bg-danger">Rejected</span>
                                                )}
                                            </td>
                                            <td>
                                                {leaveStatus.actualLeave.supervisorApproval.requestStatus === "APPROVED" ? (<span className="badge rounded-pill bg-success">Approved</span>)
                                                    : (<span className="badge rounded-pill bg-danger">Rejected</span>)}
                                            </td>
                                            <td>
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                        role="button"
                                                        size="sm"
                                                        color=""
                                                        onClick={(e) => e.preventDefault()}
                                                    >
                                                        <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
                                                    </DropdownToggle>
                                                    <DropdownMenu className="dropdown-menu-arrow" end>
                                                        <DropdownItem
                                                           disabled={
                                                            !(
                                                              (checkIfLeaveIsStillActive(leaveStatus.actualLeave.startDate, leaveStatus.actualLeave.returnDate) ||
                                                               checkIfLeaveIsInFuture(leaveStatus.actualLeave.startDate)) &&
                                                              leaveStatus.actualLeave.leaveType === "Annual Leave"
                                                            )
                                                          }
                                                            onClick={() => initiateRecallModal(leaveStatus)}
                                                        >
                                                            <div className='d-flex flex-row'>
                                                                <LeftSquareOutlined disabled={!(checkIfLeaveIsStillActive(leaveStatus.actualLeave.startDate, leaveStatus.actualLeave.returnDate) && leaveStatus.actualLeave.leaveType === "Annual Leave")} />
                                                                <p className='mx-3 my-0 py-0 text-muted'><strong>Recall leave</strong></p>
                                                            </div>
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() => initiateShowLeaveDetails(leaveStatus)}
                                                        >
                                                            <div className='d-flex flex-row'>
                                                                <InfoCircleOutlined />
                                                                <p className='mx-3 my-0 py-0 text-muted'><strong>Detailed information</strong></p>
                                                            </div>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </td>
                                        </tr>
                                    )
                                }
                                    catch (error) {
                                        return (
                                            <tr key={index} style={{ cursor: "pointer" }} onClick={() => showLeaveInfo(info)}>
                                                <td>{index + 1}</td>
                                                <td>{info.staff?.empNames || "Error loading name"}</td>
                                                <td>{info.staff?.currentAppointment?.department || "Error loading department"}</td>
                                                <td>{info.staff?.currentAppointment?.department || "Error loading leave type"}</td>
                                                <td>
                                                    <span className="badge bg-warning text-white">Missing data</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-warning text-white">Missing data</span>
                                                </td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table> : (<div>
                            <div className="d-flex justify-content-center mt-5">
                                <div className="d-flex flex-column">
                                    <WarningTwoTone style={{ fontSize: "7rem" }} />
                                    <p style={{ fontSize: '2rem' }} className="mt-3">No leave requests</p>
                                </div>
                            </div>
                        </div>)
                        }
                    </div>
                </div>
            </div>
            <div>
                {showLeaveDetails && <ReviewedDetailModal
                    modalIsOpen={showLeaveDetails}
                    toggleModal={toggleShowLeaveDetails}
                    data={leaveDetails}
                />}
                {openRecallModal && <RecallLeaveModal
                    modalIsOpen={openRecallModal}
                    token={token}
                    toggleModal={toggleRecallModal}
                    info={info}
                />}
            </div>
        </>
    )
}

export default SupervisorReviewedRequest;
