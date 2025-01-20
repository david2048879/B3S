import { useState, useEffect } from "react";

const ChooseDays = ({ currentStaff, yearsOfWork, reason, setReason, carryDays, setCarryDays, setIsEligibleDaysAvailable, setYearsOfWork, setRemainingDays, eligibleDays, setEligibleDays, noRemainingDays, dataPresent }) => {
    const [showNext, setShowNext] = useState(false)
    const pickYears = (e) => {
        const value = e.target.value;
        setYearsOfWork(value)
        if (value === "") {
            setShowNext(false)
        }
        else {
            if (value >= 0) {
                if (value >= 0 && value < 1) {
                    setEligibleDays(9);
                    setRemainingDays(9)
                } else if (value >= 1 && value <= 3) {
                    setEligibleDays(18);
                    setRemainingDays(18)
                } 
                else if (value >= 3 && value <= 6) {
                    setEligibleDays(19);
                    setRemainingDays(19)
                }
                else if (value >= 6 && value <= 9) {
                    setEligibleDays(20);
                    setRemainingDays(20)
                }
                else {
                    setEligibleDays(21);
                    setRemainingDays(21)
                }
                setShowNext(true)
            }
        }
    }
    const handleCarryOverDays = (e) => {
        const value = e.target.value
        setCarryDays(value)
    }
    useEffect(() => {
            if (eligibleDays === 0) {
                setIsEligibleDaysAvailable(true)
            }
            else {
                if (carryDays > 0) {
                    if (reason !== "") {
                        setIsEligibleDaysAvailable(false)
                    }
                    else {
                        setIsEligibleDaysAvailable(true)
                    }
                }
                else {
                    setIsEligibleDaysAvailable(false)
                }
            }
    }, [eligibleDays, carryDays, reason])

    return (
        <>
            <div className="">
                {noRemainingDays && <div className="alert alert-danger">
                    <p>There is no remaining days</p>
                </div>}
                <table className="table table-borderless">
                    <thead>
                        <tr className="table-primary">
                            <td>staff information</td>
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
                            <td>Staff email :</td>
                            <td>{currentStaff.email}</td>
                        </tr>
                        <tr>
                            <td>Staff code:</td>
                            <td>{currentStaff.empCode}</td>
                        </tr>
                        <tr>
                            <td>years spent in Urwegobank:</td>
                            {!dataPresent ? (
                                <td>
                                    <input
                                        type="number"
                                        value={yearsOfWork}
                                        onChange={pickYears}
                                        min={0}
                                        className="form-control"
                                    />
                                </td>
                            ) : (
                                <td> {yearsOfWork}</td>
                            )}
                        </tr>
                        {!dataPresent && yearsOfWork && <tr>
                            <td>Carry over days:</td>
                            <td>
                                <input
                                    type="number"
                                    max={Number(eligibleDays)}
                                    value={carryDays}
                                    onChange={handleCarryOverDays}
                                    min={0}
                                    disabled={true}
                                    className="form-control"
                                />
                                <small id="inputHelp" className="form-text text-muted">Forgery will result into penalty,be careful.</small>
                            </td>
                        </tr>}
                        {showNext && (<tr>
                            <td>Eligible days</td>
                            <td>{Number(eligibleDays) + Number(carryDays)}</td>
                        </tr>)}
                        {!dataPresent && yearsOfWork && (Number(carryDays) > 0) && <tr>
                            <td>Comment : </td>
                            <td>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="form-control"
                                />
                            </td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
};


export default ChooseDays;