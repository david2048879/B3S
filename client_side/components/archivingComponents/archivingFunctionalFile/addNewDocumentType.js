import { useEffect, useState, useRef } from "react"
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API } from "../../../config";
import 'react-toastify/dist/ReactToastify.css';
import AddTitlePositionModal from "../modal/addTitlePositionModal";



const AddNewDocumentType = ({ token,setNavigation }) => {
    const [position, setPosition] = useState(0);
    const [data, setData] = useState({
        department: "",
        docType: "",
        description: "",
        searchFields: [{ name: "", docDataType: "text", inTitle: false, titlePosition: 1 }]
    });
    const [index, setIndex] = useState()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen)
    }
    const toastId = useRef(null)
    const [numberOfSearchCriterias, setNumberOfSearchCriterias] = useState(1);
    const [activateSaveButton, setActivateSaveButton] = useState(false)
    const handleNumberOfSearchCriteriasChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setNumberOfSearchCriterias(value);
        setData(prevData => {
            const newSearchFields = Array.from({ length: value }, (_, index) => {
                return prevData.searchFields[index] || { name: "", minLength: 0, maxLength: 0, docDataType: "text", inTitle: false, titlePosition: 0 };
            });
            return { ...prevData, searchFields: newSearchFields };
        });
    };

    const handleSearchFieldChange = (index, field, value) => {
        setData(prevData => {
            const newSearchFields = [...prevData.searchFields];
            const updatedValue = (field === 'minLength' || field === 'maxLength' || field === 'titlePosition') ? parseInt(value, 10) : value;
            newSearchFields[index][field] = updatedValue;
            return { ...prevData, searchFields: newSearchFields };
        });
    };
    const handlePositionalFieldChange = (i, field, value) => {
        if (value === true) {
            setData(prevData => {
                const newSearchFields = [...prevData.searchFields];
                const updatedValue = value;
                newSearchFields[i][field] = updatedValue;
                return { ...prevData, searchFields: newSearchFields };
            });
            setIndex(i)
            setModalIsOpen(true)
        }
        else {
            setData(prevData => {
                const newSearchFields = [...prevData.searchFields];
                newSearchFields[i][field] = value;
                newSearchFields[i].titlePosition = 0;
                let currentPosition = 1;
                newSearchFields.forEach(field => {
                    if (field.inTitle) {
                        field.titlePosition = currentPosition;
                        currentPosition++;
                    }
                });

                return { ...prevData, searchFields: newSearchFields };
            });
            console.log("data",data);
            
        }
    };
    const handleAddDocumentType = async (e) => {
        e.preventDefault();
        toastId.current = toast.info("Loading............", {
            position: toast.POSITION.TOP_LEFT,
            autoClose: false
        })
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.post(`${API}/archive/add/documenttype`, data, config)
            setData({
                department: "",
                docType: "",
                searchFields: [{ name: "", minLength: 0, maxLength: 0, inTitle: false, titlePosition: 1 }]
            })
            setNumberOfSearchCriterias(1)
            toast.update(toastId.current, { render: "Successfully added document type", type: toast.TYPE.SUCCESS, autoClose: 2000 })
        } catch (error) {
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
    }
    useEffect(() => {
        let count = 0
        for (let i = 0; i < data.searchFields.length; i++) {
            if (data.searchFields[i].name === "" ) {
                count++
            }
        }
        if (data.department !== "" && data.docType !== "" && count == 0) {
            setActivateSaveButton(true)
        }
        else {
            setActivateSaveButton(false)
        }
    }, [data])
    useEffect(() => {
        const titleFields = data.searchFields.filter(field => field.inTitle === true);
        if (titleFields.length > 0) {
            setPosition(titleFields.length - 1 + 1);
        } else {
            setPosition(1);
        }
    }, [data.searchFields]);


    return (
        <div style={{ fontFamily: "monospace" }}>
            <div className=" d-flex flex-row mx-5">
                <p> <span style={{ fontWeight: "bolder", fontSize: "0.6em", color: "black", cursor: "pointer" }}><i className="fa-solid fa-less-than"></i></span></p>
                <p className="mx-2"><span style={{ fontSize: "19px", fontWeight: "bolder", color: "#8c96a1", cursor: "pointer" }}>Document operations</span> / <span style={{ fontWeight: "bold", color: "#001836", fontSize: "19px" }}>Add new document type</span></p>
            </div>
            <div className=" mx-5 row mt-2" >
                <div className="col">
                    <p style={{ color: "#083156", fontSize: "20px", fontWeight: "bolder" }}>Type</p>
                    <div style={{ border: "1px solid #ccc", borderRadius: '15px', padding: "20px" }}>
                        <div className="d-flex flex-column">
                            <p style={{ color: "#083156", fontSize: "15px", fontWeight: "bolder" }}>File information</p>
                            <div className="row">
                                <div className="col-6">
                                    <div className="d-flex flex-column">
                                        <div class="form-group mx-3 mt-2">
                                            <label for="department" style={{ color: "#3d4d5c", fontSize: "14px" }}>* Choose department</label>
                                            <select className="form-control" id="department" value={data.department} onChange={(e) => setData({ ...data, department: e.target.value })}>
                                                <option>Choose</option>
                                                <option name="BUSINESS">BUSINESS DEPARTMENT</option>
                                                <option name="BUSINESS">IT DEPARTMENT</option>
                                                <option name="BUSINESS">RISK DEPARTMENT</option>
                                                <option name="BUSINESS">FINANCE DEPARTMENT</option>
                                                <option name="BUSINESS">CORPORATE SERVICE DEPARTMENT</option>
                                                <option name="BUSINESS">OPERATIONS DEPARTMENT</option>
                                                <option name="BUSINESS">CREDIT DEPARTMENT</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex flex-column">
                                        <div class="form-group mx-3 mt-2">
                                            <label for="department" style={{ color: "#3d4d5c", fontSize: "14px" }}>* Document(s) or collection of document(s)</label>
                                            <input type="text" className="form-control" placeholder="document type name...." value={data.docType} onChange={(e) => setData({ ...data, docType: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <div className="form-group mx-3 mt-2">
                                    <label for="department" style={{ color: "#3d4d5c", fontSize: "14px" }}>* Number of search criteria(s)</label>
                                    <input type="number" className="form-control" min={1} placeholder="number of search criterias ...." value={numberOfSearchCriterias} onChange={handleNumberOfSearchCriteriasChange} />
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <div className="form-group mx-3 mt-2">
                                    <label for="department" style={{ color: "#3d4d5c", fontSize: "14px" }}>* Description of the document type</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="Enter document type description here..."
                                        value={data.description}
                                        onChange={(e) => setData({ ...data, description: e.target.value })}
                                        rows={2}
                                        style={{ resize: 'none' }}
                                    ></textarea>

                                </div>
                            </div>
                            <p style={{ color: "#083156", fontSize: "15px", fontWeight: "bolder" }}>Search criterias</p>
                            {data.searchFields.map((_, index) => (
                                <div className="row" key={index}>
                                    <div className="col">
                                        <div className="form-group mx-3 mt-2">
                                            <label for="department" style={{ color: "#3d4d5c", fontSize: "14px" }}>* search criteria 1</label>
                                            <input type="text" className="form-control" placeholder="name of search criteria ...." required={true} value={data.searchFields[index]?.name || ''} onChange={(e) => handleSearchFieldChange(index, 'name', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group mx-3 mt-2">
                                            <label for="type" style={{ color: "#3d4d5c", fontSize: "14px" }}>Criteria type</label>
                                            <select className="form-control" onChange={(e) => handleSearchFieldChange(index, 'docDataType', e.target.value)}>
                                                <option value="text" >text</option>
                                                <option value="date">date</option>
                                                <option value="Number">Number</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div class="form-check mx-3 mt-5">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={data.searchFields[index]?.inTitle || false}
                                                onChange={(e) => handlePositionalFieldChange(index, 'inTitle', e.target.checked)}
                                            />
                                            <label class="form-check-label" for="exampleCheck1">In-title</label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-3 mb-3">
                        <button className="btn btn-dark" style={{ backgroundColor: activateSaveButton ? "#3f628e" : "#F1F4F6", borderColor: activateSaveButton ? "#3f628e" : "#F1F4F6", color: activateSaveButton ? "#ffffff" : "#8C96A1" }} onClick={handleAddDocumentType}><span style={{ fontWeight: "bold" }}>SAVE DOCUMENT TYPE</span></button>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <div>
                <AddTitlePositionModal
                    modalIsOpen={modalIsOpen}
                    toggleModal={toggleModal}
                    handleField={handleSearchFieldChange}
                    index={index}
                    position={position}
                />
            </div>
        </div>
    )
}

export default AddNewDocumentType