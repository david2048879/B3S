import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../../config";
import withLeave from "../../../pages/leave/withLeave";
import Select from "react-select";
import 'react-toastify/dist/ReactToastify.css';

const PickSupervisor = ({ currentStaff, eligibleDays,carryDays, step, setShowNext, selectedSupervisor, selectedSupervisorName, dataPresent, setSelectedSupervisor, token,setSelectedSupervisorName }) => {
    const [supervisors, setSupervisors] = useState([])
    const findSupervisor = async () => {
        try {
            const response = await axios.get(
                `${API}/leave/getsupervisors`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSupervisors(response.data)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSelectSupervisor = (e) => {
        const value = e.value;
        setSelectedSupervisorName(e.label)
        setSelectedSupervisor(value)
        if (value !== "") {
            setShowNext(true)
        }
        else {
            setShowNext(false)
        }
    }

    useEffect(() => {
        findSupervisor();
    }, [])
    useEffect(() => {
        if (selectedSupervisor !== "") {
            setShowNext(true)
        }
        else {
            setShowNext(false)
        }
    }, [selectedSupervisor])

    useEffect(() => {
        if (dataPresent) {
            setShowNext(true)
        }
        else {
            setShowNext(false)
        }
    }, [step])

    return (
        <>
            <div className="">
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
                            <td>Pick a supervisor</td>
                            {!dataPresent ? (<td>
                                <Select
                                    onChange={(e) => handleSelectSupervisor(e)}
                                    //value={selectedSupervisor}
                                    options={supervisors.map((supervisor) => ({
                                        value: supervisor.empCode,
                                        label: supervisor.empNames
                                    }))}
                                />
                            </td>) : (
                                <td>{selectedSupervisorName}</td>
                            )}
                        </tr>
                        <tr>
                            <td>Location:</td>
                            <td>{currentStaff.currentAppointment.location}</td>
                        </tr>
                        <tr>
                            <td>Department:</td>
                            <td>{currentStaff.currentAppointment.department}</td>
                        </tr>
                        <tr>
                            <td>Eligible days:</td>
                            <td>{eligibleDays}</td>
                        </tr>
                        <tr>
                            <td>Carry over days:</td>
                            <td>{carryDays}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </>
    );
};


export default withLeave(PickSupervisor);