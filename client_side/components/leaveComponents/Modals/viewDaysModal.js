import { useEffect, useState } from "react";
import { Modal, ModalHeader } from "reactstrap";


const ViewDaysModal = ({ modalIsOpen, toggleModal, data }) => {
    const [weekendDays, setWeekendDays] = useState()
    useEffect(() => {
        const startDate = new Date(data.start);
        const endDate = new Date(data.end);
        let countWeekendDays = 0;
        while (startDate <= endDate) {
            const dayOfWeek = startDate.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                countWeekendDays++;
            }
            startDate.setDate(startDate.getDate() + 1);
        }
        setWeekendDays(countWeekendDays)
    }, [data]);

    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <div>
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td>Detailed description of the leave</td>
                            </tr>
                        </thead>
                        <div className="mx-5 mt-2">
                            <tbody>
                                <tr>
                                    <td>start date:</td>
                                    <td>{data.start}</td>
                                </tr>
                                <tr>
                                    <td>End date:</td>
                                    <td>{data.end}</td>
                                </tr>
                                <tr>
                                    <td>Weekend days:</td>
                                    <td> {weekendDays} day(s)</td>
                                </tr>
                                <tr>
                                    <td>Days taken:</td>
                                    <td>{data.daysPlanned} day(s)</td>
                                </tr>
                            </tbody>
                        </div>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary mx-4 mb-2" onClick={() => toggleModal()}>Cancel</button>
                </div>
            </div>
        </Modal>
    )
}

export default ViewDaysModal;