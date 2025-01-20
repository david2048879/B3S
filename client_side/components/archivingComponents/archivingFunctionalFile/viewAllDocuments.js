import { useEffect, useState, useRef } from "react"
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API } from "../../../config";
import 'react-toastify/dist/ReactToastify.css';
import ViewDocumentModal from "../modal/viewDocumentModal";
import UpdateDocumentModal from "../modal/updateDocumentModal";
import DeleteDocumentModal from "../modal/deleteDocumentModal";
import ScannedDocumentCard from "../../cardsComponent/scannedDocumentCard";

const ViewAdminAllScannedDocument = ({ token,setNavigation }) => {
    const [data, setData] = useState([])
    const [documentTypes, setDocumentTypes] = useState([])
    const [documents, setDocuments] = useState([])
    const [showSearchFields, setShowSearchFields] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState()
    const [selectedDocumentType, setSelectedDocumentType] = useState()
    const [modifyModal, setModifyModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [dataPresent, setDataPresent] = useState(false)
    const [updateData, setUpdateData] = useState()
    const [viewData, setViewData] = useState()
    const [selectedSearchFilter, setSelectedSearchFilters] = useState({
        show: false,
        searchFilters: []
    });
    const [search, setSearch] = useState("")
    const [searchedDocumentType, setSearchedDocumentType] = useState("")
    const handleSearchFilterSelection = (event) => {
        setSearchedDocumentType(event.target.value);
    };
    const [deleteData, setDeleteData] = useState({
        documentName: "",
        id: ""
    })
    const [showDocumentModal, setShowDocumentModal] = useState(false)
    const toastId = useRef(null)
    const [searchDepartment, setSearchDepartment] = useState("")
    const toggleModifyModal = () => {
        setModifyModal(!modifyModal)
    }
    const toggleDeleteModal = () => {
        setDeleteModal(!deleteModal)
    }
    const toggleShowDocumentModal = () => {
        setShowDocumentModal(!showDocumentModal)
    }
    const searchContainerStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
    };
    const searchInputStyle = {
        width: '100%',
        padding: '10px 15px 10px 40px',
        borderRadius: '25px',
        border: '2px solid #1a73e8',
        outline: 'none',
        fontSize: '16px',
    };

    const searchIconStyle = {
        position: 'absolute',
        top: '50%',
        left: '15px',
        transform: 'translateY(-50%)',
        fontSize: '16px',
        color: '#1a73e8',
    };
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.get(`${API}/archive/documenttype`, config)
            setData(response.data.docTypes)
            setShowSearchFields(response.data.dataPresent)
        }
        catch (error) {
            console.log(error);
            // toast.error("System failure", {
            //     position: toast.POSITION.TOP_LEFT, autoClose: 5000
            // });
        }
    }
    const handleChangeDepartment = (e) => {
        const department = e.target.value;
        setDataPresent(false)
        setDocuments([])
        setSearchDepartment(department)
        const filtered = data.filter(doc => doc.department === department);
        setDocumentTypes(filtered);
        setSelectedSearchFilters({
            show: false,
            searchFilters: []
        })
    }
    const handleChangeDocumentType = async (e) => {
        if (e.target.value !== "select") {
            const selected = e.target.value
            setSelectedDocument(selected)
            const filtered = data.filter(doc => doc.department === searchDepartment && doc.docType === selected);
            setSelectedDocumentType(filtered[0])
            console.log(filtered[0]);
            setSearchedDocumentType(filtered[0].searchFields[0].name)
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const response = await axios.post(`${API}/archive/scanned/documents`, { department: searchDepartment, docType: selected }, config)
                setDataPresent(response.data.dataPresent)
                setDocuments(response.data.documents)
                setSelectedSearchFilters({
                    show: true,
                    searchFilters: filtered[0].searchFields
                })
                setSearchedDocumentType(filtered[0].searchFields[0].name)
            }
            catch (error) {
                console.log(error);
                toast.error("System failure", {
                    position: toast.POSITION.TOP_LEFT, autoClose: 5000
                });
            }
        }
    }

    const initiateViewModal = (data) => {
        setShowDocumentModal(true)
        setViewData(data)
    }
    const initiateModifyModal = (data) => {
        setUpdateData(data)
        setModifyModal(true)
    }
    const initiateDeleteModal = (data) => {
        setDeleteData({
            id: data._id,
            documentName: data.docType.docType
        })
        setDeleteModal(true)
    }
    const handleUpdate = async (e, processData, id) => {
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
            const response = await axios.post(`${API}/archive/scanned/update`, { processData, id }, config)
            toast.update(toastId.current, { render: "Successfully Updated document", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            const fetchResponse = await axios.post(`${API}/archive/scanned/documents`, { department: searchDepartment, docType: selectedDocument }, config)
            setDataPresent(fetchResponse.data.dataPresent)
            setDocuments(fetchResponse.data.documents)
            setModifyModal(false)
        } catch (error) {
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }

    }
    const handleDeleteDocument = async (e, id) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.post(`${API}/archive/scanned/delete`, { id }, config)
            toast.update(toastId.current, { render: "Successfully deleted document", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            const fetchResponse = await axios.post(`${API}/archive/scanned/documents`, { department: searchDepartment, docType: selectedDocument }, config)
            setDataPresent(fetchResponse.data.dataPresent)
            setDocuments(fetchResponse.data.documents)
            setDeleteModal(false)
        }
        catch (error) {
            console.log(error);
            toast.error("System failure", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
        }
    }
    const filteredDocuments = dataPresent && documents.filter(searchedDocs => {
        return searchedDocs
            &&
            searchedDocs.documentFields &&
            searchedDocs.documentFields[searchedDocumentType]
                .toLowerCase()
                .startsWith((search || "").toLowerCase());
    });

    useEffect(() => {
        fetchData();
    }, [modifyModal])
    return (
        <div style={{ fontFamily: "monospace" }}>
            <div className="mx-5">
                <p className="mx-2"><span style={{ fontWeight: "bold", color: "#001836", fontSize: "19px" }}>Scanned documents</span></p>
            </div>
            <div className="row mt-1" >
            <div className={dataPresent ? "col-9" : "col-12"}>
                    <div className="d-flex flex-column">
                        {showSearchFields && <div className="row" style={{ marginLeft: "100px" }}>
                            <div className="col-6">
                                <div className="d-flex flex-column">
                                    <div class="input-group mx-3 mt-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">
                                                <i className="fa-solid fa-building" style={{ color: "#1e3050" }}></i>
                                            </span>
                                        </div>
                                        <select className="form-control" id="department" value={searchDepartment} onChange={handleChangeDepartment}>
                                            <option >Choose department</option>
                                            <option name="BUSINESS DEPARTMENT">BUSINESS DEPARTMENT</option>
                                            <option name="IT DEPARTMENT">IT DEPARTMENT</option>
                                            <option name="RISK DEPARTMENT">RISK DEPARTMENT</option>
                                            <option name="FINANCE DEPARTMENT">FINANCE DEPARTMENT</option>
                                            <option name="CORPORATE SERVICE DEPARTMENT">CORPORATE SERVICE DEPARTMENT</option>
                                            <option name="OPERATIONS DEPARTMENT">OPERATIONS DEPARTMENT</option>
                                            <option name="CREDIT DEPARTMENT">CREDIT DEPARTMENT</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-5" >
                                <div class="input-group mx-3 mt-2">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">
                                            <i className="fa-solid fa-building" style={{ color: "#1e3050" }}></i>
                                        </span>
                                    </div>
                                    <select
                                        className="form-control"
                                        id="documentType"
                                        value={selectedDocument}
                                        onChange={handleChangeDocumentType}
                                    >
                                        <option value="select">Select Document Type</option>
                                        {documentTypes.map(doc => (
                                            <option key={doc._id} value={doc.docType}>
                                                {doc.docType}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>}
                        <div>
                            <div className="form-group mt-2">
                                {dataPresent ?
                                    <>
                                        <div className="container">
                                            <div className="row mt-4">
                                                {filteredDocuments.map((document, index) => (
                                                    <div className="col-12 col-md-6 mb-4" key={index}>
                                                        <ScannedDocumentCard document={document}
                                                            initiateDeleteModal={initiateDeleteModal}
                                                            initiateModifyModal={initiateModifyModal}
                                                            initiateViewModal={initiateViewModal}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                    : (
                                        <div className="mx-2">
                                            <div
                                                className="mt-2"
                                                style={{
                                                    border: "1px solid #ccc",
                                                    borderRadius: "20px",
                                                    backgroundColor: "#f9fafc",
                                                    padding: "40px",
                                                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <div style={{ marginTop: "40px" }}>
                                                    <div className="d-flex justify-content-center">
                                                        <p
                                                            style={{
                                                                fontSize: "34px", 
                                                                color: "#083156",
                                                                fontWeight: "bolder",
                                                                textShadow: "1px 1px 2px rgba(255, 255, 255, 0.6)", 
                                                                marginBottom: "10px", 
                                                            }}
                                                        >
                                                            No Document Scanned Yet
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
                                                        It seems that no documents have been scanned into the system. Please ensure that you scan documents before searching.
                                                    </p>
                                                    <div className="mt-4 mb-4 d-flex justify-content-center">
                                                        <button
                                                        onClick={()=>setNavigation("SCAN")}
                                                            className="btn btn-dark"
                                                            style={{
                                                                backgroundColor: "#3c5d87",
                                                                borderColor: "#3c5d87",
                                                                color: "#fff",
                                                                padding: "12px 24px", 
                                                                borderRadius: "50px",
                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
                                                                transition: "background-color 0.3s, transform 0.2s", 
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.color="#3c5d87"
                                                                e.currentTarget.style.backgroundColor = "#f1f4f6"; // Change color on hover
                                                                e.currentTarget.style.transform = "scale(1.05)"; // Slightly enlarge on hover
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.color="white"
                                                                e.currentTarget.style.backgroundColor = "#3c5d87"; // Revert color
                                                                e.currentTarget.style.transform = "scale(1)"; // Reset size
                                                            }}
                                                        >
                                                            <span style={{ fontWeight: "bold" }}>SCAN DOCUMENT</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {selectedSearchFilter.show && <div className="col-3">
                    <div style={searchContainerStyle}>
                        <i className="fas fa-search" style={searchIconStyle}></i>
                        <input
                            type="text"
                            style={searchInputStyle}
                            placeholder="SEARCH..."
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ border: "1px solid #ccc", borderRadius: '20px', marginRight: "10px", marginTop: "10px" }}>
                        <h5 className="m-3">Search filters</h5>
                        <form>
                            <div className="mb-2 mx-2">
                                {selectedSearchFilter.searchFilters.map((filter, index) => (
                                    <div className="form-check" key={index}>
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name={filter.name}
                                            id={filter.name}
                                            value={filter.name}
                                            checked={searchedDocumentType === filter.name}
                                            onChange={(e) => setSearchedDocumentType(e.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="fullTime">
                                            {filter.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>
                </div>}
            </div>
            <div>
                {modifyModal &&
                    <UpdateDocumentModal
                        modalIsOpen={modifyModal}
                        toggleModal={toggleModifyModal}
                        data={updateData}
                        handleUpdate={handleUpdate}
                        docType={selectedDocumentType}
                        token={token}
                    />}
                {deleteModal &&
                    <DeleteDocumentModal
                        modalIsOpen={deleteModal}
                        toggleModal={toggleDeleteModal}
                        data={deleteData}
                        handleDelete={handleDeleteDocument}
                    />}
            </div>
            <div>
                {showDocumentModal &&
                    <ViewDocumentModal
                        modalIsOpen={showDocumentModal}
                        toggleModal={toggleShowDocumentModal}
                        docType={selectedDocumentType}
                        document={viewData} />}
            </div>
            <ToastContainer />
        </div>
    )
}

export default ViewAdminAllScannedDocument