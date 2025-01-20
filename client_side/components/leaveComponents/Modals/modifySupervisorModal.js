import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import Select from "react-select";

const ModifySupervisorModal = ({ modalIsOpen, toggleModal, info, setInfo, updateHandler, data }) => {
    const roles = [
        "SUPERVISOR",
        "EXECUTIVE",
        "EXCO",
        "HEADOFDEPARTMENTS",
        "SYSTEMADMIN",
        "HR",
        "HRMANAGER"
    ];
    const statusOptions = ["ACTIVE", "INACTIVE"];
    const category = [
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
        { value: "OTHER", label: "Risk Management" }
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


    return (
        <Modal isOpen={modalIsOpen} toggle={toggleModal} className="font-monospace">
            <ModalHeader toggle={toggleModal}>Modify Supervisor</ModalHeader>
            <table className="table mt-3">
                <thead className="table-primary">
                    <tr>
                        <td className="mx-2">STAFF NAMES : </td>
                        <td className="mx-5">{data}</td>
                    </tr>
                </thead>
            </table>
            <ModalBody>
                <form>
                    <div className="form-group">
                        <label htmlFor="roleSelect">Role</label>
                        <select
                            className="form-select"
                            id="roleSelect"
                            value={info.role}
                            onChange={(e) => setInfo({ ...info, role: e.target.value })}
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    {info.role === "EXECUTIVE" && <div className="form-group">
                        <label htmlFor="category">Category:</label>
                        <select
                            className="form-select"
                            id="category"
                            value={info.responsability.category}
                            onChange={(e) => setInfo({ ...info, responsability: { ...info.responsability, category: e.target.value } })}
                        >
                            <option value="">Select Category</option>
                            {category.map((cat) => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>}
                    {info.role === "EXECUTIVE" && info.responsability.category === "DEPARTMENT" && <div className="form-group">
                        <label htmlFor="departments">Departments:</label>
                        <select
                            className="form-select"
                            id="departments"
                            value={info.responsability.inChargeOf}
                            onChange={(e) => setInfo({ ...info, responsability: { ...info.responsability, inChargeOf: e.target.value } })}
                        >
                            <option value="">Select department</option>
                            {department.map((dept) => (
                                <option key={dept.value} value={dept.value}>{dept.label}</option>
                            ))}
                        </select>
                    </div>}
                    {info.role === "EXECUTIVE" && info.responsability.category === "DIVISION" && <div className="form-group">
                        <label htmlFor="departments">Divisions:</label>
                        <select
                            className="form-select"
                            id="departments"
                            value={info.responsability.inChargeOf}
                            onChange={(e) => setInfo({ ...info, responsability: { ...info.responsability, inChargeOf: e.target.value } })}
                        >
                            <option value="">Select division</option>
                            {division.map((div) => (
                                <option key={div.value} value={div.value}>{div.label}</option>
                            ))}
                        </select>
                    </div>}
                    <div className="form-group">
                        <label htmlFor="statusSelect">Status</label>
                        <select
                            className="form-select"
                            id="statusSelect"
                            value={info.status}
                            onChange={(e) => setInfo({ ...info, status: e.target.value })}
                        >
                            <option value="">Select Status</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                <Button color="primary" onClick={updateHandler}>Update</Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModifySupervisorModal;
