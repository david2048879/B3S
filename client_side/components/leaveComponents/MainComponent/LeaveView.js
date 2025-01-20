import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import withLeave from "../../../pages/leave/withLeave";
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import 'react-toastify/dist/ReactToastify.css';
import LeaveDates from "../leaveFunctionalFiles/leaveDates";
import {
    WarningTwoTone
} from "@ant-design/icons";

const LeaveView = ({ token }) => {
    const [data, setData] = useState()
    const [supervisorName, setSupervisorName] = useState()
    const [viewDates, setViewDates] = useState(false)
    const [remainingDays, setRemainingDays] = useState(0)
    const [daysTaken, setDaysTaken] = useState(0)
    const [carriedOnDays, setCarriedOnDays] = useState(0)
    const [deleteModal, setDeleteModal] = useState(false)
    const [dataPresent, setDataPresent] = useState(false)
    const [updateModal, setUpdateModal] = useState(false)
    const [viewCalendar, setViewCalendar] = useState(false);
    const [employeeId, setEmployeeId] = useState("")
    const toggleViewDates = () => {
        setViewDates(!viewDates)
    }
    const toggleViewCalendar = () => {
        setViewCalendar(!viewCalendar)
    }
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.get(`${API}/leave/getleaveinfo/${employeeId}`, config);
            setData(response.data.leave)
            setDataPresent(response.data.dataPresent)
            setSupervisorName(response.data.superVisorName)
            if (response.data.dataPresent) {
                let daysTaken = 0;
                response.data.leave.plannedDates.forEach((leave, i) => {
                    daysTaken += leave.daysPlanned;
                });
                const remaining = (response.data.leave.daysEligible + response.data.leave.carriedOndays.numberOfDays) - daysTaken
                setRemainingDays(remaining)
                setDaysTaken(daysTaken)
                setCarriedOnDays(response.data.leave.carriedOndays.numberOfDays)
            }
            if (response.data.dataPresent === false) {
                toast.error("No available data", {
                    position: toast.POSITION.TOP_LEFT, autoClose: 10000
                });
            }
        } catch (error) {
            console.log(error)
        }
    }, [employeeId, updateModal, deleteModal])
    const getStaff = async () => {
        try {
            const response = await axios.get(
                `${API}/staff_email/${isAuth().email}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEmployeeId(response.data.staffProfile._id)
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getStaff();
    }, []);
    return (
        <>
            <div className="mx-0 mt-5 font-monospace">
                <p><strong> Annual Leave </strong></p>
                <div className="card rounded-3 shadow-sm">

                    <table className="table table-borderless" >
                        <thead>
                            <tr hclassName="table-primary">
                                <th>User Annual Leave plan information</th>
                            </tr>
                        </thead>
                    </table>
                    {!viewDates && <div className="" style={{ height: "410px" }}>
                        {dataPresent ? <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>Plan year :</td>
                                    <td>{data.planYear} </td>
                                </tr>
                                <tr>
                                    <td>Years of service :</td>
                                    <td>{data.yearsOfService}</td>
                                </tr>
                                <tr>
                                    <td>Annual days taken:</td>
                                    <td>{daysTaken} day(s)</td>
                                </tr>
                                <tr>
                                    <td>Annual days remaining:</td>
                                    <td>{remainingDays} day(s)</td>
                                </tr>
                                {carriedOnDays > 0 && <tr>
                                    <td>Carried on days:</td>
                                    <td>{carriedOnDays} day(s)</td>
                                </tr>}
                                <tr>
                                    <td>Supervisor name:</td>
                                    <td>{supervisorName}</td>
                                </tr>
                                <tr>
                                    <td>Supervisor validation:</td>
                                    <td>
                                        {data.supervisorValidated ?
                                            <button className="btn btn-outline-success btn-sm">Approved by the supervisor</button>
                                            : <button className="btn btn-outline-danger btn-sm">not yet approved</button>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table> :
                            (<div>
                                <div className="d-flex justify-content-center mt-5">
                                    <div className="d-flex flex-column">
                                        <WarningTwoTone style={{ fontSize: "7rem" }} />
                                        <p style={{ fontSize: '2rem' }} className="mt-3">No available data</p>
                                    </div>
                                </div>
                            </div>)
                        }
                    </div>}
                    {viewDates && <LeaveDates data={data} viewCalendar={viewCalendar}
                        setViewCalendar={setViewCalendar}
                        token={token} deleteModal={deleteModal} setDeleteModal={setDeleteModal}
                        updateModal={updateModal} setUpdateModal={setUpdateModal}
                        toggleViewCalendar={toggleViewCalendar} />}
                    <div className="card-footer">
                        <div className="row">
                            <div className="col-6">
                                {data && <button className="btn btn-sm btn-outline-primary" onClick={toggleViewDates}>
                                    {viewDates ? <span>View general information</span> : <span>View picked plan dates</span>}
                                </button>}
                            </div>
                            {viewDates && <div className="col-6">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-outline-primary btn-sm" onClick={toggleViewCalendar}>
                                        {!viewCalendar ? <span>View planned dates in calendar</span> : <span>Tabular view</span>}
                                    </button>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>
        </>
    )
}

export default withLeave(LeaveView);
