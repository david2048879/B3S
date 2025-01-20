import { Modal, ModalHeader, ModalFooter } from 'reactstrap';
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import { checkIfIsAWeekendDate, calculateWeekendDaysInDates, checkIfIsAWeekendHowManyDaysShouldBeAdded, calculateWeekendDays, calculateOffDays } from '../../../helpers/leaveHelpers';
import ChooseLeavePlannedDate from '../Modals/choosePlannedAnnualLeaveInfoModal';;
import InformationModal from '../Modals/informationModal';;
import { formatTextDateInput } from "../../../helpers/dateHelper";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RequestLeave = ({ token, modalIsOpen, toggleModal }) => {
    const [leaveTypes, setLeaveTypes] = useState([])
    const [currentStaff, setCurrentStaff] = useState({});
    const [showRemainingDays, setShowRemainingDays] = useState({
        show: false,
        days: 0
    })
    const [minEndDate, setMinEndDate] = useState();
    const [showInformation, setShowInformation] = useState(false)
    const [allOffDays, setAllOffDays] = useState([])
    const [disableRequest, setDisableRequest] = useState(false)
    const [listOfActingPerson, setListOfActingPerson] = useState([])
    const [listOfSupervisors, setListOfSupervisors] = useState([])
    const [disableEndDate, setDisableEndDate] = useState(false)
    const [disableStartDate, setDisableStartDate] = useState(false)
    const [refreshDates, setRefreshdates] = useState(true)
    const [plannedAnnualLeaveInfo, setPlannedAnnualLeaveInfo] = useState()
    const [pickedLeavePlan, setPickedLeavePlan] = useState({
        startDate: "",
        endDate: "",
        daysTaken: ""
    })
    const [leavePlanModal, setLeavePlanModal] = useState(false)
    const [actualLeave, setActualLeave] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        returnDate: "",
        daysTaken: 0,
        leaveReason: "",
        supervisor: "",
        actingPersonCode: "",
        leaveid: "",
        dataPresent: "",
        staffcode: ""
    });
    const toastId = useRef(null)
    const toggleLeavePlanModal = () => {
        setLeavePlanModal(!leavePlanModal)
    }
    const toggleRefreshDates = () => {
        setRefreshdates(!refreshDates)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })

        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        if (plannedAnnualLeaveInfo.dataPresent === true) {
            // formdata.append('dataPresent', true)
            // formdata.append('leaveid', plannedAnnualLeaveInfo.leave._id)
            setActualLeave({ ...actualLeave, dataPresent: true, leaveid: plannedAnnualLeaveInfo.leave._id })
        }
        else {
            // formdata.append('dataPresent', false)
            // formdata.append('staffcode',currentStaff.empCode)
            setActualLeave({ ...actualLeave, dataPresent: false, staffcode: currentStaff.empCode })
        }
        try {
            const response = await axios.post(`${API}/leave/actualleave/requestleave`, actualLeave, config)
            toast.update(toastId.current, { render: "Successfully requested leave", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            toggleModal()
        } catch (error) {
            console.log(error)
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
    }
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const currentStaffResponse = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
            setCurrentStaff(currentStaffResponse.data.staffProfile)
            const leaveTypesResponse = await axios.get(`${API}/leave/getleavetypes`, config)
            setLeaveTypes(leaveTypesResponse.data)
            const listOfSupervisorsResponse = await axios.get(`${API}/leave/getsupervisors`, config)
            const listOfActingPersonResponse = await axios.get(`${API}/leave/actualleave/actingperson`, config)
            const allOffDaysResponse = await axios.get(`${API}/leave/viewoffdays`, config);
            setAllOffDays(allOffDaysResponse.data.alloff)
            setListOfActingPerson(listOfActingPersonResponse.data)
            setListOfSupervisors(listOfSupervisorsResponse.data)
            const plannedLeaveResponse = await axios.get(`${API}/leave/getleaveinfo/${currentStaffResponse.data.staffProfile._id}`, config);
            setPlannedAnnualLeaveInfo(plannedLeaveResponse.data)
            if (plannedLeaveResponse.data.dataPresent === true) {
                setActualLeave({ ...actualLeave, dataPresent: true, leaveid: plannedLeaveResponse.data.leave._id })
            }
            else {
                setActualLeave({ ...actualLeave, dataPresent: false, staffcode: currentStaffResponse.data.staffProfile.empCode })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChooseLeaveType = (e) => {
        if (e.target.value === "Annual Leave") {
            setActualLeave({
                ...actualLeave,
                startDate: "",
                endDate: "",
                returnDate: "",
                daysTaken: 0,
                actingPersonCode: "",
            })
            if (plannedAnnualLeaveInfo.dataPresent === true && plannedAnnualLeaveInfo.leave.supervisorValidated) {
                toggleLeavePlanModal()
            }
            else {
                toggleInformationModal()
            }
        }
        else {
            const pickedLeaveType = leaveTypes.find((leave) => leave.leaveName === e.target.value);
            const daysEntitled = pickedLeaveType?.daysEntitled;
            setDisableEndDate(true)
            setActualLeave({
                ...actualLeave,
                startDate: "",
                endDate: "",
                returnDate: "",
                actingPersonCode: "",
                supervisor: "",
                leaveType: e.target.value,
                daysTaken: daysEntitled
            })
            setDisableStartDate(false)
        }
    }
    const choosePlan = (e) => {
        e.preventDefault();
        const daysEligible = plannedAnnualLeaveInfo.leave.daysRemaining
        const returnDate = new Date(pickedLeavePlan.endDate);
        const offdays = calculateOffDays(allOffDays, pickedLeavePlan.startDate, pickedLeavePlan.endDate)
        returnDate.setDate(returnDate.getDate() + 1)
        const weekendCheck = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
        if (weekendCheck.check) {
            returnDate.setDate(returnDate.getDate() + weekendCheck.addOnDays);
        }
        returnDate.setDate(returnDate.getDate() + offdays.length)
        setMinEndDate(formatTextDateInput(returnDate))
        const weekendCheckInOffs = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
        if (weekendCheckInOffs.check) {
            returnDate.setDate(returnDate.getDate() + weekendCheckInOffs.addOnDays);
            setMinEndDate(formatTextDateInput(returnDate))
        }
        setActualLeave({
            ...actualLeave,
            leaveType: "Annual Leave",
            startDate: pickedLeavePlan.startDate,
            endDate: pickedLeavePlan.endDate,
            daysTaken: pickedLeavePlan.daysTaken,
            returnDate: formatTextDateInput(returnDate)
        })
        setShowRemainingDays({ ...showRemainingDays, days: daysEligible - pickedLeavePlan.daysTaken })
        setDisableStartDate(true)
        setDisableEndDate(true)
        toggleLeavePlanModal()
    }
    const chooseDifferentPlan = (e) => {
        e.preventDefault();
        //const daysEligible = plannedAnnualLeaveInfo.leave.daysRemaining
        setActualLeave({
            ...actualLeave, leaveType: "Annual Leave",
            startDate: "",
            endDate: "",
            daysTaken: 0,
            returnDate: ""
        })
        setShowRemainingDays({ ...showRemainingDays, show: true })
        setDisableStartDate(false)
        setDisableEndDate(true)
        toggleLeavePlanModal()
    }

    useEffect(() => {
        fetchData()
    }, [])
    const toggleInformationModal = () => {
        setShowInformation(!showInformation)
    }
    //handleInput
    const handleChange = (field, value) => {
        if (field === "startDate") {
            const isWeekend = checkIfIsAWeekendDate(value);

            if (isWeekend) {
                toast.warning("Start Date can't be a weekend date!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000
                });
            } else {
                if (actualLeave.leaveType !== "Annual Leave" && actualLeave.leaveType !== "Sick Leave" && actualLeave.leaveType !== "Circumstantial Leave") {
                    const pickedLeaveType = leaveTypes.find((leave) => leave.leaveName === actualLeave.leaveType);
                    if (pickedLeaveType) {
                        const daysEligible = pickedLeaveType.daysEntitled - 1;
                        const endDate = new Date(value);
                        endDate.setDate(endDate.getDate() + daysEligible);

                        const weekendDays = calculateWeekendDaysInDates(new Date(value), endDate);
                        endDate.setDate(endDate.getDate() + weekendDays);
                        //calculate off days
                        const offdays = calculateOffDays(allOffDays, value, endDate)
                        // console.log("off days",offdays.length)
                        let returnDate = new Date(formatTextDateInput(endDate));
                        returnDate.setDate(returnDate.getDate() + 1)
                        const weekendCheck = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
                        if (weekendCheck.check) {
                            returnDate.setDate(returnDate.getDate() + weekendCheck.addOnDays);
                        }
                        //add off days
                        returnDate.setDate(returnDate.getDate() + offdays.length)
                        setMinEndDate(formatTextDateInput(returnDate))
                        const weekendCheckInOffs = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
                        if (weekendCheckInOffs.check) {
                            returnDate.setDate(returnDate.getDate() + weekendCheckInOffs.addOnDays);
                            setMinEndDate(formatTextDateInput(returnDate))
                        }
                        setActualLeave({ ...actualLeave, startDate: value, endDate: formatTextDateInput(endDate), returnDate: formatTextDateInput(returnDate) });
                    }
                }
                else if (actualLeave.leaveType === "Annual Leave") {
                    const daysEligible = plannedAnnualLeaveInfo.leave.daysRemaining - 1
                    const endDate = new Date(value);
                    endDate.setDate(endDate.getDate() + daysEligible);
                    const weekendDays = calculateWeekendDaysInDates(new Date(value), endDate);
                    // console.log("weekend days", weekendDays);
                    const offdays = calculateOffDays(allOffDays, value, endDate)
                    endDate.setDate(endDate.getDate() + weekendDays + offdays.length);
                    const weekendEndDateCheck = checkIfIsAWeekendHowManyDaysShouldBeAdded(endDate);
                    if (weekendEndDateCheck.check) {
                        endDate.setDate(endDate.getDate() + weekendEndDateCheck.addOnDays);
                    }
                    let returnDate = new Date(formatTextDateInput(endDate));
                    returnDate.setDate(returnDate.getDate() + 1)
                    const weekendCheck = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
                    if (weekendCheck.check) {
                        returnDate.setDate(returnDate.getDate() + weekendCheck.addOnDays);
                    }
                    returnDate.setDate(returnDate.getDate() + offdays.length)
                    setMinEndDate(formatTextDateInput(returnDate))
                    const weekendCheckInOffs = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
                    if (weekendCheckInOffs.check) {
                        returnDate.setDate(returnDate.getDate() + weekendCheckInOffs.addOnDays);
                        setMinEndDate(formatTextDateInput(returnDate))
                    }
                    setActualLeave({ ...actualLeave, startDate: value, endDate: formatTextDateInput(endDate), daysTaken: daysEligible + 1, returnDate: formatTextDateInput(returnDate) });
                    setDisableEndDate(false)
                    setShowRemainingDays({ ...showRemainingDays, days: 0, })
                }
                else {
                    setDisableEndDate(false)
                    setActualLeave({ ...actualLeave, startDate: value })
                }
            }
        }
    };
    const handleEndDate = (field, value) => {
        const isWeekend = checkIfIsAWeekendDate(value);
        if (isWeekend) {
            toast.warning("End date can't be a weekend date!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
        else {
            if (field === "endDate") {
                if (actualLeave.leaveType === "Annual Leave") {
                    const daysEligible = plannedAnnualLeaveInfo.leave.daysRemaining
                    const endDate = new Date(value)
                    const startDate = new Date(actualLeave.startDate)
                    const timeDiff = Math.max(Math.ceil(endDate.getTime() - startDate.getTime()), 0);
                    let howManyDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    const weekendDays = calculateWeekendDaysInDates(startDate, endDate);
                    const offdays = calculateOffDays(allOffDays, startDate, endDate)
                    howManyDays = howManyDays - weekendDays - offdays
                    const daysRemaining = plannedAnnualLeaveInfo.leave.daysRemaining - (howManyDays + 1)
                    let returnDate = new Date(formatTextDateInput(endDate));
                    returnDate.setDate(returnDate.getDate() + 1)
                    const weekendCheck = checkIfIsAWeekendHowManyDaysShouldBeAdded(returnDate);
                    if (weekendCheck.check) {
                        returnDate.setDate(returnDate.getDate() + weekendCheck.addOnDays);
                    }
                    returnDate.setDate(returnDate.getDate() + offdays.length)
                    if (howManyDays + 1 > daysEligible) {
                        toast.error("Days exceeding allowed days!", {
                            position: toast.POSITION.TOP_LEFT,
                            autoClose: 5000
                        });
                    }
                    else {
                        setActualLeave({
                            ...actualLeave, endDate: value, returnDate: formatTextDateInput(returnDate), daysTaken: howManyDays + 1
                        })
                        setShowRemainingDays({ ...showRemainingDays, days: daysRemaining })
                    }
                }
                else {
                    const endDate = new Date(value)
                    const startDate = new Date(actualLeave.startDate)
                    const timeDiff = Math.max(Math.ceil(endDate.getTime() - startDate.getTime()), 0);
                    let howManyDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    howManyDays = howManyDays + 1
                    const weekendDays = calculateWeekendDays(actualLeave.startDate, howManyDays)
                    setActualLeave({
                        ...actualLeave, endDate: value,
                        daysTaken: howManyDays - weekendDays
                    })
                }
            }
            else {
                if (field === "returnDate") {
                    setActualLeave({ ...actualLeave, returnDate: value })
                }
            }
        }
    }
    useEffect(() => {
        if (actualLeave.leaveType !== "" && actualLeave.actingPersonCode !== "" && actualLeave.endDate !== "" &&
            actualLeave.leaveReason !== "" && actualLeave.supervisor !== "" && actualLeave.returnDate !== "" &&
            actualLeave.startDate !== "") {
            setDisableRequest(false)
        } else {
            if (actualLeave.leaveType === "Annual Leave" && showRemainingDays > 0) {
                setDisableRequest(true)
            }
            else if (actualLeave.leaveType === "Annual Leave" && showRemainingDays < 0) {
                setDisableRequest(false)
                toast.error("You have no remaining days!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000
                });
            }
            else {
                setDisableRequest(true)
            }
        }

    }, [actualLeave])
    useEffect(() => {
        if (actualLeave.leaveType === "Annual Leave" && plannedAnnualLeaveInfo.leave.daysRemaining <= 0) {
            toast.error("No remaining day!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    }, [actualLeave])
    return (
        <>
            <Modal isOpen={modalIsOpen} toggle={toggleModal} size='xl' className='font-monospace' style={{ marginTop: "40px" }} backdrop="static" keyboard={false}>
                <ModalHeader toggle={() => toggleModal()}>
                    <div className="m-2">
                        <h4 className="text-primary"><strong>Leave request</strong></h4>
                    </div>
                </ModalHeader>
                <form className="mt-2">
                    <div className='row'>
                        <div className="col mx-3">
                            <div className="form-group">
                                <label htmlFor="itemType">Leave type</label>
                                <select className="form-select" value={actualLeave.leaveType} onChange={(e) => handleChooseLeaveType(e)}>
                                    <option>Choose</option>
                                    {leaveTypes.map((leavetype) => {
                                        return (
                                            <option value={leavetype.leaveName} key={leavetype.leaveName}>{leavetype.leaveName}</option>
                                        )
                                    })}
                                </select>
                                {actualLeave.leaveType === "Annual Leave" && <div className='mt-2'>
                                    <button className='btn btn-sm btn-primary' onClick={toggleLeavePlanModal}>pick from leave plan</button>
                                </div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="startdate">Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="startdate"
                                    disabled={disableStartDate || !actualLeave.leaveType}
                                    placeholder="leave start date"
                                    value={actualLeave.startDate}
                                    required
                                    onChange={(e) => handleChange("startDate", e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="START DATE">End date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="START DATE"
                                    min={actualLeave.startDate}
                                    disabled={disableEndDate}
                                    placeholder="leave end date"
                                    value={actualLeave.endDate}
                                    required
                                    onChange={(e) => handleEndDate("endDate", e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="returndate">Return date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="returndate"
                                    placeholder="retrun date"
                                    min={minEndDate}
                                    disabled={!actualLeave.endDate}
                                    value={actualLeave.returnDate}
                                    required
                                    onChange={(e) => setActualLeave({ ...actualLeave, returnDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col mx-3">
                            <div className="form-floating">
                                <textarea
                                    className="form-control"
                                    placeholder="The purpose of requesting this item"
                                    id="purpose"
                                    style={{ height: "100px", width: "450px" }}
                                    value={actualLeave.leaveReason}
                                    required
                                    onChange={(e) => setActualLeave({ ...actualLeave, leaveReason: e.target.value })}
                                ></textarea>

                                <label htmlFor="purpose">Leave reason</label>
                            </div>
                            <div className="form-group">
                                <label htmlFor="itemName">Acting person</label>
                                <Select
                                    onChange={(e) => setActualLeave({ ...actualLeave, actingPersonCode: e.value })}
                                    options={listOfActingPerson.map((actingPerson) => ({
                                        value: actingPerson.empCode,
                                        label: actingPerson.empNames
                                    }))}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="itemName">Choose supervisor</label>
                                <Select
                                    onChange={(e) => setActualLeave({ ...actualLeave, supervisor: e.value })}
                                    options={listOfSupervisors.map((supervisor) => ({
                                        value: supervisor.empCode,
                                        label: supervisor.empNames
                                    }))}
                                />
                            </div>
                            <div className='d-flex flex-row justify-content-start'>
                                <p className='mt-3'><strong>{showRemainingDays && actualLeave.endDate && actualLeave.leaveType === "Annual Leave" ? 'Days taken' : 'Days entitled'}</strong></p>
                                <p className='mx-5' style={{ fontSize: "2rem" }}><strong>{actualLeave.daysTaken}</strong></p>
                            </div>
                            {showRemainingDays && actualLeave.endDate && actualLeave.leaveType === "Annual Leave" && <div className='d-flex flex-row justify-content-start'>
                                <p className='mt-1'><strong>Eligible days : </strong></p>
                                <p className='mx-5' style={{ fontSize: "1.5rem" }}><strong>{plannedAnnualLeaveInfo.leave.daysEligible + plannedAnnualLeaveInfo.leave.carriedOndays.numberOfDays}</strong></p>
                                <p className='mt-1'><strong>Days remaining : </strong></p>
                                <p className='mx-5' style={{ fontSize: "1.5rem" }}><strong>{showRemainingDays.days}</strong></p>
                            </div>}
                        </div>
                    </div>
                </form>
                <div>
                    {leavePlanModal && (<ChooseLeavePlannedDate modalIsOpen={leavePlanModal}
                        toggleModal={toggleLeavePlanModal}
                        data={plannedAnnualLeaveInfo}
                        pickedPlan={pickedLeavePlan}
                        setPickedPlan={setPickedLeavePlan}
                        choosePlan={choosePlan}
                        chooseDifferentPlan={chooseDifferentPlan}
                    />)}
                </div>
                <div>
                    {showInformation && (<InformationModal modalIsOpen={showInformation}
                        toggleModal={toggleInformationModal}
                        heading="Missing leave plan"
                        message="first pick an annual plan,and wait for the supervisor to approve your plan"

                    />)}
                </div>
                <div>
                    <ToastContainer />
                </div>
                <ModalFooter>
                    <div className='d-flex justify-content-end'>
                        <div className='d-flex flex-row'>
                            <button className='btn btn-light btn-sm mx-4' onClick={toggleModal}>Cancel</button>
                            <button className='btn btn-outline-primary btn-sm mx-3' disabled={disableRequest} onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default RequestLeave;
