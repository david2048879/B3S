import { Modal, ModalHeader } from "reactstrap";
import formatDateToCustomFormat from "../../../helpers/dateHelper";

const ReviewedDetailModal = ({ modalIsOpen, toggleModal, data }) => {
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='md'>
            <div>
                <ModalHeader toggle={() => toggleModal()}>
                    <div className="m-2">
                        <h4 className="text-primary">Request details</h4>
                    </div>
                </ModalHeader>
                <div>
                    <table className="table">
                        <thead>
                            <tr className="table-primary">
                                <td>Description of the request</td>
                            </tr>
                        </thead>
                        <div className="mx-3">
                            <tbody style={{ lineHeight: 0.8 }}>
                                <tr>
                                    <td>staff :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.staff}</td>
                                </tr>
                                {data.department&&<tr>
                                    <td>department :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.department}</td>
                                </tr>}
                                <tr>
                                    <td>Leave type:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.leaveType}</td>
                                </tr>
                                {data.actingPerson&&<tr>
                                    <td>acting person :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.actingPerson}</td>
                                </tr>}
                                <tr>
                                    <td>days taken:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.daysTaken} days</td>
                                </tr>
                                <tr>
                                    <td>start date:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.startDate)}</td>
                                </tr>
                                <tr>
                                    <td>end date:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.endDate)}</td>
                                </tr>
                                <tr>
                                    <td>return date:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.returnDate)}</td>
                                </tr>
                                <tr>
                                    <td>supervisor name:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.supervisor}</td>
                                </tr>
                                {data.manager&&<tr>
                                    <td>Manager :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.manager}</td>
                                </tr>}
                                {data.hrmanagerrequestdate && <> <tr>
                                    <td>request sent to you on:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.managerRequestDate)}</td>
                                </tr>
                                </>
                                }
                            </tbody>
                        </div>
                    </table>
                </div>
                <div className="row">
                    <div className="d-flex justify-content-end m-4">
                        <button type="button" className="btn btn-light btn-sm mx-5" onClick={() => toggleModal()}>Cancel</button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ReviewedDetailModal;