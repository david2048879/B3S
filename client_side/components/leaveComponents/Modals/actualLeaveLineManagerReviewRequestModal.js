import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { useState, useEffect } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { formatTextDateInput } from "../../../helpers/dateHelper";
import Select from "react-select";


const LineManagerReviewRequest = ({ modalIsOpen, toggleModal, data, setData, handleReview, HRStaff }) => {
    const [activateConfrim, setActivateConfirm] = useState(false);
    const [showComment, setShowComment] = useState(false)
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("")
    const [disableConfirmButton, setDisableConfirmButton] = useState(true)
    const [showChooseManager, setShowChooseManager] = useState(false)
    const togglePopover = () => setPopoverOpen(!popoverOpen);
    const handleReject = (e) => {
        e.preventDefault();
        togglePopover()
        setConfirmText("Reject request")
        setShowChooseManager(false)
        setData({ ...data, status: "REJECTED" })
        setDisableConfirmButton(true)
        setShowComment(true)

    }
    const handleApprove = (e) => {
        e.preventDefault();
        togglePopover()
        setConfirmText("Approve request")
        setShowComment(false)
        setData({ ...data, status: "APPROVED" })
        setDisableConfirmButton(true)
        setShowChooseManager(true)
    }
    useEffect(() => {
        if (confirmText === "Reject request") {
            if (data.comment && data.comment !== "") {
                setDisableConfirmButton(false)
            }
            else {
                setDisableConfirmButton(true)
            }
        }
        else {
            if (confirmText === "Approve request") {
                if (data.hrStaffCode && data.hrStaffCode !== "") {
                    setDisableConfirmButton(false)
                }
                else {
                    setDisableConfirmButton(true)
                }
            }
        }
    }, [data])
    const handleConfirm = (e) => {
        e.preventDefault()
        handleReview()
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <ModalHeader>
                    <div className="m-2">
                        <h4 className="text-primary">Approve leave request?</h4>
                    </div>
                </ModalHeader>
                <div>
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td>Description of the request to be approved</td>
                            </tr>
                        </thead>
                        <div className="mx-1">
                            <tbody style={{ lineHeight: 0.2 }}>
                                <tr>
                                    <td>staff :</td>
                                    <td></td>
                                    <td>{data.staff.names}</td>
                                </tr>
                                <tr>
                                    <td>Leave type:</td>
                                    <td></td>
                                    <td>{data.leaveType}</td>
                                </tr>
                                <tr>
                                    <td>acting person :</td>
                                    <td></td>
                                    <td>{data.actingPerson.names}</td>
                                </tr>
                                <tr>
                                    <td>days taken:</td>
                                    <td></td>
                                    <td>{data.daysTaken} days</td>
                                </tr>
                                <tr>
                                    <td>start date:</td>
                                    <td></td>
                                    <td>{formatTextDateInput(data.startDate)}</td>
                                </tr>
                                <tr>
                                    <td>end date:</td>
                                    <td></td>
                                    <td>{formatTextDateInput(data.endDate)}</td>
                                </tr>
                                <tr>
                                    <td>return date:</td>
                                    <td></td>
                                    <td>{formatTextDateInput(data.returnDate)}</td>
                                </tr>
                            </tbody>
                        </div>
                    </table>
                    {showComment && <div className="">
                        <p className="text-sucess mx-3"><small>Reason of rejection</small></p>
                        <input type="text" placeholder="type here the reason of rejection...." className="form-control" onChange={(e) => setData({ ...data, comment: e.target.value })} />
                    </div>}
                    {showChooseManager && <div className="mx-3">
                        <label htmlFor="hrstaff">Choose HR staff</label>
                        <Select
                            onChange={(e) => setData({ ...data, hrStaffCode: e.value })}
                            options={HRStaff.map((staff) => ({
                                value: staff.empCode,
                                label: staff.empNames
                            }))}
                        />
                    </div>}
                </div>
                <div className="row">
                    <div className="col">
                        {(showComment || showChooseManager) && <div className="m-4">
                            <button className="btn btn-primary btn-sm" disabled={disableConfirmButton} onClick={handleConfirm}>{confirmText}</button>
                        </div>}
                    </div>
                    <div className="col">
                        <div className="d-flex justify-content-end m-4">
                            <button type="button" className="btn btn-light btn-sm mx-4" onClick={() => toggleModal()}>Cancel</button>
                            <button type="button" className={!activateConfrim ? "btn btn-sm btn-light" : " btn-sm btn btn-primary"} id="action">Confirm</button>
                        </div>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                    <UncontrolledPopover
                        placement="top"
                        target="action"
                        trigger="legacy"
                        isOpen={popoverOpen}
                        toggle={togglePopover}
                    >
                        <PopoverHeader style={{ backgroundColor: "#cfe2ff" }}>
                            <p className='d-flex justify-content-center'>Take action</p>
                        </PopoverHeader>
                        <PopoverBody>
                            <div className="btn-group">
                                <button type="button" className="btn btn-danger" onClick={handleReject}>
                                    Reject    |
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleApprove}>
                                    Approve
                                </button>
                            </div>

                        </PopoverBody>
                    </UncontrolledPopover>
                </div>
            </div>
        </Modal>
    )
}

export default LineManagerReviewRequest;