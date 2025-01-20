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
import ModifyUserRoleModal from "../modal/modifySupervisorModal";
import DeleteDocumentModal from "../modal/deleteDocumentModal";
import {
    EllipsisOutlined,
    DeleteOutlined,
    FormOutlined
} from "@ant-design/icons";
import AdminAddRoleModal from "../modal/addSupervisorModal";

const ManageRoles = ({ token }) => {
    const [data, setData] = useState([])
    const [employees, setEmployees] = useState([])
    const [addSupervisorData, setAddSupervisorData] = useState({
        empCode: "",
        role: ""
    })
    const [updateData, setUpdateData] = useState({
        id: "",
        empCode: "",
        role: ""
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
    const initiateUpdateUserRoleDetails = (supervisor) => {
        setUpdateDetails(supervisor.staff.empNames)
        setUpdateData({
            id: supervisor._id,
            role: supervisor.role,
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
            const response = await axios.get(`${API}/archive/admin/userroles`, config);
            const responseEmployees = await axios.get(`${API}/archive/admin/employees`, config);
            setEmployees(responseEmployees.data)
            console.log(responseEmployees.data);

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
            await axios.post(`${API}/archive/admin/addscanroles`, addSupervisorData, config)
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
            await axios.delete(`${API}/archive/admin/deleterole/${deleteData.id}`, config)
            toast.success("successfully deleted user role!", {
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
            <div className="font-monospace mt-4 mx-5" style={{ width: "90%" }}>
                <p><strong>All individual with roles</strong></p>
                <div className="card rounded-3 shadow-sm"
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "20px",
                        backgroundColor: "#f9fafc",
                        padding: "40px",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    }}>
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td className="d-flex justify-content-center">Manage User roles</td>
                            </tr>
                        </thead>
                    </table>

                    <div className="mx-1 mt-2">
                        {dataPresent && <div className="d-flex justify-content-end">
                            <div>
                                <button className="btn btn-dark" style={{ backgroundColor: "#F1F4F6", borderColor: "#F1F4F6", color: "#3c5d87" }} ><span style={{ fontWeight: "bold" }} onClick={toggleAddSupervisorModal}> + ADD USER ROLE </span></button>
                            </div>
                        </div>}
                        <div style={{ maxHeight: "375px", overflowY: "auto" }}>
                            {dataPresent ? <table className="table mt-3" style={{ borderCollapse: 'separate', borderSpacing: '0', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f7f9fc', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#5a5c69', fontWeight: '600' }}>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>No.</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>Names</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>Department</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>Job Title</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>Role</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>Status</th>
                                        <th style={{ padding: '15px', borderBottom: '2px solid #e3e6f0' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((supervisor, index) => {
                                        try {
                                            return (
                                                <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff', transition: 'background-color 0.3s ease' }}>
                                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                                    <td style={{ padding: '12px' }}>{supervisor.staff.empNames}</td>
                                                    <td style={{ padding: '12px' }}>{supervisor.staff.currentAppointment.department}</td>
                                                    <td style={{ padding: '12px' }}>{supervisor.staff.currentAppointment.jobTitle}</td>
                                                    <td style={{ padding: '12px' }}>{supervisor.role}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        {supervisor.state === "ACTIVE" ? (
                                                            <span style={{ backgroundColor: '#28a745', color: '#fff', padding: '5px 10px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>Active</span>
                                                        ) : (
                                                            <span style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>Inactive</span>
                                                        )}
                                                    </td>
                                                    <td style={{ padding: '12px' }}>
                                                        <UncontrolledDropdown>
                                                            <DropdownToggle
                                                                role="button"
                                                                size="sm"
                                                                color=""
                                                                onClick={(e) => e.preventDefault()}
                                                            >
                                                                <EllipsisOutlined style={{ transform: 'rotate(90deg)', cursor: 'pointer', color: '#6c757d' }} />
                                                            </DropdownToggle>
                                                            <DropdownMenu className="dropdown-menu-arrow" end>
                                                                <DropdownItem onClick={() => initiateUpdateUserRoleDetails(supervisor)}>
                                                                    <div className="d-flex flex-row">
                                                                        <FormOutlined />
                                                                        <p className="mx-3 my-0 py-0 text-muted"><strong>Update</strong></p>
                                                                    </div>
                                                                </DropdownItem>
                                                                <DropdownItem onClick={() => initiateDeleteSupervisorModel(supervisor)}>
                                                                    <div className="d-flex flex-row">
                                                                        <DeleteOutlined />
                                                                        <p className="mx-3 my-0 py-0 text-muted"><strong>Delete</strong></p>
                                                                    </div>
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </td>
                                                </tr>
                                            );
                                        } catch (error) {
                                            return (
                                                <tr key={index}>
                                                    <td style={{ padding: '12px' }}>{index + 1}</td>
                                                    <td style={{ padding: '12px', color: 'red' }}>Error loading name</td>
                                                    <td style={{ padding: '12px', color: 'red' }}>Error loading department</td>
                                                    <td style={{ padding: '12px', color: 'red' }}>Error loading job title</td>
                                                    <td style={{ padding: '12px' }}>{supervisor.role}</td>
                                                    <td style={{ padding: '12px' }}>
                                                        <span style={{ backgroundColor: '#dc3545', color: '#fff', padding: '5px 10px', borderRadius: '30px', fontSize: '12px', fontWeight: 'bold' }}>Inactive</span>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                                : (
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
                    {addSupervisorModal && <AdminAddRoleModal
                        modalIsOpen={addSupervisorModal}
                        toggleModal={toggleAddSupervisorModal}
                        info={addSupervisorData}
                        setInfo={setAddSupervisorData}
                        employees={employees}
                        addSupervisorHandler={handleAddSupervisor}
                    />}
                </div>
                <div>
                    {deleteModal && <DeleteUserRoleModal
                        modalIsOpen={deleteModal}
                        toggleModal={toggleDeleteModal}
                        info={deleteData}
                        deleteHandler={handleDeleteSupervisor}
                    />}
                </div>
                <div>
                    {updateModal && <ModifyUserRoleModal
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

export default ManageRoles;
