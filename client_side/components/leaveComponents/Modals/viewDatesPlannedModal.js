import { Modal } from "reactstrap";
import {formatDateInNumbers} from "../../../helpers/dateHelper"

const PlannedDatesModal = ({ modalIsOpen, toggleModal, data }) => {   
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <table className="table table-borderless">
                    <thead>
                        <tr className="table-primary">
                            <td className="d-flex justify-content-center">planned dates</td>
                        </tr>
                    </thead>
                </table>
                <div className="mt-2">
                    <table className="table table-bordered">
                        <thead>
                            <tr className="table-dark">
                                <th>No.</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Days</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.plannedDates.map((leavedates, index) => (
                                <tr key={leavedates._id}>
                                    <td>{index + 1}</td>
                                    <td>{formatDateInNumbers(leavedates.startDate)}</td>
                                    <td>{formatDateInNumbers(leavedates.endDate)}</td>
                                    <td>{leavedates.daysPlanned}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary mx-4 mb-2" onClick={() => toggleModal()}>Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default PlannedDatesModal