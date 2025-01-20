import { useEffect, useState } from "react";
import {
    WarningTwoTone,
} from "@ant-design/icons";
import StaffAnnualLeaveApprovedDetailedDescription from "./staffAnnualLeaveApprovedDetailedDescription";


const ApprovedLeavePlan = ({ data, moreInfo, setMoreInfo }) => {
    const [approvedData, setApprovedData] = useState([])
    const [dataPresent, setDataPresent] = useState(false)
    const [leaveInfo, setLeaveInfo] = useState()
    const toggleMoreInfo = () => {
        setMoreInfo(!moreInfo)
    }
    const showLeaveInfo = (leavedetails) => {
        setLeaveInfo(leavedetails)
        setMoreInfo(true)
    }
    useEffect(() => {
        setMoreInfo(false)
        const filteredData = data.filter(item => item.supervisorValidated);
        let count = filteredData.length
        setApprovedData(filteredData);
        if (count > 0) {
            setDataPresent(true)
        }
        else {
            setDataPresent(false)
        }
    }, [data]);
    return (
        <div className="mt-1 font-monospace" style={{ maxHeight: "400px", minHeight: "400px", overflowY: "auto" }}>
            {dataPresent ?
                <div>
                    {!moreInfo && <table className="table table-borderless table-hover" >
                        <thead>
                            <tr className="table-success">
                                <th>NO.</th>
                                <th>Staff names</th>
                                <th>Staff department</th>
                                <th>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedData.map((info, index) => {
                                try {
                                    return (
                                        <tr key={info._id} style={{ cursor: "pointer" }} onClick={() => showLeaveInfo(info)}>
                                            <td>{index + 1}</td>
                                            <td>{info.staff.empNames}</td>
                                            <td>{info.staff.currentAppointment.department}</td>
                                            <td>
                                                <span className="badge bg-success text-white">Complete</span>
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
                                            <td>
                                                <span className="badge bg-warning text-white">Incomplete</span>
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>}
                    {moreInfo && <StaffAnnualLeaveApprovedDetailedDescription leaveInfo={leaveInfo} />}
                </div> : (<div>
                    <div className="d-flex justify-content-center mt-5">
                        <div className="d-flex flex-column">
                            <WarningTwoTone style={{ fontSize: "7rem" }} />
                            <p style={{ fontSize: '2rem' }} className="mt-3">No leave requests</p>
                        </div>
                    </div>
                </div>)}
        </div>
    )
}

export default ApprovedLeavePlan