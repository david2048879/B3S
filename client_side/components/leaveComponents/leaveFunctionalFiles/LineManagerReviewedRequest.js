import { useState, useEffect } from "react";
import ReviewedDetailModal from "../Modals/actualLeaveReviewedDetailInformationModal";
import {
    WarningTwoTone,
    SearchOutlined,
} from "@ant-design/icons";

const ManagerReviewedRequest = ({ leaveData }) => {
    const [data, setData] = useState([])
    const [search, setSearch] = useState("")
    const [dataAvailable, setDataAvailable] = useState(false)
    const [showLeaveDetails, setShowLeaveDetails] = useState(false)
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
        supervisor: ""
    })
    const toggleShowLeaveDetails = () => {
        setShowLeaveDetails(!showLeaveDetails)
    }
    const initiateShowLeaveDetails = (leave) => {
        setLeaveDetails({
            leaveType: leave.actualLeave.leaveType,
            startDate: leave.actualLeave.startDate,
            endDate: leave.actualLeave.endDate,
            returnDate: leave.actualLeave.returnDate,
            daysTaken: leave.actualLeave.daysTaken,
            managerRequestDate: leave.actualLeave.managerRequestDate,
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
                if (currentLeaveInformation.actualLeave.lineManagerApproval.requestStatus === "REJECTED" || currentLeaveInformation.actualLeave.lineManagerApproval.requestStatus === "APPROVED") {
                    count++;
                    dataStatus.push(leaveData.leave[i])
                }
            }
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
    }, [])

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
                        {dataAvailable ? <table className="table mt-3 table-hover" >
                            <thead>
                                <tr className="table-primary">
                                    <th>NO.</th>
                                    <th>Names</th>
                                    <th>Department</th>
                                    <th>Leave type</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((leaveStatus, index) => {
                                    try {
                                        return (
                                            <tr key={index} onClick={() => initiateShowLeaveDetails(leaveStatus)} style={{ cursor: "pointer" }}>
                                                <td>{index + 1}</td>
                                                <td>{leaveStatus.leaveInfo.staff.empNames}</td>
                                                <td>{leaveStatus.leaveInfo.staff.department}</td>
                                                <td>{leaveStatus.actualLeave.leaveType}</td>
                                                <td>
                                                    {leaveStatus.actualLeave.supervisorApproval.requestStatus === "APPROVED" ? (<span className="badge rounded-pill bg-success">Approved</span>)
                                                        : (<span className="badge rounded-pill bg-danger">Rejected</span>)}
                                                </td>
                                            </tr>
                                        );
                                    }
                                    catch (error) {
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
            </div>
        </>
    )
}

export default ManagerReviewedRequest;
