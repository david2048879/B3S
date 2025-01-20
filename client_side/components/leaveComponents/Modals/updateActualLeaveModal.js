import { useEffect, useState, useRef } from "react";
import { Modal, ModalFooter } from "reactstrap";
import { formatTextDateInput } from "../../../helpers/dateHelper";
import Select from "react-select";
import { API } from "../../../config";
import axios from "axios";
import { checkIfIsAWeekendDate, calculateWeekendDays, checkIfIsAWeekendHowManyDaysShouldBeAdded, calculateWeekendDaysInDates } from "../../../helpers/leaveHelpers";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const UpdateActualLeaveModal = ({ modalIsOpen, toggleModal, data, setData, updateHandler, token, currentStaffInfo }) => {
    const [showUpload, setShowUpload] = useState(false);
    const [listOfSupervisors, setListOfSupervisors] = useState([])
    const [listOfActingPerson, setListOfActingPerson] = useState([])
    const [disableEndDate, setDisableEndDate] = useState(true);
    const [disableReturnDate, setDisableReturnDate] = useState(true)
    const toastId = useRef(null)
    const [modifyActingPerson, setModifyActingPerson] = useState({
        show: false,
        defaultValue: data.actingPerson.empCode
    })
    const [modifySupervisor, setModifySupervisor] = useState({
        show: false,
        defaultValue: data.supervisor.empCode
    })
    const setActingPersonDefaultValue = (e) => {
        e.preventDefault();
        setModifyActingPerson({
            ...modifyActingPerson, show: false,
        })
        setData({ ...data, actingPerson: { ...data.actingPerson, empCode: modifyActingPerson.defaultValue } })
    }
    const setSupervisorDefaultValue = (e) => {
        e.preventDefault();
        setModifySupervisor({
            ...modifySupervisor, show: false,
        })
        setData({ ...data, supervisor: { ...data.supervisor, empCode: modifySupervisor.defaultValue } })
    }
    const handleStartDateChange = (value) => {
        const isWeekend = checkIfIsAWeekendDate(value);
        if (isWeekend) {
            toast.warning("Start date can't be a weekend date!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        } else {
            const daysEligible = Number(data.daysTaken) - 1;
            const endDate = new Date(value);
            endDate.setDate(endDate.getDate() + daysEligible);
            const weekendDays = calculateWeekendDaysInDates(new Date(value), endDate);
            endDate.setDate(endDate.getDate() + weekendDays);
            let returnDate = new Date(formatTextDateInput(endDate));
            returnDate.setDate(returnDate.getDate() + 1)
            const weekendCheck = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
            if (weekendCheck.check) {
                returnDate.setDate(returnDate.getDate() + weekendCheck.addOnDays);
            }
            setData({ ...data, startDate: value, endDate: endDate, returnDate: formatTextDateInput(returnDate) });
        }
        setDisableReturnDate(false)
    }
    const fetchSupervisor = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
            let actingPersonDetails = {
                location: currentStaffInfo.currentAppointment.location,
                department: currentStaffInfo.currentAppointment.department,
            }
            let supervisorDetails = {
                location: "",
                department: "",
                isBranchManager: false,
                isOnBranch: false,
                isOnHeadOffice: false
            }
            if (currentStaffInfo.currentAppointment.location === "Head Office") {
                supervisorDetails.isOnHeadOffice = true;
                supervisorDetails.location = currentStaffInfo.currentAppointment.location;
                supervisorDetails.department = currentStaffInfo.currentAppointment.department;
            }
            else {
                supervisorDetails.isOnHeadOffice = false;
                supervisorDetails.isOnBranch = true
                supervisorDetails.location = currentStaffInfo.currentAppointment.location;
                supervisorDetails.department = currentStaffInfo.currentAppointment.department;
            }
            const listOfSupervisorsResponse = await axios.post(`${API}/leave/getsupervisors`, supervisorDetails, config)
            const listOfActingPersonResponse = await axios.post(`${API}/leave/actualleave/actingperson`, actingPersonDetails, config)
            setListOfActingPerson(listOfActingPersonResponse.data)
            setListOfSupervisors(listOfSupervisorsResponse.data)
        } catch (error) {
            console.log(error)
        }
    }
    const confirmHandler = (e) => {
        e.preventDefault()
        if (data.startDate === "" && data.endDate === "" && data.returnDate === "" && data.fileLocation === "" && data.supervisor.empCode === "" && data.actingPerson.empCode === "") {
            toast.warning("empty fields,check all the input fields!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
        else {
            updateHandler()
        }
    }
    const handleSelect = (field, value) => {
        if (field === "supervisor") {
            data.supervisor.empCode = value
        }
        else {
            if (field === "acting person") {
                data.actingPerson.empCode = value
            }
        }
    }
    useEffect(() => {
        fetchSupervisor()
    }, [modalIsOpen])
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='lg'>
            <div>
                <div className="m-3">
                    <h3 className="text-primary">Update actual leave</h3>
                </div>
                <div className="m-4">
                    <div className="row">
                        <div className="col">
                            <div className="form-floating">
                                <input type="text"
                                    className="form-control"
                                    id="leavetype"
                                    disabled={true}
                                    defaultValue={data.leaveType}
                                />
                                <label htmlFor="leavetype">Leave type</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input type="date"
                                    className="form-control"
                                    id="startdate"
                                    value={formatTextDateInput(data.startDate)}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                />
                                <label htmlFor="startdate">Start date</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <div className="form-floating">
                                <input type="date"
                                    className="form-control"
                                    id="enddate"
                                    value={formatTextDateInput(data.endDate)}
                                    disabled={disableEndDate}
                                />
                                <label htmlFor="phone">End date</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input type="date"
                                    className="form-control"
                                    id="returndate"
                                    min={data.endDate}
                                    value={formatTextDateInput(data.returnDate)}
                                    disabled={disableReturnDate}
                                />
                                <label htmlFor="returndate">return date</label>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <label htmlFor="actingPerson">Acting person</label>
                            {!modifyActingPerson.show && (<div className="input-group mb-3">
                                <input type="text" className="form-control" defaultValue={data.actingPerson.names} disabled={true} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={() => setModifyActingPerson({ ...modifyActingPerson, show: true })}>Modify</button>
                                </div>
                            </div>)}
                            {modifyActingPerson.show && (
                                <>
                                    <Select
                                        onChange={(e) => handleSelect("acting person", e.value)}
                                        options={listOfActingPerson.map((actingPerson) => ({
                                            value: actingPerson.empCode,
                                            label: actingPerson.empNames
                                        }))}
                                    />
                                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={setActingPersonDefaultValue}>defaultValue</button>
                                </>

                            )}
                        </div>
                        <div className="col">
                            <label htmlFor="actingPerson">Supervisor</label>
                            {!modifySupervisor.show && (<div class="input-group mb-3">
                                <input type="text" className="form-control" defaultValue={data.supervisor.names} disabled={true} />
                                <div className="input-group-append">
                                    <button className="btn btn-outline-secondary" type="button" onClick={() => setModifySupervisor({ ...modifySupervisor, show: true })}>Modify</button>
                                </div>
                            </div>)}
                            {modifySupervisor.show && (
                                <>
                                    <Select
                                        onChange={(e) => handleSelect("supervisor", e.value)}
                                        options={listOfSupervisors.map((supervisor) => ({
                                            value: supervisor.empCode,
                                            label: supervisor.empNames
                                        }))}
                                    />
                                    <button className="btn btn-sm btn-outline-secondary" type="button" onClick={setSupervisorDefaultValue}>defaultValue</button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <div className='d-flex flex-row justify-content-start'>
                                <p className='mt-3'><strong>Days entitled : </strong></p>
                                <p className='mx-5' style={{ fontSize: "2rem" }}><strong>{data.daysTaken}</strong></p>
                            </div>
                        </div>
                        <div className="col">
                            <div>
                                {showUpload && (<div className="input-group">
                                    <input type="file" className="form-control" id="upload"
                                        onChange={(e) => setData({
                                            ...data,
                                            fileLocation: e.target.files[0]
                                        })} />
                                </div>)}
                                {/* {!showUpload && (
                                    <div className="d-flex flex-row" >
                                        <i class="bi bi-filetype-pdf mx-3"></i>
                                        <p className="text-secondary mx-4" style={{ textDecoration: 'underline', cursor: "pointer" }} ><strong>Supporting document</strong></p>
                                        <button className="btn btn-sm btn-warning" onClick={() => setShowUpload(true)}>remove</button>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                    <ModalFooter className="m-4">
                        <button type="button" className="btn btn-outline-danger" onClick={() => toggleModal()}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={confirmHandler}>Update leave</button>
                    </ModalFooter>
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>
        </Modal>
    )
}



export default UpdateActualLeaveModal;