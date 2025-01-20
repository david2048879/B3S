import { useEffect, useState } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { formatTextDateInput } from "../../../helpers/dateHelper"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { API } from "../../../config";
import DeleteDatesModal from "./deleteDatesModal";
import { checkIfIsAWeekendDate, calculateWeekendDays } from "../../../helpers/leaveHelpers";

const SupervisorModifyLeaveDatesModal = ({ modalIsOpen, toggleModal, data, token, toggleMoreInfo }) => {
    const [newLeaveDates, setNewLeaveDates] = useState(data.plannedDates.map(plannedDate => ({
        startDate: plannedDate.startDate,
        endDate: plannedDate.endDate,
        days: plannedDate.daysPlanned,
    })));
    const [remainingDays, setRemainingDays] = useState()
    const [disableConfirm, setDisableConfirm] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showRemark, setShowRemark] = useState(false);
    const [eligibleDays, setEligibleDays] = useState()
    const toggleDeleteModal = () => {
        setShowDelete(!showDelete)
    }
    const handleChange = (index, field, value) => {
        if (field === "endDate") {
            const isAweekendDate = checkIfIsAWeekendDate(value)
            if (isAweekendDate) {
                toast.warning("end  Date can't be a weekend date!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000
                });
            }
            else {
                if (newLeaveDates[index].startDate === "") {
                    newLeaveDates[index].startDate = formatTextDateInput(data.plannedDates[index].startDate)
                }
                const updatedData = [...newLeaveDates];
                updatedData[index][field] = value;
                const startDate = new Date(updatedData[index].startDate);
                const endDate = new Date(value);
                // console.log("end date", endDate);
                // console.log("start date", startDate);
                const timeDiff = Math.max(Math.ceil(endDate.getTime() - startDate.getTime()));
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                diffDays = diffDays + 1;
                let weekendDays = calculateWeekendDays(newLeaveDates[index].startDate, diffDays);
                // console.log("day difference", diffDays);
                // console.log("how many weekend days", weekendDays);
                const remaining = calculateRemainingDays(index, weekendDays, diffDays)
                // console.log("remaining days", remaining);
                if (remaining >= 0) {
                    setRemainingDays(remaining)
                    setNewLeaveDates(updatedData.map((item, i) => (i === index ? { ...item, days: diffDays - weekendDays, name: `leave ${index + 1}` } : item)));
                    setShowRemark(false);
                } else {
                    setShowRemark(true);
                }
            }
        } else {
            if (field === "startDate") {
                // console.log(index, value);
                const isAweekendDate = checkIfIsAWeekendDate(value)
                if (isAweekendDate) {
                    toast.warning("Start Date can't be a weekend date!", {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000
                    });
                }
                else {
                    const updatedData = [...newLeaveDates];
                    updatedData[index][field] = value;
                    setNewLeaveDates(updatedData);
                    data.plannedDates[index].endDate = "";
                    newLeaveDates[index].endDate = ""
                }
            }
        }
    }
    const calculateRemainingDays = (index, weekendDays, diffDays) => {
        let pickedDays = 0;
        let otherPlannedDays = 0;

        data.plannedDates.forEach((days, i) => {
            if (i !== index) {
                otherPlannedDays += days.daysPlanned;
            }
        });

        newLeaveDates.forEach((leave, i) => {
            if (i !== index) {
                pickedDays += leave.days;
            }
        });
        // console.log("picked", pickedDays);
        // console.log("other planned dates", otherPlannedDays);

        const rem = eligibleDays + weekendDays - (pickedDays + diffDays + otherPlannedDays);
        return rem;
    };

    useEffect(() => {
        const days = 0;
        if (data.yearsOfService >= 0) {
            if (data.yearsOfService >= 0 && data.yearsOfService <= 1) {
                days = 9;
            } else if (data.yearsOfService > 1 && data.yearsOfService <= 3) {
                days = 18;
            } else {
                days = 21;
            }
        }
        // console.log(days);
        setEligibleDays(days)
        setRemainingDays(days)
    }, [])
    useEffect(() => {
        const lastDates = newLeaveDates[newLeaveDates.length - 1];
        if (newLeaveDates.length >= 1) {
            if (newLeaveDates[0].startDate !== "" && newLeaveDates[0].endDate !== "") {
                setDisableConfirm(true)
            }
            else {
                setDisableConfirm(false)
            }
        }

        if (lastDates.startDate === "" && lastDates.endDate === "") {
            setDisableConfirm(true)
        }
        else if (lastDates.startDate !== "" && lastDates.endDate === "") {
            setDisableConfirm(true)
        }
        else {
            if (lastDates.startDate !== "" && lastDates.endDate !== "") {
                setDisableConfirm(false)
            }
        }
    }, [newLeaveDates])
    const updateDays = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.post(`${API}/leave/supervisor/modify/${data._id}`, newLeaveDates, config)
            toast.success("Successfully updated leave!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 10000
            });
            toggleModal()
            toggleMoreInfo()
        } catch (error) {
            toast.warning("Failed!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 10000
            });
        }
    }
    useEffect(() => {
        let count=0;
        for (let i = 0; i < newLeaveDates.length; i++) {
            if (newLeaveDates[i].startDate === "" || newLeaveDates[i].endDate === "") {
                count++;
            }
        }
        if(count>0){
            setDisableConfirm(true)
        }
        else{
            setDisableConfirm(false)
        }
    }, [newLeaveDates])
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='md'>
            <div>
                <ModalHeader toggle={() => toggleModal()}>
                    <div className="m-2">
                        <h4 className="text-primary">Modify leave dates</h4>
                    </div>
                </ModalHeader>
                <div className="mt-2">
                    {showRemark && <div className="alert alert-danger">
                        <p>Days exceeding allowed days</p>
                    </div>}
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <th>No.</th>
                                <th>Start</th>
                                <th>End</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {newLeaveDates.map((leavedates, index) => (
                                <tr key={leavedates._id}>
                                    <td>{index + 1}</td>
                                    <td><input
                                        type="date"
                                        className="form-control"
                                        min={index > 0 ?
                                            newLeaveDates[index - 1] && newLeaveDates[index - 1].endDate !== "" ?
                                                formatTextDateInput(newLeaveDates[index - 1].endDate)
                                                : "" : ""}
                                        max={newLeaveDates[index] && newLeaveDates[index].endDate !== "" ? newLeaveDates[index].startDate : formatTextDateInput(leavedates.endDate)}
                                        value={formatTextDateInput(leavedates.startDate)}
                                        disabled={index > 0 && (!newLeaveDates[index - 1] || newLeaveDates[index - 1].endDate === "")}
                                        onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                    /></td>
                                    <td><input
                                        type="date"
                                        className="form-control"
                                        value={formatTextDateInput(leavedates.endDate)}
                                        min={formatTextDateInput(leavedates.startDate)}
                                        onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                    />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <button type="button" className="btn btn-primary mx-4 mb-2" disabled={disableConfirm || showRemark} onClick={updateDays}>Update</button>
                </div>
                <div>
                    <ToastContainer />
                </div>
                <div>
                    {showDelete &&
                        <DeleteDatesModal modalIsOpen={showDelete} toggleModal={toggleDeleteModal} toggleMoreInfo={toggleMoreInfo} />
                    }
                </div>
            </div>
        </Modal>
    )
}

export default SupervisorModifyLeaveDatesModal