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
import ModifySupervisorModal from "../Modals/modifySupervisorModal";
import DeleteSupervisorModal from "../Modals/deleteSupervisorModal";
import {
    EllipsisOutlined,
    DeleteOutlined,
    FormOutlined
} from "@ant-design/icons";
import AdminAddSupervisorModal from "../../archivingComponents/modal/addSupervisorModal";

const AdminSupervisorOperation = ({ token }) => {
    const [data, setData] = useState([])
    const [employees, setEmployees] = useState([])
    const [addSupervisorData, setAddSupervisorData] = useState({
        staff: "",
        responsability: {
            inChargeOf: "",
            category: ""
        },
        role: ""
    })
    const [updateData, setUpdateData] = useState({
        id: "",
        role: "",
        responsability: {
            inChargeOf: "",
            category: ""
        },
        status: "",
    })
    const [dataPresent, setDataPresent] = useState(false)
    const [search, setSearch] = useState("")
    const [deleteData, setDeleteData] = useState({
        id: "",
        empNames: ""
    })
    const [updateModal, setUpdateModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [addSupervisorModal, setAddSupervisorModal] = useState(false)
    const [updateDetails, setUpdateDetails] = useState()
    const toggleUpdateModal = () => {
        setUpdateModal(!updateModal)
    }
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal)
    }
    const toggleAddSupervisorModal = () => {
        setAddSupervisorModal(!addSupervisorModal)
    }
    const initiateUpdateSupervisorDetails = (supervisor) => {
        setUpdateDetails(supervisor.staff.empNames)
        setUpdateData({
            id: supervisor._id,
            role: supervisor.role,
            responsability: {
                inChargeOf: supervisor.responsability.inChargeOf,
                category: supervisor.responsability.category
            },
            status: supervisor.state
        });
        setUpdateModal(true);
    };
    const initiateDeleteSupervisorModel = (supervisor) => {
        setDeleteData({ empNames: supervisor.staff.empNames, id: supervisor._id })
        setDeleteModal(true)
    }
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await axios.get(`${API}/leave/admin/getallsupervisors`, config);
            const responseEmployees = await axios.get(`${API}/leave/admin/getallemployees`, config);
            setEmployees(responseEmployees.data)
            console.log(response.data)

            if (response.data.length === 0) {
                setDataPresent(false)
            }
            else {
                setDataPresent(true)
                setData(response.data)
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddSupervisor = async () => {
        console.log(addSupervisorData);
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axios.post(`${API}/leave/admin/addsupervisor`, addSupervisorData, config)
            toast.success("successfully added supervisor!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
            toggleAddSupervisorModal();
        } catch (error) {
            console.log(error)
            toast.error("Failure!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    }

    const handleUpdateSupervisor = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axios.put(`${API}/leave/admin/updatesupervisor`, updateData, config)
            toast.success("successfully added supervisor!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
            toggleUpdateModal();
        } catch (error) {
            console.log(error)
            toast.error("Failure!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
        }
    }

    const handleDeleteSupervisor = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            await axios.delete(`${API}/leave/admin/deletesupervisor/${deleteData.id}`, config)
            toast.success("successfully deleted supervisor!", {
                position: toast.POSITION.TOP_LEFT,
                autoClose: 5000
            });
            toggleDeleteModal();
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
    }, [updateModal, deleteModal, addSupervisorModal])
    // const filteredData = data.filter(searchedLeave => {
    //     return searchedLeave.leaveInfo.staff.searchType.empNames && searchedLeave.leaveInfo.staff.searchType.empNames.toLowerCase().startsWith(search.toLowerCase());
    // });
    return (
        <>
            <div className="font-monospace mt-4 mx-5" style={{ width: "100%" }}>
                <p><strong>All supervisors</strong></p>
                <div className="card rounded-3 shadow-sm">
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td className="d-flex justify-content-center">Manage supervisors</td>
                            </tr>
                        </thead>
                    </table>

                    <div className="mx-1 mt-2">
                        {dataPresent && <div className="d-flex justify-content-end">
                            <div>
                                <button className="btn btn-dark" style={{ backgroundColor: "#F1F4F6", borderColor: "#F1F4F6", color: "#3c5d87" }} ><span style={{ fontWeight: "bold" }} onClick={toggleAddSupervisorModal}> + ADD SUPERVISOR </span></button>
                            </div>
                        </div>}
                        <div style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
                            {dataPresent ? <table className="table mt-3" >
                                <thead>
                                    <tr className="table-primary">
                                        <th>NO.</th>
                                        <th>Names</th>
                                        <th>DEPARTMENT</th>
                                        <th>JOB TITLE</th>
                                        <th>ROLE</th>
                                        <th>STATUS</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((supervisor, index) => {
                                        try {
                                            return (
                                                <tr key={index}>
                                                    {console.log(supervisor)}
                                                    <td>{index + 1}</td>
                                                    <td>{supervisor.staff.empNames}</td>
                                                    <td>{supervisor.staff.currentAppointment.department}</td>
                                                    <td>{supervisor.staff.currentAppointment.jobTitle}</td>
                                                    <td>{supervisor.role}</td>
                                                    <td>{supervisor.state === "ACTIVE" ? (<span className="badge rounded-pill bg-primary">Active</span>)
                                                        : (<span className="badge rounded-pill bg-danger">Inactive</span>)}</td>
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
                                                                    onClick={() => initiateUpdateSupervisorDetails(supervisor)}
                                                                >
                                                                    <div className='d-flex flex-row'>
                                                                        <FormOutlined />
                                                                        <p className='mx-3 my-0 py-0 text-muted'><strong>Update</strong></p>
                                                                    </div>
                                                                </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => initiateDeleteSupervisorModel(supervisor)}
                                                                >
                                                                    <div className='d-flex flex-row'>
                                                                        <DeleteOutlined />
                                                                        <p className='mx-3 my-0 py-0 text-muted'><strong>Delete</strong></p>
                                                                    </div>
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        catch (error) {
                                            return (
                                                <tr key={index}>
                                                    {console.log(supervisor)}
                                                    <td>{index + 1}</td>
                                                    <td><span className="text-danger">Error loading name</span></td>
                                                    <td><span className="text-danger">Error loading department</span></td>
                                                    <td><span className="text-danger">Error loading job title</span></td>
                                                    <td>{supervisor.role}</td>
                                                    <td><span className="badge rounded-pill bg-danger">Inactive</span></td>
                                                </tr>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table> : (
                                <div>
                                    <div className="mt-2" style={{ border: "1px solid #ccc", borderRadius: '20px' }}>
                                        <div style={{ marginTop: "80px" }}>
                                            <div className="d-flex justify-content-center">
                                                <p style={{ fontSize: "32px", color: "#083156", fontWeight: "bolder" }}>No supervisor found</p>
                                            </div>
                                            <p className="mt-2 mx-auto text-center" style={{ maxWidth: '600px', fontSize: "16px", color: "#3d4d5c" }}>
                                                No supervisor  found in the database. This could be because you haven't inserted any supervisor. Please ensure that you add a supervisor.
                                            </p>
                                            <div className="mt-2 mb-4 d-flex justify-content-center">
                                                <button className="btn btn-dark" style={{ backgroundColor: "#F1F4F6", borderColor: "#F1F4F6", color: "#3c5d87" }} ><span style={{ fontWeight: "bold" }} onClick={toggleAddSupervisorModal}>ADD SUPERVISOR </span></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
                <div>
                    {addSupervisorModal && <AdminAddSupervisorModal
                        modalIsOpen={addSupervisorModal}
                        toggleModal={toggleAddSupervisorModal}
                        info={addSupervisorData}
                        setInfo={setAddSupervisorData}
                        employees={employees}
                        addSupervisorHandler={handleAddSupervisor}
                    />}
                </div>
                <div>
                    {deleteModal && <DeleteSupervisorModal
                        modalIsOpen={deleteModal}
                        toggleModal={toggleDeleteModal}
                        info={deleteData}
                        deleteHandler={handleDeleteSupervisor}
                    />}
                </div>
                <div>
                    {updateModal && <ModifySupervisorModal
                        modalIsOpen={updateModal}
                        toggleModal={toggleUpdateModal}
                        info={updateData}
                        data={updateDetails}
                        setInfo={setUpdateData}
                        updateHandler={handleUpdateSupervisor}
                    />}
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>

        </>
    )
}

export default AdminSupervisorOperation;
