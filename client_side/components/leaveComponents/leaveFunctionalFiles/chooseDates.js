import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CalendarView from "./showDatesInCalendar";

const ChooseDates = ({ currentStaff, eligibleDays, carryDays, selectedSupervisor, leaveInfo, setLeaveInfo, remainingDays, setRemainingDays, confirmLeave, daysRemainingFromDB, dataPresent, setPage }) => {
    console.log(dataPresent);
    const [showRemark, setShowRemark] = useState(false);
    const [disableAddDays, setDisableAddDays] = useState(false)
    const [totalEligibleDays, setTotalELigibleDays] = useState(0)
    const [totalRemainingDays, setTotalRemainingDays] = useState(0)
    const [enableAddDays, setEnableAddDays] = useState(false)
    const [showCalendarView, setShowCalendarView] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [disableConfirm, setDisableConfirm] = useState(false)
    const handleChange = (index, field, value) => {
        if (field === "endDate") {
            const checkDate = new Date(value + "T00:00:00");
            if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
                toast.warning("End Date can't be a weekend date!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000
                });
            }
            else {
                const updatedData = [...leaveInfo];
                updatedData[index][field] = value;
                const startDate = new Date(updatedData[index].startDate);
                const endDate = new Date(value);
                const timeDiff = Math.max(Math.ceil(endDate.getTime() - startDate.getTime()));
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                diffDays = diffDays + 1;
                let weekendDays = 0;
                Array.from({ length: diffDays }, (_, i) => {
                    const currentDate = new Date(leaveInfo[index].startDate + "T00:00:00");
                    currentDate.setDate(currentDate.getDate() + i);
                    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                        weekendDays = weekendDays + 1;
                    }
                })
                console.log("days difference from start", diffDays);
                console.log("how many weekend days", weekendDays);
                const remaining = calculateRemainingDays(index, weekendDays, diffDays, totalRemainingDays)
                if (remaining <= 0) {
                    setDisableAddDays(false)
                }
                else {
                    setDisableAddDays(true)
                }
                console.log("remaining days", remaining);
                console.log("difference in days",diffDays);
                console.log("remaining days",remaining);
                console.log("total eligible days",totalEligibleDays);
                if ( remaining >= 0) {
                    setTotalRemainingDays(remaining)
                    setLeaveInfo(updatedData.map((item, i) => (i === index ? { ...item, days: diffDays - weekendDays, name: `leave ${index + 1}` } : item)));
                    setShowRemark(false);
                } else {
                    setShowRemark(true);
                }
            }
        } else {
            if (field === "startDate") {
                const checkDate = new Date(value + "T00:00:00");
                if (checkDate.getDay() === 0 || checkDate.getDay() === 6) {
                    toast.warning("Start Date can't be a weekend date!", {
                        position: toast.POSITION.TOP_LEFT,
                        autoClose: 5000
                    });
                }
                else {
                    const updatedData = [...leaveInfo];
                    updatedData[index][field] = value;
                    updatedData[index].endDate = "";
                    setLeaveInfo(updatedData);
                }
            }
        }
    }

    const handleAddLeave = () => {
        const lastDate = leaveInfo[leaveInfo.length - 1];
        if (lastDate.startDate.trim() !== "" && lastDate.endDate.trim() !== "") {
            setLeaveInfo([...leaveInfo, { startDate: "", endDate: "", days: "", remainingDays: "" }]);
        } else {
            toast.warning("Please fill in data!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    };

    const handleDeleteLeave = (index) => {
        const addDays = totalRemainingDays + leaveInfo[index].days
        setTotalRemainingDays(addDays)
        const leave = leaveInfo.filter((_, i) => i !== index);
        setLeaveInfo(leave);
    };
    const calculateRemainingDays = (index, weekendDays, diffDays) => {
        let pickedDays = 0
        if (dataPresent) {
            pickedDays = totalEligibleDays - daysRemainingFromDB;
        }
        leaveInfo.forEach((leave, i) => {
            if (i !== index) {
                pickedDays += leave.days;
            }
        });
        console.log("picked", pickedDays);
        const rem = totalEligibleDays + weekendDays - (pickedDays + diffDays);
        return rem;
    };
    const toggleCalendarView = () => {
        setShowCalendarView(!showCalendarView)
    }
    const showCalendar = (e) => {
        e.preventDefault()
        if (leaveInfo[0].startDate === "" && leaveInfo[0].endDate === "") {
            toast.success("select dates before !", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        } else {
            setShowCalendarView(true)
        }
    }

    useEffect(() => {
        const lastInfo = leaveInfo[leaveInfo.length - 1];
        console.log(lastInfo);
        if (leaveInfo.length >= 1) {
            if (leaveInfo[0].startDate !== "" && leaveInfo[0].endDate !== "") {
                setShowConfirm(true)
            }
            else {
                setShowConfirm(false)
            }
        }

        if (lastInfo.startDate === "" && lastInfo.endDate === "") {
            setDisableConfirm(true)
        }
        else if (lastInfo.startDate !== "" && lastInfo.endDate === "") {
            setDisableConfirm(true)
        }
        else {
            if (lastInfo.startDate !== "" && lastInfo.endDate !== "") {
                setDisableConfirm(false)
            }
        }
    }, [leaveInfo])
    useEffect(() => {
        const lastInfo = leaveInfo[leaveInfo.length - 1];
        if (leaveInfo.length >= 1) {
            if (lastInfo.startDate !== "" && lastInfo.endDate !== "") {
                setEnableAddDays(false)
            }
            else {
                setEnableAddDays(true)
            }
        }
        console.log("enabled ", enableAddDays);

    }, [leaveInfo])
    useEffect(() => {
        if (dataPresent === true) {
            let carry = Number(carryDays);
            let elDays = Number(eligibleDays)
            let newEligibleDays = carry + elDays
            setTotalELigibleDays(newEligibleDays)
            setTotalRemainingDays(Number(remainingDays))
        }
        else {
            let carry = Number(carryDays);
            let elDays = Number(eligibleDays)
            let remDays = Number(remainingDays)
            let newRemainingDays = carry + remDays
            let newEligibleDays = carry + elDays
            setTotalELigibleDays(newEligibleDays)
            setTotalRemainingDays(newRemainingDays)
        }
    }, [])

    return (
        <>
            <div className="">
                {showRemark && <div className="alert alert-danger">
                    <p>Days exceeding allowed days</p>
                </div>}
                {!showCalendarView &&
                    <div>
                        <table className="table table-borderless">
                            <thead>
                                <tr className="table-primary">
                                    <td>staff information</td>
                                    <td>
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-sm btn-primary" onClick={showCalendar}>Calendar view</button>
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                        </table>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>Staff names:</td>
                                    <td>{currentStaff.empNames}</td>
                                </tr>
                                <tr>
                                    <td>supervisor</td>
                                    <td>{selectedSupervisor}</td>
                                </tr>
                                <tr>
                                    <td>Eligible days:</td>
                                    <td>{totalEligibleDays}</td>
                                </tr>
                                <tr className="table-danger">
                                    <td>Remaining days:</td>
                                    <td><strong>{totalRemainingDays}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table table-borderless">
                            <thead>
                                <tr className="table-primary">
                                    <td>pick leave dates</td>
                                </tr>
                            </thead>
                        </table>
                        <table className="table table-borderless">
                            <thead>
                                <td>No.</td>
                                <td>Start date</td>
                                <td>End date</td>
                                <td></td>
                            </thead>
                            <tbody>
                                {leaveInfo.map((leave, index) => (
                                    <tr key={index} >
                                        <td>{index + 1}</td>

                                        <td>
                                            <div className="form-group">
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    min={index > 0 ? leaveInfo[index - 1].endDate : new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]}
                                                    value={leave.startDate}
                                                    onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="form-group">
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    min={leave.startDate}
                                                    value={leave.endDate}
                                                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            {leaveInfo.length - 1 === index ? (
                                                disableAddDays && <button
                                                    disabled={showRemark || enableAddDays}
                                                    className='btn btn-primary btn-sm mx-1'
                                                    onClick={() => handleAddLeave()}
                                                >
                                                    <span className='mx-2'>Add another round</span>
                                                </button>
                                            ) : (
                                                <button
                                                    className='btn btn-danger btn-sm mx-1'
                                                    onClick={() => handleDeleteLeave(index)}
                                                >
                                                    <span className="">DELETE</span>
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end">
                            {showConfirm && <button className="btn btn-primary mx-2 my-2" disabled={disableConfirm || showRemark} onClick={confirmLeave}>Confirm</button>}
                        </div>
                    </div>}
                {showCalendarView &&
                    <div className="m-2">
                        <CalendarView
                            toggleCalendarView={toggleCalendarView}
                            setLeaveInfo={setLeaveInfo}
                            leaveInfo={leaveInfo} />
                    </div>
                }
                <div>
                    <ToastContainer />
                </div>
            </div >
        </>
    );
};


export default ChooseDates;