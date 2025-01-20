import { useState, useEffect } from "react";
import axios from "axios";
import ChooseDays from "../leaveFunctionalFiles/choosedays";
import PickSupervisor from "../leaveFunctionalFiles/pickSupervisor";
import { isAuth } from "../../../helpers/authToken";
import Layout from "../../Layout";
import ChooseDates from "../leaveFunctionalFiles/chooseDates";
import { ToastContainer, toast } from "react-toastify";
import { API } from "../../../config";
import withLeave from "../../../pages/leave/withLeave";
import 'react-toastify/dist/ReactToastify.css';


const AnnualLeavePlanning = ({ token, setPage }) => {
    const [step, setStep] = useState(1)
    const [currentStaff, setCurrentStaff] = useState({});
    const [yearsOfWork, setYearsOfWork] = useState('')
    const [eligibleDays, setEligibleDays] = useState(0)
    const [carryDays, setCarryDays] = useState(0)
    const [supervisorValidated, setSupervisorValidated] = useState(false)
    const [allowNext, setAllowNext] = useState(false)
    const [isEligibleDaysAvailable, setIsEligibleDaysAvailable] = useState(true)
    const [currentStaffLeaveInfo, setCurrentStaffLeaveInfo] = useState()
    const [dataPresent, setDataPresent] = useState(false)
    const [reason, setReason] = useState("")
    const [staffResponse, setStaffResponse] = useState()
    const [noRemainingDays, setNoRemainingDays] = useState(false)
    const [selectedSupervisor, setSelectedSupervisor] = useState("")
    const [showNext, setShowNext] = useState(false)
    const [daysRemainingFromDB, setDaysRemainingFromDB] = useState(0)
    const [selectedSupervisorName, setSelectedSupervisorName] = useState("")
    const [leaveInfo, setLeaveInfo] = useState([
        {
            name: "",
            startDate: "",
            endDate: "",
            days: 0,
        }
    ]);
    const [remainingDays, setRemainingDays] = useState(0)
    const nextStep = () => {
        setStep(step + 1);
    };
    const prevStep = () => {
        setStep(step - 1);
    };
    const getStaff = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
            setCurrentStaff(response.data.staffProfile);
            const stuffLeaveResponse = await axios.get(`${API}/leave/getleaveinfo/${response.data.staffProfile._id}`, config);
            preProcessingOfData(stuffLeaveResponse)
        } catch (error) {
            console.log(error);
        }
    };
    const handleYearsOfWorking = (permittedDays) => {
        if (permittedDays >= 0 && permittedDays < 9) {
            setYearsOfWork(1);
        } else if (permittedDays >= 9 && permittedDays <= 18) {
            setYearsOfWork(2);
        } else {
            setYearsOfWork(3);
        }
    }
    const preProcessingOfData = (stuffLeaveResponse) => {
        if (stuffLeaveResponse.data.dataPresent === true) {
            setSelectedSupervisor(stuffLeaveResponse.data.supervisorCode)
            setSelectedSupervisorName(stuffLeaveResponse.data.superVisorName)
            setCurrentStaffLeaveInfo(stuffLeaveResponse.data.leave)
            setEligibleDays(stuffLeaveResponse.data.leave.daysEligible)
            setSupervisorValidated(stuffLeaveResponse.data.leave.supervisorValidated)
            console.log(stuffLeaveResponse.data.leave.supervisorValidated);
            handleYearsOfWorking(stuffLeaveResponse.data.leave.daysEligible)
            setCarryDays(stuffLeaveResponse.data.leave.carriedOndays.numberOfDays)
            setYearsOfWork(stuffLeaveResponse.data.leave.yearsOfService)
            setCarryDays(stuffLeaveResponse.data.leave.carriedOndays.numberOfDays)
            setReason(stuffLeaveResponse.data.leave.carriedOndays.Reason)
            setDataPresent(true)
            let daysTaken = 0;
            stuffLeaveResponse.data.leave.plannedDates.forEach((leave, i) => {
                daysTaken += leave.daysPlanned;
            });
            const remaining = (stuffLeaveResponse.data.leave.daysEligible + stuffLeaveResponse.data.leave.carriedOndays.numberOfDays) - daysTaken
            setRemainingDays(remaining)
            setDaysRemainingFromDB(remaining)
            if (remaining === 0) {
                setNoRemainingDays(true)
            }
            else {
                setNoRemainingDays(false)
            }
            if (stuffLeaveResponse.data.superVisorName !== "") {
                setShowNext(true)
            }
            else {
                setShowNext(false)
            }
        }
        else {
            setDataPresent(false)
        }
    }
    const handleUpdateLeavePlan = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.put(`${API}/leave/updateannualplan/${currentStaffLeaveInfo._id}`, leaveInfo, config)
            toast.success("Successfully saved leave!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 10000
            });
            setStep(1)
            setLeaveInfo(
                {
                    name: "",
                    startDate: "",
                    endDate: "",
                    days: 0,
                });
        } catch (error) {
            toast.warning("Failed!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 10000
            });
        }
    }
    const handleConfirm = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        const data = {
            staff: {
                empCode: currentStaff.empCode,
                emp_id: currentStaff._id
            },
            yearsOfWork,
            eligibleDays,
            selectedSupervisor,
            leaveInfo,
            carryDays,
            reason
        }
        try {
            const response = await axios.post(`${API}/leave/addannualplan`, data, config)
            toast.success("Successfully saved leave!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 10000
            });
            setStep(1)
            setLeaveInfo([
                {
                    name: "",
                    startDate: "",
                    endDate: "",
                    days: 0,
                }]);
        } catch (error) {
            toast.warning("Failed!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 10000
            });
        }
    }

    const AddAnualLeave = (e) => {
        e.preventDefault()
        if (!dataPresent) {
            handleConfirm()
        }
        else {
            handleUpdateLeavePlan()
        }
    }

    const handleNext = (e) => {
        e.preventDefault();
        if (eligibleDays !== "") {
            nextStep();
        }
    }

    useEffect(() => {
        getStaff();
    }, [step === 1]);
    return (
        <Layout>
            <div className="card shadow mx-5 mt-5 font-monospace" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="card-header bg-primary m-0 p-0">
                    <div className="d-flex justify-content-center ">
                        {step === 1 && <p className="text-white m-0 p-0" style={{ fontSize: "1.3em" }}>STAFF DETAILS</p>}
                        {step == 2 && <p className="text-white m-0 p-0" style={{ fontSize: "1.3em" }}>CHOOSE SUPERVISOR</p>}
                        {step === 3 && <p className="text-white m-0 p-0" style={{ fontSize: "1.em" }}>PLAN</p>}
                    </div>
                </div>
                <div className="mt-3">
                    {step === 1 && <ChooseDays
                        currentStaff={currentStaff} nextStep={nextStep}
                        yearsOfWork={yearsOfWork} dataPresent={dataPresent}
                        noRemainingDays={noRemainingDays} setCarryDays={setCarryDays}
                        setRemainingDays={setRemainingDays} carryDays={carryDays}
                        setIsEligibleDaysAvailable={setIsEligibleDaysAvailable} isEligibleDaysAvailable={isEligibleDaysAvailable}
                        reason={reason} setReason={setReason}
                        setYearsOfWork={setYearsOfWork} eligibleDays={eligibleDays}
                        setEligibleDays={setEligibleDays} />}
                    {step === 2 && <PickSupervisor
                        currentStaff={currentStaff} nextStep={nextStep} prevStep={prevStep}
                        eligibleDays={eligibleDays} token={token} step={step}
                        showNext={showNext} setShowNext={setShowNext}
                        selectedSupervisorName={selectedSupervisorName} carryDays={carryDays}
                        dataPresent={dataPresent} selectedSupervisor={selectedSupervisor} setSelectedSupervisorName={setSelectedSupervisorName}
                        setSelectedSupervisor={setSelectedSupervisor} />}
                    {step === 3 && <ChooseDates
                        currentStaff={currentStaff} nextStep={nextStep} prevStep={prevStep}
                        eligibleDays={eligibleDays} token={token} dataPresent={dataPresent} carryDays={carryDays}
                        selectedSupervisor={selectedSupervisorName} leaveInfo={leaveInfo} setPage={setPage} setStep={setStep}
                        setLeaveInfo={setLeaveInfo} remainingDays={remainingDays} setRemainingDays={setRemainingDays}
                        confirmLeave={AddAnualLeave} daysRemainingFromDB={daysRemainingFromDB}
                    />}
                </div>
                <div>
                    <ToastContainer />
                </div>
                <div className="card-footer">
                    <div className="row">
                        <div className="col-6">
                            {(step === 2 || step === 3) && <div className="d-flex justify-content-start">
                                <button className="btn btn-primary btn-sm mx-1" onClick={prevStep}>PREVIOUS </button>
                            </div>}
                        </div>
                        <div className="col-6">
                            {(step === 2 && showNext || step === 1) && <div className="d-flex justify-content-end">
                                <button className="btn btn-primary btn-sm mx-2" disabled={noRemainingDays || isEligibleDaysAvailable || supervisorValidated} onClick={handleNext}>NEXT </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}


export default withLeave(AnnualLeavePlanning)