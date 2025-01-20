import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
const ModifyUserRoleModal = ({ modalIsOpen, toggleModal, info, setInfo, updateHandler, data }) => {
    const roles = [
        "OPERATOR",
        "ADMINISTRATOR"
    ];
    const statusOptions = ["ACTIVE", "INACTIVE"];



    return (
        <Modal
            isOpen={modalIsOpen}
            toggle={toggleModal}
            className="font-monospace"
            size="md"
            style={{
                maxWidth: "600px",
                margin: "auto",
            }}
        >
            {/* Modal Header */}
            <ModalHeader
                style={{
                    backgroundColor: "#007bff", // Bootstrap primary color
                    color: "#fff",
                    padding: "1rem",
                    borderTopLeftRadius: "0.3rem",
                    borderTopRightRadius: "0.3rem",
                }}
            >
                <h5 className="mb-0">Modify Supervisor</h5>
            </ModalHeader>

            {/* Table with Staff Names */}
            <div
                style={{
                    padding: "15px 30px",
                    backgroundColor: "#f8f9fa", // Light grey for contrast
                }}
            >
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: "600", color: "#007bff" }}>STAFF NAMES:</td>
                            <td>{data}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Modal Body */}
            <ModalBody
                style={{
                    padding: "20px 30px",
                }}
            >
                <form>
                    {/* Role Selection */}
                    <div className="form-group mb-4">
                        <label
                            htmlFor="category"
                            style={{
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "5px",
                            }}
                        >
                            Role:
                        </label>
                        <select
                            id="category"
                            value={info.role}
                            onChange={(e) => setInfo({ ...info, role: e.target.value })}
                            className="form-control"
                            style={{
                                borderRadius: "0.3rem",
                            }}
                        >
                            <option value="">Select role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Selection */}
                    <div className="form-group mb-4">
                        <label
                            htmlFor="statusSelect"
                            style={{
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "5px",
                            }}
                        >
                            Status:
                        </label>
                        <select
                            className="form-control"
                            id="statusSelect"
                            value={info.status}
                            onChange={(e) => setInfo({ ...info, status: e.target.value })}
                            style={{
                                borderRadius: "0.3rem",
                            }}
                        >
                            <option value="">Select Status</option>
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </ModalBody>

            {/* Modal Footer */}
            <ModalFooter
                style={{
                    padding: "15px 30px",
                    backgroundColor: "#f8f9fa", // Light grey for consistency
                    borderBottomLeftRadius: "0.3rem",
                    borderBottomRightRadius: "0.3rem",
                }}
            >
                <Button color="secondary" onClick={toggleModal}>
                    Cancel
                </Button>
                <Button color="primary" onClick={updateHandler}>
                    Update
                </Button>
            </ModalFooter>
        </Modal>

    );
};

export default ModifyUserRoleModal;
