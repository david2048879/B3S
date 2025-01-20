import { useState, useEffect } from "react"
import PlannedDatesModal from "../Modals/viewDatesPlannedModal"


const StaffAnnualLeaveApprovedDetailedDescription = ({leaveInfo,moreInfo,setMoreInfo }) => {
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState({
        daysTaken: "",
        remainingDays: ""
    })
    const toggleShowModal = () => {
        setShowModal(!showModal)
    }
    const toggleMoreInfo = () => {
        setMoreInfo(!moreInfo)
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
            <table className="table table-borderless mt-2">
                    <thead>
                        <tr className="table-primary">
                            <td className="d-flex justify-content-center"><strong>LEAVE DECRIPTION</strong></td>
                        </tr>
                    </thead>
                </table>
                <table className="table table-borderless font-monospace">
                    <tbody>
                        <tr>
                            <td>Staff names :</td>
                            <td>{leaveInfo.staff?.empNames || "N/A"} </td>
                        </tr>
                        <tr>
                            <td>Staff job title :</td>
                            <td>{leaveInfo.staff?.currentAppointment.jobTitle || "N/A"} </td>
                        </tr>
                        <tr>
                            <td>Staff department :</td>
                            <td>{leaveInfo.staff?.currentAppointment.department || "N/A"} </td>
                        </tr>
                        <tr>
                            <td>Branch :</td>
                            <td>{leaveInfo.staff?.currentAppointment.branch || "N/A"} </td>
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
                            <td>Leave taken in:</td>
                            <td>{leaveInfo.plannedDates.length} part(s)</td>
                        </tr>
                        <tr>
                            <td>Planned dates:</td>
                            <td>
                                <button className="btn btn-outline-primary btn-sm" onClick={toggleShowModal}>View dates planned</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {showModal && (
                    <PlannedDatesModal modalIsOpen={showModal} toggleModal={toggleShowModal} data={leaveInfo} />
                )}
            </div>
        </>
    )
}

export default StaffAnnualLeaveApprovedDetailedDescription