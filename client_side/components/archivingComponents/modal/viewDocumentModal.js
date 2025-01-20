import { useEffect } from "react";
import { Modal } from "reactstrap";
import { formatTextDateInput } from "../../../helpers/dateHelper";

const ViewDocumentModal = ({ toggleModal, modalIsOpen, docType, document }) => {
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='lg'>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB" }}>
                        <span style={{ color: "#0068D1", fontWeight: "700", fontSize: "1.25rem" }}>
                            View Document
                        </span>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end mt-3' style={{ marginRight: "50px" }}>
                        <span style={{ cursor: "pointer", fontWeight: "bolder", fontSize: "1.25rem" }} onClick={() => toggleModal()}>×</span>
                    </div>
                </div>
            </div>
            <div className="mx-5 my-4">
                <div className="mb-4">
                    <div className="d-flex flex-column" style={{ fontSize: "1rem", fontWeight: "400" }}>
                        <div className="d-flex flex-row mb-2">
                            <i className="fa-regular fa-clock" style={{ marginRight: "10px", color: "#0063cf" }}></i>
                            <span style={{ fontWeight: "700" }}>Number of fields: {docType.searchFields.length} field(s)</span>
                        </div>
                        <div className="d-flex flex-row mb-2">
                            <i className="fa-regular fa-flag" style={{ marginRight: "10px", color: "#0063cf" }}></i>
                            <span style={{ fontWeight: "700" }}>Printed on: <span style={{ border: "1px solid #0063cf", borderRadius: "5px", padding: "0.2em 0.5em", backgroundColor: "#f0faff" }}>{formatTextDateInput(document.createdAt)}</span></span>
                        </div>
                        <div className="d-flex flex-row mb-2">
                            <i className="fa-regular fa-flag" style={{ marginRight: "10px", color: "#0063cf" }}></i>
                            <span style={{ fontWeight: "700" }}>Scanned By: <span style={{ border: "1px solid #0063cf", borderRadius: "5px", padding: "0.2em 0.5em", backgroundColor: "#f0faff" }}>{document.scannedBy.empNames}</span></span>
                        </div>
                        <div className="mb-2">
                            <span style={{ color: "#0056b3", fontSize: "0.9rem", fontWeight: "400", textDecoration: "underline" }}>Document Details</span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {docType.searchFields.map((field, index) => (
                        <div key={index} className="col-md-6 mb-3">
                            <label htmlFor={field.name} className="form-label" style={{ fontWeight: "500", fontSize: "1rem" }}>{field.name}</label>
                            <input
                                type={field.docDataType}
                                className="form-control"
                                id={field.name}
                                value={document.documentFields[field.name] || ''}
                                readOnly
                                placeholder={`N/A`}
                                style={{ backgroundColor: "#f9f9f9", borderColor: "#ced4da" }}
                            />
                        </div>
                    ))}
                </div>
                <div className="d-flex justify-content-end mb-5">
                    <button className="btn btn-sm btn-primary py-2" style={{ borderRadius: "5px" }} onClick={() => toggleModal()}>Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewDocumentModal;
