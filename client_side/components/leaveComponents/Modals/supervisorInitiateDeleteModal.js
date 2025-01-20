import { useEffect, useState } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { formatTextDateInput } from "../../../helpers/dateHelper"
import 'react-toastify/dist/ReactToastify.css';
import DeleteDatesModal from "./deleteDatesModal";


const SupervisorInitiateDelete = ({ modalIsOpen, toggleModal, data,token}) => {
    const [showDelete,setShowDelete]=useState(false)
    const [deleteInfo,setDeleteInfo]=useState({
        index:"",
        id:data._id
    })
    const toggleShowDelete=()=>{
        setShowDelete(!showDelete)
    }
    const showDeleteModal=(leaveIndex)=>{
        setDeleteInfo({...deleteInfo,
            index:leaveIndex
        })
        console.log(deleteInfo);
        setShowDelete(true)
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <ModalHeader toggle={() => toggleModal()}>
                    <div className="m-2">
                        <h4 className="text-primary">Delete date plans</h4>
                    </div>
                </ModalHeader>
                <div className="mt-2">
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <th>No.</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Days</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.plannedDates.map((leavedates, index) => (
                                <tr key={leavedates._id}>
                                    <td>{index + 1}</td>
                                    <td>{formatTextDateInput(leavedates.startDate)}</td>
                                    <td>{formatTextDateInput(leavedates.endDate)}</td>
                                    <td>{leavedates.daysPlanned}</td>
                                    <td><button className="btn btn-sm btn-outline-danger" onClick={()=>showDeleteModal(index)}>Delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary mx-4 mb-2" onClick={() => toggleModal()}>Cancel</button>
                </div>
                {showDelete&&<DeleteDatesModal modalIsOpen={showDelete} toggleModal={toggleShowDelete} toggleParentModal={toggleModal} info={deleteInfo} token={token}/>}
            </div>
        </Modal>
    )
}

export default SupervisorInitiateDelete