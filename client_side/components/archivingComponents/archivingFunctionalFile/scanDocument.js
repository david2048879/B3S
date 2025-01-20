import React, { useEffect, useRef, useState } from 'react';
import ScanDocumentCard from '../../cardsComponent/documentScanningCard';
import { toast, ToastContainer } from "react-toastify";
import { API } from '../../../config';
import axios from 'axios';
import ScanDocumentModal from '../modal/scanDocumentModal';
import { archivingValidation } from '../../../helpers/archivingHelpers';

const ScanDocument = ({ token, setNavigation }) => {
    const [toggleModal, setToggleModal] = useState(false)
    const [data, setData] = useState([])
    const [isAtStart, setIsAtStart] = useState(true);
    const [documentSaved, setDocumentSaved] = useState({
        isSaved: false,
        index: ""
    })
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [file, setFile] = useState()
    const [dataPresent, setDataPresent] = useState(false)
    const [formValues, setFormValues] = useState({});
    const [documentToPrint, setDocumentToPrint] = useState()
    const toastId = useRef(null)
    const scrollLeft = () => {
        document.querySelector('.card-container').scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        document.querySelector('.card-container').scrollBy({ left: 300, behavior: 'smooth' });
    };
    const handleOpenModal = () => {
        setToggleModal(!toggleModal)
    }
    const openModal = (documentType) => {
        setDocumentToPrint(documentType)
        setToggleModal(true)
    }
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [id]: value
        }));
    };
    const handleSubmit = async (e, docType) => {
        e.preventDefault();
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })
        const config = {
            headers: {
                'Content-Type': "multi-form/data",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            // const isValid = archivingValidation(docType, formValues);
            // if (!isValid) {
            //     toast.update(toastId.current, { render: "Fix the issue", type: toast.TYPE.WARNING, autoClose: 10000 })
            //     return;
            // }
            const formData = new FormData()
            formData.append("docTypeId", docType._id)
            formData.append("documentFields", JSON.stringify(formValues))
            formData.append("files", file)
            const response = await axios.post(`${API}/archive/save/document`, formData, config)
            console.log("response", response.data.index);
            setDocumentSaved({
                isSaved: true,
                index: response.data.index
            })
            toast.update(toastId.current, { render: "Successfully added document type", type: toast.TYPE.SUCCESS, autoClose: 2000 })
        }
        catch (error) {
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
            console.log(error);
        }
    };
    const fetchDocumentType = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.get(`${API}/archive/documenttype`, config)
            setData(response.data.docTypes)
            console.log(response.data);
            setDataPresent(response.data.dataPresent)
        }
        catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        const container = document.querySelector('.card-container');
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            checkScrollPosition();
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, []);
    useEffect(() => {
        fetchDocumentType();
    }, [])
    const checkScrollPosition = () => {
        const container = document.querySelector('.card-container');
        if (container.scrollLeft + container.clientWidth === container.scrollWidth) {
            console.log("we have reached the end");
            setIsAtEnd(true)
        } else {
            console.log("we are not to  the end");
            setIsAtEnd(false)
        }
        if (container.scrollLeft === 0) {
            console.log("we have reached the start");
            setIsAtStart(true)
        } else {
            console.log("we are not at the stack");
            setIsAtStart(false)
        }
        if (container) {
            setIsAtStart(container.scrollLeft === 0);
            setIsAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth - 1);
        }
    };
    useEffect(() => {
        const container = document.querySelector('.card-container');
        if (container) {
            container.addEventListener('scroll', checkScrollPosition);
            checkScrollPosition();
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, [data]);
    const goBack = () => {
        setFormValues({})
        setDocumentSaved({
            isSaved: false,
            index: ""
        })
        setFile()
    }
    return (
        <>
            <div className="container-fluid font-monospace">
                <div className=" d-flex flex-row mx-5">
                    <div> <span style={{ fontWeight: "bolder", color: "black", cursor: "pointer" }}><i className="fa-solid fa-less-than mt-1" style={{ fontSize: "1.2em", fontWeight: "bolder" }}></i></span></div>
                    <div className="mx-2"><span style={{ fontSize: "19px", fontWeight: "bolder", color: "#8c96a1", cursor: "pointer" }}>Scan document</span> </div>
                </div>
                {dataPresent ? <div className="mt-4">
                    <p className="my-1 mx-5 text-primary"><strong>Document types available</strong></p>
                    <div className='d-flex flex-row justify-content-end'>
                        <button
                            disabled={isAtStart ? true : false}
                            className={`btn rounded-circle mx-1 d-flex justify-content-center align-items-center`}
                            onClick={scrollLeft}
                            style={{ width: '24px', height: '24px', padding: 0, backgroundColor: `${isAtStart ? "#EBEDF2" : "#6B7A99"}` }}>
                            <i className="fa-solid fa-chevron-left" style={{ fontSize: '12px', color: "#CED2D9" }}></i>
                        </button>
                        <button
                            disabled={isAtEnd ? true : false}
                            className={`btn rounded-circle d-flex justify-content-center align-items-center`}
                            onClick={scrollRight}
                            style={{ width: '24px', height: '24px', padding: 0, backgroundColor: `${isAtEnd ? "#EBEDF2" : "#6B7A99"}` }}>
                            <i className="fa-solid fa-chevron-right" style={{ fontSize: '12px', color: "white" }}></i>
                        </button>
                    </div>
                    <div className="">
                        <div className="card-container d-flex overflow-auto py-2" style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {data.map((document, index) => (
                                <div key={index} className="flex-shrink-0 me-3">
                                    <ScanDocumentCard documentType={document} toggleModal={openModal} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div> : (
                    <div>
                        <div
                            className="mt-2"
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "20px",
                                backgroundColor: "#f9fafc",
                                padding: "30px",
                            }}
                        >
                            <div style={{ marginTop: "60px" }}>
                                <div className="d-flex justify-content-center">
                                    <p
                                        style={{
                                            fontSize: "32px",
                                            color: "#083156",
                                            fontWeight: "bolder",
                                            textShadow: "1px 1px 2px #ccc",
                                        }}
                                    >
                                        No Document type available
                                    </p>
                                </div>
                                <p
                                    className="mt-2 mx-auto text-center"
                                    style={{
                                        maxWidth: "600px",
                                        fontSize: "18px",
                                        color: "#3d4d5c",
                                        lineHeight: "1.6",
                                        padding: "0 20px",
                                    }}
                                >
                                    No document type found in the database. This could be because the administrator
                                    hasn't yet published any document type.
                                </p>
                                <div className="mt-4 mb-4 d-flex justify-content-center">
                                    <button
                                        className="btn btn-dark"
                                        onClick={() => setNavigation("ADD NEW DOCUMENT TYPE")}
                                        style={{
                                            backgroundColor: "#3c5d87",
                                            borderColor: "#3c5d87",
                                            color: "#fff",
                                            padding: "10px 20px",
                                            borderRadius: "50px",
                                            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = "#3c5d87"
                                            e.currentTarget.style.backgroundColor = "#f1f4f6"; // Change color on hover
                                            e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = "white"
                                            e.currentTarget.style.backgroundColor = "#3c5d87"; // Revert color
                                            e.currentTarget.style.transform = "scale(1)"; // Reset size
                                        }}
                                    >
                                        <span style={{ fontWeight: "bold" }}>ADD DOCUMENT TYPE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                )
                }
            </div>
            {toggleModal &&
                <ScanDocumentModal
                    modalIsOpen={toggleModal}
                    toggleModal={handleOpenModal}
                    docType={documentToPrint}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    file={file}
                    goBack={goBack}
                    documentSaved={documentSaved}
                    setFile={setFile}
                />
            }
            <ToastContainer />
        </>
    );
};

export default ScanDocument;