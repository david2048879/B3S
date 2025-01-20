import { useState, useEffect } from "react";
import { Modal, ModalHeader } from "reactstrap";
import formatDateToCustomFormat from "../../../helpers/dateHelper";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API } from "../../../config";
import axios from "axios";

const StaffReviewedDetailModal = ({ modalIsOpen, toggleModal, data, token }) => {
    const [leaveData, setLeaveData] = useState()
    const [showUpload, setShowUpload] = useState(false)
    const saveFileHandler = async (e) => {
        e.preventDefault();
        const formdata = new FormData();
        formdata.append("leaveid", data.leaveid)
        formdata.append("index", data.index)
        formdata.append('file', leaveData)
        const config = {
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axios.post(`${API}/leave/actualleave/addfile`, formdata, config)
            toast.success("Successful uploaded file!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
            toggleModal()
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    }
    useEffect(() => {
        if (data.fileLocation) {
            setShowUpload(true)
        }
    }, [data])
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
                                    <td>Leave type:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.leaveType}</td>
                                </tr>
                                {data.actingPerson && <tr>
                                    <td>Acting person :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.actingPerson}</td>
                                </tr>}
                                <tr>
                                    <td>Days taken:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.daysTaken} days</td>
                                </tr>
                                <tr>
                                    <td>Start date:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.startDate)}</td>
                                </tr>
                                <tr>
                                    <td>End date:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.endDate)}</td>
                                </tr>
                                <tr>
                                    <td>Return date:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{formatDateToCustomFormat(data.returnDate)}</td>
                                </tr>
                                <tr>
                                    <td>Supervisor name:</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.supervisor}</td>
                                </tr>
                                {data.status && <tr>
                                    <td>Status :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.status === "REJECTED" ?
                                        <button className="btn btn-sm btn-danger">REJECTED</button> :
                                        <button className="btn btn-sm btn-success">APPROVED</button>}</td>
                                </tr>}
                                {data.status && <tr>
                                    <td>Upload file :</td>
                                    <td></td>
                                    <td style={{ fontWeight: "bold" }}>{data.status === "APPROVED" &&
                                        <>
                                            {showUpload ? (
                                                <div className="d-flex flex-row" >
                                                    <i class="bi bi-filetype-pdf mx-3"></i>
                                                    <p className="text-secondary mx-4" style={{ textDecoration: 'underline', cursor: "pointer" }} ><strong>Supporting document</strong></p>
                                                    <button className="btn btn-sm btn-warning" onClick={() => setShowUpload(false)}>remove</button>
                                                </div>
                                            ) : (
                                                <div className="input-group">
                                                    <input type="file" className="form-control" id="upload" onChange={(e) => setLeaveData(e.target.files[0])} />
                                                    <button className="btn btn-primary" htmlFor="upload" disabled={!leaveData} onClick={saveFileHandler}>Upload</button>
                                                </div>
                                            )}
                                        </>
                                    }
                                    </td>
                                </tr>}
                                {data.rejectionDetails &&
                                    <>
                                        <tr>
                                            <td>Rejected By :</td>
                                            <td></td>
                                            <td style={{ fontWeight: "bold" }}>{data.rejectionDetails.step}</td>
                                        </tr>
                                        <tr>
                                            <td>Name :</td>
                                            <td></td>
                                            <td style={{ fontWeight: "bold" }}>{data.rejectionDetails.name}</td>
                                        </tr>
                                        <tr>
                                            <td>Reason of rejection :</td>
                                            <td></td>
                                            <td style={{ fontWeight: "light" }}>
                                                <div className="alert alert-primary text-dark"> {data.rejectionDetails.comment}</div>
                                            </td>
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
                <div>
                    <ToastContainer />
                </div>
            </div>
        </Modal>
    )
}

export default StaffReviewedDetailModal;