import { useState,useEffect } from "react";
import { Modal } from "reactstrap"


const UpdateDocumentModal = ({ toggleModal, modalIsOpen, docType,data, handleUpdate }) => {
    const [formValues, setFormValues] = useState({});

    const handleInputChange = (e) => {
        const { id, value } = e.target;        
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };
    useEffect(() => {
        if (data) {
            setFormValues(data.documentFields || {});
        }
    }, [data]);
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center" size='lg' >
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB" }}>
                        <span style={{ color: "#0068D1", fontWeight: "700" }}>
                            Update document
                        </span>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end mt-3' style={{ marginRight: "50px" }}>
                        <span style={{ cursor: "pointer", fontWeight: "bolder" }} onClick={() => toggleModal()} >X</span>
                    </div>
                </div>
            </div>
            <div className="mx-5">
                <form onSubmit={(e) => handleUpdate(e, formValues,data._id)}>
                    <div className="row">
                        {docType.searchFields.map((field, index) => (
                            <div key={index} className="col-md-6 mb-3">
                                <label htmlFor={field.name} style={{ fontWeight: "500" }} className="form-label">{field.name}</label>
                                <input
                                    type={field.docDataType}
                                    className="form-control"
                                    id={field.name}
                                    value={formValues[field.name] || ''}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${field.name}`}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-end mb-5">
                        <input type="submit" className="btn btn-sm btn-primary py-2" value="Update document" style={{ borderRadius: "5px" }} />
                    </div>
                </form>
            </div>
        </Modal>
    )
}
export default UpdateDocumentModal