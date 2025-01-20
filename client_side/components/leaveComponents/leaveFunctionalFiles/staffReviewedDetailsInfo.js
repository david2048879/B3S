import { useState, useEffect } from "react";
import StaffReviewedDetailModal from "../Modals/staffReviewedRequestModal";
import {
    WarningTwoTone,
    SearchOutlined,
} from "@ant-design/icons";

const StaffReviewedRequest = ({ leaveData,leaveId,token,showLeaveDetails, setShowLeaveDetails }) => {
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [dataAvailable, setDataAvailable] = useState(false)
    const [leaveDetails, setLeaveDetails] = useState({
        leaveid:"",
        leaveType: "",
        index:"",
        startDate: "",
        endDate: "",
        fileLocation:"",
        department: "",
        returnDate: "",
        daysTaken: "",
        managerRequestDate: "",
        staff: "",
        supervisorrequestdate: "",
        supervisor: ""
    })
    const toggleShowLeaveDetails = () => {
        setShowLeaveDetails(!showLeaveDetails)
    }
    const initiateShowLeaveDetails = (leave) => {
        const supervisorStatus = leave.supervisorApproval?.requestStatus;
        const lineManagerStatus = leave.lineManagerApproval?.requestStatus;
        const hrManagerStatus = leave.hrManagerApproval?.requestStatus;

        let rejectionDetails = null;

        if (supervisorStatus === "REJECTED") {
            rejectionDetails = {
                step: "supervisor",
                name: leave.supervisorApproval.supervisor.names,
                comment: leave.supervisorApproval.comment,
            }
        } else if (lineManagerStatus === "REJECTED") {
            rejectionDetails = {
                step: "line manager",
                name: leave.lineManagerApproval.lineManager.names,
                comment: leave.lineManagerApproval.comment
            }
        } else if (hrManagerStatus === "REJECTED") {
            rejectionDetails = {
                step: "HR manager",
                name: leave.hrManagerApproval.hrManager.names,
                comment: leave.hrManagerApproval.comment
            }
        }
        // console.log("rejection details", rejectionDetails)
        setLeaveDetails({
            leaveid:leaveId,
            index:leave._id,
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            returnDate: leave.returnDate,
            daysTaken: leave.daysTaken,
            fileLocation: leave.content?.url || "", 
            actingPerson: leave.actingPerson.names,
            supervisor: leave.supervisorApproval.supervisor.names,
            rejectionDetails: rejectionDetails,
            status: rejectionDetails === null ? "APPROVED" : "REJECTED",

        });
        setShowLeaveDetails(true);
    };
    const prepData = async () => {
        const dataStatus = [];
        let count = 0
        if (leaveData.dataPresent) {
            for (let i = 0; i < leaveData.leave.actualLeaves.length; i++) {
                const leave = leaveData.leave.actualLeaves[i];
                const supervisorStatus = leave.supervisorApproval?.requestStatus;
                const lineManagerStatus = leave.lineManagerApproval?.requestStatus;
                const hrManagerStatus = leave.hrManagerApproval?.requestStatus;
                if (
                    (   supervisorStatus === "APPROVED")
                ) {
                    count++;
                    dataStatus.push(leaveData.leave.actualLeaves[i])
                }
                else if (supervisorStatus === "REJECTED") {
                    count++;
                    dataStatus.push(leaveData.leave.actualLeaves[i])
                }
            }
            setData(dataStatus);
            if (count > 0 && leaveData.dataPresent) {
                setDataAvailable(true)
            }
            else {
                setDataAvailable(false)
            }
        }
    };
    const actualLeaveStatus = (leave) => {
        const supervisorStatus = leave.supervisorApproval?.requestStatus;
        const lineManagerStatus = leave.lineManagerApproval?.requestStatus;
        const hrManagerStatus = leave.hrManagerApproval?.requestStatus;
        if (
            (   supervisorStatus === "APPROVED" )
        ) {
            return "APPROVED"
        }
        else {
            return "REJECTED"
        }

    }
    useEffect(() => {
        prepData();
    }, [showLeaveDetails])

    const filteredData = data.filter(searchedLeave => searchedLeave.leaveType.toLowerCase().startsWith(search.toLowerCase()));
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
                        {dataAvailable ? <table className="table mt-3 table-hover" >
                            <thead>
                                <tr className="table-primary">
                                    <th>NO.</th>
                                    <th>Leave type</th>
                                    <th>Acting person</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((leaveStatus, index) => {
                                    return (
                                        <tr key={index} onClick={() => initiateShowLeaveDetails(leaveStatus)} style={{ cursor: "pointer" }}>
                                            <td>{index + 1}</td>
                                            <td>{leaveStatus.leaveType}</td>
                                            <td>{leaveStatus.actingPerson.names}</td>
                                            <td>
                                                {actualLeaveStatus(leaveStatus) === "APPROVED" ? (<span className="badge rounded-pill bg-success">Approved</span>)
                                                    : (<span className="badge rounded-pill bg-danger">Rejected</span>)}
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
                        </div>)
                        }
                    </div>
                </div>
            </div>
            <div>
                {showLeaveDetails && <StaffReviewedDetailModal
                    modalIsOpen={showLeaveDetails}
                    toggleModal={toggleShowLeaveDetails}
                    data={leaveDetails}
                    token={token}
                />}
            </div>
        </>
    )
}

export default StaffReviewedRequest;
