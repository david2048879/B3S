import React from 'react';
import { Modal } from 'reactstrap';

const ShowPropertiesModal = ({ modalIsOpen, toggleModal, data }) => {
    return (
        <Modal isOpen={modalIsOpen} toggle={toggleModal} size='lg'>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB", borderRadius: "10px" }}>
                        <span style={{ color: "#0068D1" }}>
                            View properties
                        </span>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end'>
                        <div className="mx-3 mt-3">
                            <i className="fa-regular fa-circle-xmark" onClick={toggleModal} style={{ fontSize: "1.5em", cursor: "pointer", color: "#0068D1" }}></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>
                <table className="table table-borderless">
                    <thead>
                        <tr className="table-warning">
                            <td>Description of the document</td>
                        </tr>
                    </thead>
                    <div className="mx-3">
                        <tbody>
                            <tr>
                                <td>Department Name:</td>
                                <td><strong>{data.department}</strong></td>
                            </tr>
                            <tr>
                                <td>Document Name:</td>
                                <td><strong>{data.docType}</strong></td>
                            </tr>
                        </tbody>
                    </div>
                </table>
            </div>
            <div className='m-2'>
                <ul style={{ listStyleType: "none", padding: 0, color: "#3d4d5c" }}>
                    {data.searchFields.map((property, index) => (
                        <li key={index}
                            style={{
                                backgroundColor: "white",
                                borderBottom: '1.5px solid #f0f0f0',
                                borderRadius: "8px",
                                marginBottom: "10px",
                                padding: "15px 20px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.03)", // Subtle top shadow
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
                                e.currentTarget.style.borderBottom = "1.5px solid transparent";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.03)";
                                e.currentTarget.style.borderBottom = "1.5px solid #f0f0f0";
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>Property name</div>
                                    <div style={{ color: "#6c757d", fontSize: "0.9em" }}>{property.name}</div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: "bold" }}>Property type</div>
                                    <div style={{ color: "#6c757d", fontSize: "0.9em" }}>{property.docDataType}</div>
                                </div>
                                <div>
                                    <span style={{
                                        backgroundColor: "#e9ecef",
                                        padding: "5px 10px",
                                        borderRadius: "15px",
                                        fontSize: "0.8em",
                                        marginRight: "10px"
                                    }}>
                                        Min: {property.minLength}
                                    </span>
                                    <span style={{
                                        backgroundColor: "#e9ecef",
                                        padding: "5px 10px",
                                        borderRadius: "15px",
                                        fontSize: "0.8em"
                                    }}>
                                        Max: {property.maxLength}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Modal>
    );
};

export default ShowPropertiesModal;