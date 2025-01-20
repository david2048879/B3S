import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Select from "react-select";

const AdminAddRoleModal = ({ modalIsOpen, toggleModal, info, setInfo, addSupervisorHandler, employees }) => {
    const [activateConfirm, setActivateConfirm] = useState(false);
    const roles = [
        { value: "OPERATOR", label: "Scanning operator" },
        { value: "ADMIN", label: "Administrator" },
    ];

    const handleStaffChange = (selectedOption) => {
        setInfo({ ...info, empCode: selectedOption.value });
    };
    useEffect(() => {
        console.log(info);

        if (info.empCode !== "" && info.role !== "") {
            setActivateConfirm(true);
        } else {
            setActivateConfirm(false);
        }
    }, [info.role, info.empCode]);

    return (
        <Modal
            isOpen={modalIsOpen}
            toggle={() => toggleModal()}
            className="d-flex align-items-center justify-content-center"
            size="md"
            style={{
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                maxWidth: "500px",
                backgroundColor: "#fff",
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                overflow: "hidden",
            }}
        >
            <ModalHeader
                toggle={() => toggleModal()}
                style={{
                    backgroundColor: "#f5f6f7",
                    padding: "15px 20px",
                    borderBottom: "1px solid #e6e6e6",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h5
                    className="mb-0 text-primary"
                    style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                    }}
                >
                    Add Role
                </h5>

            </ModalHeader>
            <ModalBody
                style={{
                    padding: "20px",
                    backgroundColor: "#fff",
                    color: "#333",
                }}
            >
                <form>
                    <div className="form-group mb-4">
                        <label
                            htmlFor="staffSelect"
                            style={{
                                display: "block",
                                fontWeight: "600",
                                marginBottom: "10px",
                                fontSize: "14px",
                                color: "#444",
                            }}
                        >
                            Staff
                        </label>
                        <Select
                            id="staffSelect"
                            options={employees.map((emp) => ({
                                value: emp.empCode,
                                label: emp.empNames,
                            }))}
                            onChange={handleStaffChange}
                            placeholder="Select Staff..."
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    fontSize: "14px",
                                    color: "#333",
                                    boxShadow: "none",
                                    transition: "border-color 0.3s ease",
                                    "&:hover": {
                                        borderColor: "#0069d9",
                                    },
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: "#888",
                                }),
                            }}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label
                            htmlFor="roleSelect"
                            style={{
                                display: "block",
                                fontWeight: "600",
                                marginBottom: "10px",
                                fontSize: "14px",
                                color: "#444",
                            }}
                        >
                            Role
                        </label>
                        <Select
                            id="roleSelect"
                            options={roles}
                            onChange={(option) => setInfo({ ...info, role: option.value })}
                            placeholder="Select Role..."
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "6px",
                                    padding: "6px",
                                    fontSize: "14px",
                                    color: "#333",
                                    boxShadow: "none",
                                    transition: "border-color 0.3s ease",
                                    "&:hover": {
                                        borderColor: "#0069d9",
                                    },
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: "#888",
                                }),
                            }}
                        />
                    </div>
                </form>
            </ModalBody>
            <ModalFooter
                style={{
                    backgroundColor: "#f5f6f7",
                    padding: "15px 20px",
                    borderTop: "1px solid #e6e6e6",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <button
                    type="button"
                    className="btn"
                    onClick={() => toggleModal()}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "6px",
                        backgroundColor: "#f0f0f0",
                        border: "none",
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className={`btn ${activateConfirm ? "btn-primary" : "btn-secondary"}`}
                    disabled={!activateConfirm}
                    onClick={addSupervisorHandler}
                    style={{
                        padding: "10px 20px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    SAVE ROLE
                </button>
            </ModalFooter>
        </Modal>

    );
};

export default AdminAddRoleModal;
