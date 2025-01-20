import { useState, useEffect, useRef } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import { formatTextDateInput } from "../../../helpers/dateHelper";
import UpdateActualLeaveModal from "../Modals/updateActualLeaveModal";
import ActualLeaveDelete from "../Modals/actualLeaveDeleteModal";
import StaffReviewedRequest from "../leaveFunctionalFiles/staffReviewedDetailsInfo";
import {
    EllipsisOutlined,
    EditOutlined,
    WarningTwoTone,
    DeleteOutlined,
    SearchOutlined
} from "@ant-design/icons";

const PendingLeaveRequestInfo = ({ token }) => {
    const [data, setData] = useState([])
    const [leaveId, setLeaveId] = useState()
    const [leaveData, setLeaveData] = useState([])
    const [dataPresent, setDataPresent] = useState(false)
    const [currentStaff, setCurrentStaff] = useState();
    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState("Pending");
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showLeaveDetails, setShowLeaveDetails] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [updateData, setUpdateData] = useState({
        leaveid: "",
        index: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        returnDate: "",
        daysTaken: "",
        actingPerson: {
            names: "",
            empCode: ""
        },
        supervisor: {
            names: "",
            empCode: ""
        },
        fileLocation: "",

    })
    const [deleteInfo, setDeleteInfo] = useState({
        leaveid: "",
        actualLeaveId:"",
    })
    const toggleUpdateModal = () => {
        setShowUpdateModal(!showUpdateModal)
    }
    const toggleDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal)
    }
    const initiateDeleteLeaveModal = (actualLeaveIndex) => {
        console.log(actualLeaveIndex);
        
        setDeleteInfo({
            leaveid: leaveId,
            actualLeaveId: actualLeaveIndex
        })
        setShowDeleteModal(true)
    }
    const initiateUpdateLeaveModal = (leave, actualLeaveIndex) => {
        setUpdateData({
            index: actualLeaveIndex,
            leaveid: leaveId,
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            returnDate: leave.returnDate,
            daysTaken: leave.daysTaken,
            supervisor: {
                empCode: leave.supervisorApproval.supervisor.empCode,
                names: leave.supervisorApproval.supervisor.names
            },
            actingPerson: {
                empCode: leave.actingPerson.empCode,
                names: leave.actingPerson.names
            },
            // fileLocation: leave.content.url
        })
        setShowUpdateModal(!showUpdateModal)
    }
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const staffInfo = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
            setCurrentStaff(staffInfo.data.staffProfile)
            const response = await axios.get(`${API}/leave/actualleave/getleaveinfo/${staffInfo.data.staffProfile._id}`, config);
            // console.log(response.data);
            setLeaveId(response.data.leave._id)
            const pendingData = [];
            let count = 0
            setLeaveData(response.data)
            for (let i = 0; i < response.data.leave.actualLeaves.length; i++) {
                const leave = response.data.leave.actualLeaves[i];
                const supervisorStatus = leave.supervisorApproval?.requestStatus;
                const lineManagerStatus = leave.lineManagerApproval?.requestStatus;
                const hrManagerStatus = leave.hrManagerApproval?.requestStatus;
                if (
                    !(supervisorStatus === "APPROVED")
                ) {
                    count++;
                    pendingData.push(response.data.leave.actualLeaves[i])
                }
            }
            setData(pendingData);
            if (count > 0 && response.data.dataPresent) {
                setDataPresent(true)
            }
            else {
                setDataPresent(false)
            }
        } catch (error) {
            toast.success("No leave available !", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 2000
            });
            // console.error(error);
        }
    };

    const updateHandler = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            axios.post(`${API}/leave/actualleave/updateleave`, updateData, config)
                .then(() => {

                })
            toast.success("successfully updated!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });

        } catch (error) {
            // console.log(error)
            toast.warning("Failure!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    }

    useEffect(() => {
        fetchData()
    }, [showUpdateModal, showDeleteModal,showLeaveDetails])

    const filteredData = data.filter(searchedLeave => searchedLeave.leaveType.toLowerCase().startsWith(search.toLowerCase()));
    return (
        <>
            <div className="font-monospace mt-4" style={{ width: "110%" }}>
                <p><strong> All Requests</strong></p>
                <div className="card rounded-3 shadow-sm">
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td className="d-flex justify-content-center">{activeTab === "Approved" ? <p>Approved leave request</p> : <p>Pending leave request</p>}</td>
                            </tr>
                        </thead>
                    </table>
                    <div className="mb-1">
                        <ul className="nav nav-pills" style={{ width: '100%', cursor: "pointer" }}>
                            <li
                                className={`nav-link text-dark ${activeTab === 'Pending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Pending')}
                                style={{
                                    width: '50%',
                                    textAlign: 'center',
                                    borderBottom: activeTab === 'Pending' ? '2px solid blue' : 'none',
                                    borderRadius: 0,
                                    backgroundColor: activeTab === 'Pending' ? '#ffffff' : '',
                                }}
                            >
                                Pending Leave Requests
                            </li>
                            <li
                                className={`nav-link text-dark ${activeTab === 'Approved' ? 'active' : ''}`}
                                onClick={() => setActiveTab('Approved')}
                                style={{
                                    width: '50%',
                                    textAlign: 'center',
                                    borderBottom: activeTab === 'Approved' ? '2px solid blue' : 'none',
                                    borderRadius: 0,
                                    backgroundColor: activeTab === 'Approved' ? '#ffffff' : '',
                                }}
                            >
                                Approved Leave Requests
                            </li>
                        </ul>
                    </div>
                    {activeTab === "Pending" ?  <div className="mx-1 mt-2">
                       {dataPresent&& <div className="d-flex justify-content-end">
                            <div className="mx-2 mt-2 mb-2">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><SearchOutlined /></span>
                                    </div>
                                    <input type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="form-control" placeholder="Search..." />
                                </div>
                            </div>
                        </div>}
                        <div style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
                            {dataPresent ? <table className="table mt-3" >
                                <thead>
                                    <tr className="table-primary">
                                        <th>NO.</th>
                                        <th>Leave type</th>
                                        <th>Start date</th>
                                        <th>End date</th>
                                        <th>Return date</th>
                                        <th>Acting person</th>
                                        <th>Supervisor</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {filteredData.map((actualLeave, index) => {
                                        return (
                                            <tr key={actualLeave._id}>
                                                <td>{index + 1}</td> 
                                                <td>{actualLeave.leaveType}</td>
                                                <td>{formatTextDateInput(actualLeave.startDate)}</td>
                                                <td>{formatTextDateInput(actualLeave.endDate)}</td>
                                                <td>{formatTextDateInput(actualLeave.returnDate)}</td>
                                                <td>{actualLeave.actingPerson.names}</td>
                                                <td>{actualLeave.supervisorApproval.supervisor.names}</td>
                                                <td >
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            role="button"
                                                            size="sm"
                                                            color=""
                                                            onClick={(e) => e.preventDefault()}
                                                        >
                                                            <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" end>
                                                            <DropdownItem
                                                                onClick={() => initiateUpdateLeaveModal(actualLeave, index)}
                                                            >
                                                                <div className='d-flex flex-row'>
                                                                    <EditOutlined />
                                                                    <p className='mx-3 my-0 py-0 text-muted'>Update</p>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => initiateDeleteLeaveModal(actualLeave._id)}
                                                            >
                                                                <div className='d-flex flex-row'>
                                                                    <DeleteOutlined />
                                                                    <p className='mx-3 my-0 py-0 text-muted'>Delete</p>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table> : (<div>
                                <div className="d-flex justify-content-center mt-5">
                                    <div className="d-flex flex-column">
                                        <WarningTwoTone style={{ fontSize: "7rem" }} />
                                        <p style={{ fontSize: '2rem' }} className="mt-3">No leave requests</p>
                                    </div>
                                </div>
                            </div>)
                            }
                        </div>
                    </div>: <StaffReviewedRequest leaveData={leaveData} leaveId={leaveId} token={token} showLeaveDetails={showLeaveDetails} setShowLeaveDetails={setShowLeaveDetails}/>}
                </div>
                <div>
                    {showUpdateModal && <UpdateActualLeaveModal
                        modalIsOpen={showUpdateModal}
                        toggleModal={toggleUpdateModal}
                        data={updateData}
                        token={token}
                        setData={setUpdateData}
                        currentStaffInfo={currentStaff}
                        updateHandler={updateHandler}

                    />}
                </div>
                <div>
                    {showDeleteModal && <ActualLeaveDelete
                        modalIsOpen={showDeleteModal}
                        toggleModal={toggleDeleteModal}
                        info={deleteInfo}
                        token={token}
                    />}
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>

        </>
    )
}

export default PendingLeaveRequestInfo;
