import { useState, useEffect } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import formatDateToCustomFormat from "../../../helpers/dateHelper";
import LeaveDatesCalendarView from "./LeaveDatesInCalendar";
import {
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import StaffDeleteDatesModal from "../Modals/staffDeleteDatesModal";
import StaffUpdateDatesModal from "../Modals/staffUpdateDatesModal";


const LeaveDates = ({ data, viewCalendar, token, toggleViewCalendar, deleteModal, setDeleteModal, updateModal, setUpdateModal }) => {
    const [deleteInfo, setDeleteInfo] = useState({
        index: "",
        id: "",
        startDate: "",
        endDate: ""
    })
    const [remainingDays,setRemainingDays]=useState(0)
    const [updateInfo, setUpdateInfo] = useState({
        index: "",
        daysTaken: 0,
        updateData: data
    })
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal)
    }
    const toggleUpdateModal = () => {
        setUpdateModal(!updateModal)
    }
    const showDeleteModal = (leavePlanIndex) => {
        setDeleteInfo({
            index: leavePlanIndex,
            id: data._id
        })
        setDeleteModal(true)
    }
    const showUpdateModal = (info, leavePlanIndex) => {
        setUpdateInfo({
            ...updateInfo,
            index: leavePlanIndex,
            daysTaken: info.daysPlanned,
            startDate: info.startDate,
            endDate: info.endDate,
            _id: info._id
        })
        setUpdateModal(true)
    }
    useEffect(() => {
        let sum=0;
        for(let i=0;i<data.plannedDates.length;i++){
            sum +=data.plannedDates[i].daysPlanned
        }
        let remaining=data.daysEligible-sum
        setRemainingDays(remaining)
    }, [deleteModal,updateModal])

    return (
        <>
            <div>
                {!viewCalendar && <div className="mt-1" style={{ height: "394px" }}>
                    <table className="table mt-3">
                        <thead>
                            <tr className="table-warning">
                                <th>NO.</th>
                                <th>LEAVE TYPE</th>
                                <th>START ON</th>
                                <th>END ON</th>
                                <th>DAYS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.plannedDates.map((info, index) => {
                                return (
                                    <tr key={info._id}>
                                        <td>{index + 1}</td> {/* Display a row number */}
                                        <td>{info.leaveTypePlanned}</td>
                                        <td>{formatDateToCustomFormat(info.startDate)}</td>
                                        <td>{formatDateToCustomFormat(info.endDate)}</td>
                                        <td>{info.daysPlanned}</td>
                                        <td className="">
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    disabled={data.supervisorValidated}
                                                    role="button"
                                                    size="sm"
                                                    color=""
                                                    onClick={(e) => e.preventDefault()}
                                                >
                                                    <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
                                                </DropdownToggle>
                                                <DropdownMenu className="dropdown-menu-arrow" end>
                                                    <DropdownItem
                                                        disabled={data.supervisorValidated}
                                                        onClick={() => showUpdateModal(info, index)}
                                                    >
                                                        <div className='d-flex flex-row'>
                                                            <EditOutlined />
                                                            <p className='mx-3 my-0 py-0 text-muted'>Update</p>
                                                        </div>
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        disabled={data.supervisorValidated}
                                                        onClick={() => showDeleteModal(index)}
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
                    </table>
                    <div>
                        {deleteModal && <StaffDeleteDatesModal modalIsOpen={deleteModal} toggleModal={toggleDeleteModal} token={token} info={deleteInfo} />}
                    </div>
                    <div>
                        {updateModal && <StaffUpdateDatesModal modalIsOpen={updateModal} toggleModal={toggleUpdateModal} remainingDays={remainingDays} token={token} info={updateInfo} />}
                    </div>
                </div>}
                {viewCalendar && <LeaveDatesCalendarView data={data} toggleCalendarView={toggleViewCalendar} />}
            </div>
        </>
    )
}


export default LeaveDates