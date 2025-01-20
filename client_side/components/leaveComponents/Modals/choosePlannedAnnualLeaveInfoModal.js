import { useState } from "react";
import { Modal, ModalFooter } from "reactstrap";
import formatDateToCustomFormat from "../../../helpers/dateHelper";
import { formatTextDateInput } from "../../../helpers/dateHelper";



const ChooseLeavePlannedDate = ({ modalIsOpen, toggleModal, data, setPickedPlan,choosePlan,chooseDifferentPlan }) => {
    const [activateOperations, setActivateOperations] = useState(false)
    const [expiredDates,setExpiredDates]=useState(false)
    const [selectedRow, setSelectedrow] = useState()
    const activateRow = (plannedDate) => {
        setSelectedrow(plannedDate._id)
        setPickedPlan({
            startDate:formatTextDateInput(plannedDate.startDate),
            endDate:formatTextDateInput(plannedDate.endDate),
            daysTaken:plannedDate.daysPlanned
        })
        const check=checkExpiredDate(formatTextDateInput(plannedDate.startDate))
        if (selectedRow === "") {
            setActivateOperations(false)
        }
        else {
             if(check===false){
             setActivateOperations(true)
             }
             else{
                setActivateOperations(false)
             }
        }
    }
    const checkExpiredDate=(value)=>{
        const today=new Date();
        const startDate=new Date(value)
        if(today>startDate)
        {
            setExpiredDates(true)
            return true
        }
        else{
            setExpiredDates(false)
            return false
        }
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='md'>
            <div>
                <div className="m-4">
                    <h3 className="text-primary">Leave plan information</h3>
                </div>
                <div>
                    {expiredDates&&<div className="alert alert-success mt-0 mx-4 p-0"><span className="d-flex flex-row justify-content-center"> Dates have expired !!</span></div>}
                    <table className="table table-borderless table-hover">
                        <thead>
                            <tr className='table-primary'>
                                <td>START DATE</td>
                                <td>END DATE</td>
                                <td>DAYS TAKEN</td>
                            </tr>
                        </thead>
                        <tbody>
                            {data.leave.plannedDates.map((plannedDate) => {
                                return (
                                    <>
                                        <tr key={plannedDate._id} style={{ cursor: 'pointer' }} onClick={() => activateRow(plannedDate)} className={selectedRow === plannedDate._id ? 'table-success' : ''}>
                                            <td>{formatDateToCustomFormat(plannedDate.startDate)}</td>
                                            <td>{formatDateToCustomFormat(plannedDate.endDate)}</td>
                                            <td>{plannedDate.daysPlanned} day(s)</td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="my-2 mx-2">
                <div className="row">
                    <div className="col">
                        {activateOperations && <button className="btn btn-primary btn-sm" onClick={choosePlan}>Choose plan</button>}
                    </div>
                    <div className="col">
                        <div className="d-flex justify-content-end">
                        <button className="btn btn-success btn-sm mx-2" onClick={chooseDifferentPlan}>Plan different</button>
                            <button className="btn btn-light btn-sm" onClick={toggleModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}



export default ChooseLeavePlannedDate;