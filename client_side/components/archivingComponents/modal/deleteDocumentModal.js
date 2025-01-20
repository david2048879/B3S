import { useState, useEffect } from "react";
import { Modal } from "reactstrap";

const DeleteDocumentModal = ({ toggleModal, modalIsOpen, data, handleDelete }) => {
    const [confirmText, setConfirmText] = useState("");
    const [disableConfirm,setDisableConfirm]=useState(true)

    const handleInputChange = (e) => {
        setConfirmText(e.target.value);
    };
    useEffect(()=>{
        if (confirmText === data.documentName) {
            setDisableConfirm(false)
        } else {
            setDisableConfirm(true)
        }
    },[confirmText])

    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='lg'>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB" }}>
                        <span style={{ color: "#0068D1", fontWeight: "700" }}>
                            Delete Document
                        </span>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end mt-3' style={{ marginRight: "50px" }}>
                        <span style={{ cursor: "pointer", fontWeight: "bolder" }} onClick={() => toggleModal()}>X</span>
                    </div>
                </div>
            </div>
            <div className="mx-5">
                <form onSubmit={(e)=>handleDelete(e,data.id)}>
                    <div className="alert alert-warning" role="alert">
                        <strong>Warning!</strong> This action cannot be undone.
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="confirmText" style={{ fontWeight: "500" }} className="form-label">
                            To confirm deletion, please type the document name: <span className="text-primary">{data.documentName}</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="confirmText"
                            value={confirmText}
                            onChange={handleInputChange}
                            placeholder={`Enter document name to confirm`}
                            required
                        />
                    </div>
                    <div className="d-flex justify-content-end mb-5">
                        <button type="submit" disabled={disableConfirm} className="btn btn-sm btn-danger py-2" style={{ borderRadius: "5px" }}>
                            Delete Document
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default DeleteDocumentModal;
