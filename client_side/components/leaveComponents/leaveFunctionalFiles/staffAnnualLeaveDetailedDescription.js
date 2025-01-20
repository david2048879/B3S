import { useState, useEffect } from "react"
import PlannedDatesModal from "../Modals/viewDatesPlannedModal"
import SupervisorModifyLeaveDatesModal from "../Modals/supervisorModifyLeaveModal"
import SupervisorInitiateDelete from "../Modals/supervisorInitiateDeleteModal"
import { API } from "../../../config"
import { toast } from "react-toastify";
import axios from "axios"



const StaffAnnualLeaveDetailedDescription = ({ token, leaveInfo, showModifyModal, toggleShowModifyModal, showInitiateDeleteModal, toggleShowDeleteModal, toggleMoreInfo }) => {
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState({
        daysTaken: "",
        remainingDays: ""
    })
    const toggleShowModal = () => {
        setShowModal(!showModal)
    }
    const ApproveLeave = async (id) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        };
        const leaveInformation = {
            leaveid: id
        }
        try {
            await axios.post(`${API}/leave/supervisor/approve`, leaveInformation, config
            );
            toast.success('successfully approved the request', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000,
            });
            toggleMoreInfo()
        } catch (error) {
            toast.warning('Failed to approve leave requests', {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 10000,
            });
            console.error(error);
        }
    }
    useEffect(() => {
        let totalDaysPlanned = 0;
        leaveInfo.plannedDates.forEach((leave) => {
            totalDaysPlanned += leave.daysPlanned;
        })
        const remaining = leaveInfo.daysEligible - totalDaysPlanned
        setData({
            daysTaken: totalDaysPlanned,
            remainingDays: remaining
        })

    }, [])
    return (
        <>
            <div>
                <table className="table table-borderless font-monospace">
                    <tbody>
                        <tr>
                            <td>staff names :</td>
                            <td>{leaveInfo.staff.empNames} </td>
                        </tr>
                        <tr>
                            <td>staff job title :</td>
                            <td>{leaveInfo.staff.currentAppointment.jobTitle} </td>
                        </tr>
                        <tr>
                            <td>staff department :</td>
                            <td>{leaveInfo.staff.currentAppointment.department} </td>
                        </tr>
                        <tr>
                            <td>branch :</td>
                            <td>{leaveInfo.staff.currentAppointment.branch} </td>
                        </tr>
                        <tr>
                            <td>Years of service :</td>
                            <td>{leaveInfo.yearsOfService}</td>
                        </tr>
                        <tr>
                            <td>Annual days taken:</td>
                            <td>{data.daysTaken} day(s)</td>
                        </tr>
                        <tr>
                            <td>Annual days remaining:</td>
                            <td>{data.remainingDays} day(s)</td>
                        </tr>
                        <tr>
                            <td>leave taken in:</td>
                            <td>{leaveInfo.plannedDates.length} part(s)</td>
                        </tr>
                        <tr>
                            <td>Planned dates:</td>
                            <td>
                                <button className="btn btn-outline-primary btn-sm" onClick={toggleShowModal}>View dates planned</button>
                            </td>
                        </tr>
                        <tr>
                            <td>validate:</td>
                            <td>
                                <button className="btn btn-outline-success btn-sm" onClick={() => ApproveLeave(leaveInfo._id)}>Approve</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {showModal && (
                    <PlannedDatesModal modalIsOpen={showModal} toggleModal={toggleShowModal} data={leaveInfo} />
                )}
                {showModifyModal && (
                    <SupervisorModifyLeaveDatesModal modalIsOpen={showModifyModal} toggleModal={toggleShowModifyModal} data={leaveInfo} token={token} toggleMoreInfo={toggleMoreInfo} />
                )}
                {showInitiateDeleteModal && (
                    <SupervisorInitiateDelete modalIsOpen={showInitiateDeleteModal} toggleModal={toggleShowDeleteModal} data={leaveInfo} token={token} toggleMoreInfo={toggleMoreInfo} />
                )}
            </div>
        </>
    )
}

export default StaffAnnualLeaveDetailedDescription