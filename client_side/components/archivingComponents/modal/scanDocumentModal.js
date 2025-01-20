import { useState } from "react";
import { Modal } from "reactstrap"



const ScanDocumentModal = ({ toggleModal, modalIsOpen, docType, handleInputChange, handleSubmit, setFile, file, documentSaved,goBack }) => {
    const [fileError, setFileError] = useState('');
    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFile(file);
            setFileError('');
        } else {
            setFile(null);
            setFileError('Please select a valid PDF file.');
        }
    };
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='lg' >
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB" }}>
                        <span style={{ color: "#0068D1", fontWeight: "700" }}>
                            Scan document
                        </span>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end mt-3' style={{ marginRight: "50px" }}>
                        <span style={{ cursor: "pointer", fontWeight: "bolder" }} onClick={() => toggleModal()} >X</span>
                    </div>
                </div>
            </div>
            {documentSaved.isSaved===false ? <div className="mx-5">
                <div>
                    <div>
                        <p style={{ fontSize: "14px", fontWeight: "700" }} className="mb-0">About this document</p>
                        <span style={{ fontSize: "14px", fontWeight: "400" }}>
                            {docType.description}
                        </span>
                    </div>
                    <div className="mt-3">
                        <div className="d-flex flex-column" style={{ fontSize: "14px", fontWeight: "400" }}>
                            <div className="d-flex flex-row">
                                <div className="">
                                    <span><i className="fa-regular fa-clock" style={{ marginRight: "10px", color: "#0063cf" }}></i></span>
                                    <span style={{ fontWeight: "700" }}>Number of fields : {docType.searchFields.length} field(s)</span>
                                </div>
                                <div className="" style={{ marginLeft: "40px" }}>
                                    <span><i className="fa-regular fa-flag" style={{ marginRight: "10px", color: "#0063cf" }}></i></span>
                                    <span style={{ fontWeight: "700" }}>Attention : All fields are required</span>
                                </div>
                            </div>
                            <div className="my-2">
                                <div className="">
                                    <span><i class="fa-regular fa-file" style={{ marginRight: "10px", color: "#0063cf" }}></i></span>
                                    <span ><span style={{ fontWeight: "700" }}>Document by</span> : <div style={{ border: "1px solid #0063cf", borderRadius: "5px", display: "inline-block" }}>
                                        <span className="text-primary py-1 px-1" style={{ fontSize: "0.8em" }}>{docType.department}</span>
                                    </div>
                                    </span>
                                </div>
                            </div>
                            <div className="">
                                <span style={{ color: "#0056b3", fontSize: "13px", fontWeight: "400", textDecoration: "underline" }}>Fill in the form below</span>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={(e) => handleSubmit(e, docType)}>
                    <div className="row">
                        {docType.searchFields.map((field, index) => (
                            <div key={index} className="col-md-6 mb-3">
                                <label htmlFor={field.name} style={{ fontWeight: "500" }} className="form-label">{field.name}</label>
                                <input
                                    type={field.docDataType}
                                    className="form-control"
                                    id={field.name}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${field.name}`}
                                    required
                                />
                            </div>
                        ))}
                        <div className="col-md-12 mb-3">
                            <div className="custom-file">
                                <input type="file" className="custom-file-input" onChange={handleFile} id="validatedCustomFile" accept=".pdf" required />
                                <label className="custom-file-label" htmlFor="validatedCustomFile">
                                    {file ? file.name : "Choose PDF file..."}
                                </label>
                                {fileError && <div className="invalid-feedback" style={{ display: 'block' }}>{fileError}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end mb-5">
                        <input type="submit" className="btn btn-sm btn-primary py-2" value="Save document" style={{ borderRadius: "5px" }} />
                    </div>
                </form>
            </div> :
                <>
                    <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", marginLeft: "30px" }} className="mb-0">Document index</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '400px',
                        height: '400px',
                        marginLeft:"200px",
                        marginBottom:"30px",
                        borderRadius: '50%',
                        backgroundColor: '#0088E0',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        <span style={{fontSize:`${300 / documentSaved.index.toString().length}px`}}>{documentSaved.index}</span>
                    </div>
                    <div className="d-flex justify-content-end mb-2 mx-3">
    
                        <button onClick={goBack} className="btn btn-sm btn-primary py-2">Go Back</button>
                    </div>
                </>
            }
        </Modal>
    )
}
export default ScanDocumentModal