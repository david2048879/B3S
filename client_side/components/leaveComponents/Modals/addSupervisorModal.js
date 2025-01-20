import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";

const AdminAddSupervisorModal = ({ modalIsOpen, toggleModal, info, setInfo, addSupervisorHandler, employees }) => {
    const [activateConfirm, setActivateConfirm] = useState(false);

    const roles = [
        { value: "SUPERVISOR", label: "Supervisor" },
        { value: "EXECUTIVE", label: "Executive" },
        { value: "EXCO", label: "EXCO" },
        { value: "SYSTEMADMIN", label: "System Admin" },
        { value: "SYSTEMADMIN2", label: "System Admin helper" },
        { value: "HR", label: "HR" },
        { value: "HRMANAGER", label: "HR Manager" }
    ];
    const Incharge = [
        { value: "DEPARTMENT", label: "Department" },
        { value: "DIVISION", label: "Division" },
    ];
    const department = [
        { value: "FINANCE", label: "Finance" },
        { value: "EXECUTIVE", label: "Executive" },
        { value: "RETAIL BANKING", label: "Retail Banking" },
        { value: "OPERATIONS", label: "Operations" },
        { value: "SALES TEAM", label: "Sales Team" },
        { value: "BRANCH LEADERSHIP", label: "Branch Leadership" },
        { value: "CREDIT", label: "Credit" },
        { value: "BUSINESS", label: "Business" },
        { value: "RECOVERY", label: "Recovery" },
        { value: "MARKETING", label: "Marketing" },
        { value: "DIGITAL CHANNEL", label: "Digital Channel" },
        { value: "COMPLIANCE", label: "Compliance" },
        { value: "INTERNAL AUDIT", label: "Internal Audit" },
        { value: "LEGAL", label: "Legal" },
        { value: "HUMAN RESOURCES", label: "Human Resources" },
        { value: "IT", label: "IT" },
        { value: "SECURITY", label: "Security" },
        { value: "RISK MANAGEMENT", label: "Risk Management" },
        { value: "OTHER", label: "Other" }
    ];
    const division = [
        { value: "AUDIT", label: "Audit" },
        { value: "BUSINESS", label: "Business" },
        { value: "EXECUTIVE", label: "Executive" },
        { value: "FINANCE", label: "Finance" },
        { value: "OPERATIONS", label: "Operations" },
        { value: "PEOPLE", label: "People" },
        { value: "OTHER", label: "Other" },
    ]


    const handleStaffChange = (selectedOption) => {
        setInfo({ ...info, staff: selectedOption.value });
    };
    useEffect(() => {
        if (info.staff !== "" && info.role !== "") {
            setActivateConfirm(true);
        } else {
            setActivateConfirm(false);
        }
    }, [info.staff, info.role]);

    useEffect(() => {
        setInfo({
            staff: "",
            responsability: {
                inChargeOf: "",
                category: ""
            },
            role: ""
        })
    }, [])

    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='md'>
            <ModalHeader toggle={() => toggleModal()}>
                <div className="m-2">
                    <h4 className="text-primary">Add Supervisor</h4>
                </div>
            </ModalHeader>
            <ModalBody>
                <form>
                    <div className="form-group">
                        <label htmlFor="staffSelect">Staff</label>
                        <Select
                            id="staffSelect"
                            options={employees.map(emp => ({ value: emp.empCode, label: emp.empNames }))}
                            onChange={handleStaffChange}
                            placeholder="Select Staff..."
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="roleSelect">Role</label>
                        <Select
                            id="roleSelect"
                            options={roles}
                            onChange={option => setInfo({ ...info, role: option.value })}
                            placeholder="Select Role..."
                        />
                    </div>
                    {info.role === "EXECUTIVE" && <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <Select
                            id="category"
                            options={Incharge}
                            onChange={option => setInfo({ ...info, responsability: { ...info.responsability, category: option.value } })}
                            placeholder="Select ..."
                        />
                    </div>}
                    {info.role === "EXECUTIVE" && info.responsability.category === "DEPARTMENT" && <div className="form-group">
                        <label htmlFor="department">In charge of:</label>
                        <Select
                            id="department"
                            options={department}
                            onChange={option => setInfo({ ...info, responsability: { ...info.responsability, inChargeOf: option.value } })}
                            placeholder="Select ..."
                        />
                    </div>}
                    {info.role === "EXECUTIVE" && info.responsability.category === "DIVISION" && <div className="form-group">
                        <label htmlFor="division">In charge of:</label>
                        <Select
                            id="division"
                            options={division}
                            onChange={option => setInfo({ ...info, responsability: { ...info.responsability, inChargeOf: option.value } })}
                            placeholder="Select ..."
                        />
                    </div>}
                </form>
            </ModalBody>
            <ModalFooter>
                <button type="button" className="btn btn-light" onClick={() => toggleModal()}>Cancel</button>
                <button type="button" className={`btn ${activateConfirm ? "btn-primary" : "btn-light"}`} disabled={!activateConfirm} onClick={addSupervisorHandler}>SAVE SUPERVISOR</button>
            </ModalFooter>
        </Modal>
    );
};

export default AdminAddSupervisorModal;
