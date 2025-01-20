import { useState, useEffect, useRef } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ChooseSearchType from "../Modals/chooseSearchTypeModal";
import 'react-toastify/dist/ReactToastify.css';
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import { formatTextDateInput } from "../../../helpers/dateHelper";
import ActualLeaveRequestDetails from "../Modals/actualLeaveRequestInformationdashboardModal";
import HRManagerReviewRequest from "../Modals/actualLeaveHRManagerReviewRequest";;
import HumanResourceReviewedRequest from "../leaveFunctionalFiles/HumanResourceReviewedRequest";
import {
    EllipsisOutlined,
    WarningTwoTone,
    DeleteOutlined,
    SearchOutlined,
    FormOutlined
} from "@ant-design/icons";

const HRManagerPendingRequest = ({ token }) => {
    const [data, setData] = useState([])
    const [leaveData, setLeaveData] = useState([])
    const [currentStaff, setCurrentStaff] = useState();
    const [search, setSearch] = useState("")
    const [showSearchType, setShowSearchType] = useState(false)
    const [searchType, setSearchType] = useState({
        name: "Staff name",
        codeName: "empNames",
        role: "lineManager"
    })
    const [dataPresent, setDataPresent] = useState(false)
    const [activeTab, setActiveTab] = useState("Pending");
    const [showApproveRequestModal, setShowApproveRequestModal] = useState(false)
    const [showLeaveDetails, setShowLeaveDetails] = useState(false)
    const [approveData, setApproveData] = useState({
        leaveId: "",
        actualLeaveId: "",
        leaveType: "",
        startDate: "",
        endDate: "",
        returnDate: "",
        daysTaken: "",
        status: "",
        actingPerson: {
            names: "",
            empCode: ""
        },
        staff: {
            names: "",
            empCode: ""
        },
        comment: ""
    })
    const [leaveDetails, setLeaveDetails] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        department: "",
        returnDate: "",
        daysTaken: "",
        managerRequestDate: "",
        staff: "",
        supervisorrequestdate: "",
        supervisor: ""
    })
    const toggleApproveModal = () => {
        setShowApproveRequestModal(!showApproveRequestModal)
    }
    const toggleSearchType = () => {
        setShowSearchType(!showSearchType)
    }
    const toggleShowLeaveDetails = () => {
        setShowLeaveDetails(!showLeaveDetails)
    }
    const initiateShowLeaveDetails = (leave) => {
        setLeaveDetails({
            leaveType: leave.actualLeave.leaveType,
            startDate: leave.actualLeave.startDate,
            endDate: leave.actualLeave.endDate,
            returnDate: leave.actualLeave.returnDate,
            daysTaken: leave.actualLeave.daysTaken,
            managerRequestDate: leave.actualLeave.managerRequestDate,
            staff: leave.leaveInfo.staff.empNames,
            department: leave.leaveInfo.staff.department,
            supervisorrequestdate: leave.actualLeave.supervisorRequestDate,
            supervisor: leave.actualLeave.supervisorApproval.supervisor.names
        });
        setShowLeaveDetails(true);
    };
    const initiateUpdateLeaveModal = (leave, actualLeaveIndex) => {
        setApproveData({
            leaveId: leave.leaveInfo.leaveid,
            actualLeaveId: leave.actualLeave._id,
            leaveType: leave.actualLeave.leaveType,
            startDate: leave.actualLeave.startDate,
            endDate: leave.actualLeave.endDate,
            returnDate: leave.actualLeave.returnDate,
            daysTaken: leave.actualLeave.daysTaken,
            actingPerson: {
                names: leave.actualLeave.actingPerson.names,
                empCode: leave.actualLeave.actingPerson.empCode
            },
            staff: {
                names: leave.leaveInfo.staff.empNames,
                empCode: leave.leaveInfo.staff.empCode
            }

        })
        setShowApproveRequestModal(!showApproveRequestModal)
    }
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const staffInfo = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
            setCurrentStaff(staffInfo.data.staffProfile)
            const response = await axios.get(`${API}/leave/actualleave/hrmanager/getrequests/${staffInfo.data.staffProfile.empCode}`, config);
            setLeaveData(response.data)
            const pendingData = [];
            let count = 0
            if(response.data.dataPresent){
            for (let i = 0; i < response.data.leave.length; i++) {
                const currentLeaveInformation = response.data.leave[i]
                if (currentLeaveInformation.actualLeave.hrManagerApproval.requestStatus === "PENDING") {
                    count++
                    pendingData.push(currentLeaveInformation)
                }
            }
            setData(pendingData);
            if (count > 0 && response.data.dataPresent) {
                setDataPresent(true)
            }
            else {
                setDataPresent(false)
            }
        }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReview = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axios.put(`${API}/leave/actualleave/hrmanager/review`, approveData, config)
            toast.success("successfully reviewed!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
            toggleApproveModal()
        } catch (error) {
            console.log(error)
            toast.error("Failure!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    }

    useEffect(() => {
        fetchData()
    }, [showApproveRequestModal, showLeaveDetails])

    const filteredData = data.filter(searchedLeave => {
        let nestedValue;
        if (searchType.codeName === "empNames" || searchType.codeName === "department") {
            nestedValue = searchedLeave.leaveInfo.staff[searchType.codeName];
        }
        else if (searchType.codeName === "leaveType") {
            nestedValue = searchedLeave.actualLeave[searchType.codeName];
        }
        return nestedValue && nestedValue.toLowerCase().startsWith(search.toLowerCase());
    });
    return (
        <>
            <div className="font-monospace mt-5" style={{ width: "110%" }}>
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
                    {activeTab === "Pending" ? <div className="mx-1 mt-2">
                        {dataPresent && <div className="d-flex justify-content-end">
                            <div className="mx-2 mt-2 mb-2">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><SearchOutlined /></span>
                                    </div>
                                    <input type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="form-control" placeholder="Search..." />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" onClick={() => toggleSearchType()}>
                                            <small>{searchType.name}</small>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
                            {dataPresent ? <table className="table mt-3" >
                                <thead>
                                    <tr className="table-primary">
                                        <th>NO.</th>
                                        <th>Names</th>
                                        <th>Department</th>
                                        <th>Leave type</th>
                                        <th>Start date</th>
                                        <th>End date</th>
                                        <th>Return date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((pendingLeave, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{pendingLeave.leaveInfo.staff.empNames}</td>
                                                <td>{pendingLeave.leaveInfo.staff.department}</td>
                                                <td>{pendingLeave.actualLeave.leaveType}</td>
                                                <td>{formatTextDateInput(pendingLeave.actualLeave.startDate)}</td>
                                                <td>{formatTextDateInput(pendingLeave.actualLeave.endDate)}</td>
                                                <td>{formatTextDateInput(pendingLeave.actualLeave.returnDate)}</td>
                                                <td>
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
                                                                onClick={() => initiateUpdateLeaveModal(pendingLeave, index)}
                                                            >
                                                                <div className='d-flex flex-row'>
                                                                    <FormOutlined />
                                                                    <p className='mx-3 my-0 py-0 text-muted'><strong>Review document</strong></p>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => initiateShowLeaveDetails(pendingLeave)}
                                                            >
                                                                <div className='d-flex flex-row'>
                                                                    <DeleteOutlined />
                                                                    <p className='mx-3 my-0 py-0 text-muted'><strong>Detailed information</strong></p>
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
                    </div> : <HumanResourceReviewedRequest leaveData={leaveData} />}
                </div>
                <div>
                    {showApproveRequestModal && <HRManagerReviewRequest
                        modalIsOpen={showApproveRequestModal}
                        toggleModal={toggleApproveModal}
                        data={approveData}
                        token={token}
                        setData={setApproveData}
                        handleReview={handleReview}

                    />}
                </div>
                <div>
                    {showLeaveDetails && <ActualLeaveRequestDetails
                        modalIsOpen={showLeaveDetails}
                        toggleModal={toggleShowLeaveDetails}
                        data={leaveDetails}
                    />}
                </div>
                <div>
                    {showSearchType && <ChooseSearchType
                        modalIsOpen={showSearchType}
                        toggleModal={toggleSearchType}
                        data={searchType}
                        setData={setSearchType}
                    />}
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>

        </>
    )
}

export default HRManagerPendingRequest;
