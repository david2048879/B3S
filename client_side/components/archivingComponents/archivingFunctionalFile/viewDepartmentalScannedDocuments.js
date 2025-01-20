import { useEffect, useState, useRef } from "react"
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API } from "../../../config";
import 'react-toastify/dist/ReactToastify.css';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import ViewDocumentModal from "../modal/viewDocumentModal";


const ViewDepartmentalScannedDocument = ({ token, department }) => {
    const [data, setData] = useState([])
    const [documentTypes, setDocumentTypes] = useState([])
    const [documents, setDocuments] = useState([])
    const [showSearchFields, setShowSearchFields] = useState(false)
    const [selectedDocument, setSelectedDocument] = useState()
    const [selectedDocumentType, setSelectedDocumentType] = useState()
    const [dataPresent, setDataPresent] = useState(false)
    const [viewData, setViewData] = useState()
    const [showDocumentModal, setShowDocumentModal] = useState(false)
    const [searchDepartment, setSearchDepartment] = useState("")
    const toggleShowDocumentModal = () => {
        setShowDocumentModal(!showDocumentModal)
    }
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
            const findDepartment = mapToCapitalizedFormat(department)
            setSearchDepartment(findDepartment)
            const filtered = response.data.docTypes.filter(doc => doc.department === findDepartment);
            setDocumentTypes(filtered);
        }
        catch (error) {
            console.log(error);
            // toast.error("System failure", {
            //     position: toast.POSITION.TOP_LEFT, autoClose: 5000
            // });
        }
    }
    const handleChangeDocumentType = async (e) => {
        const selected = e.target.value
        setSelectedDocument(selected)
        const filtered = data.filter(doc => doc.department === searchDepartment && doc.docType === selected);
        setSelectedDocumentType(filtered[0])
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
        }
        catch (error) {
            console.log(error);
            toast.error("System failure", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
        }
    }

    const initiateViewModal = (data) => {
        setShowDocumentModal(true)
        setViewData(data)
    }

    const departmentMapping = {
        "Finance": "FINANCE DEPARTMENT",
        "Executive": "EXECUTIVE DEPARTMENT",
        "Retail Banking": "RETAIL BANKING DEPARTMENT",
        "Operations": "OPERATIONS DEPARTMENT",
        "Sales Team": "SALES TEAM DEPARTMENT",
        "Branch Leadership": "BRANCH LEADERSHIP DEPARTMENT",
        "Credit": "CREDIT DEPARTMENT",
        "Business": "BUSINESS DEPARTMENT",
        "Recovery": "RECOVERY DEPARTMENT",
        "Marketing": "MARKETING DEPARTMENT",
        "Digital Channel": "DIGITAL CHANNEL DEPARTMENT",
        "Compliance": "COMPLIANCE DEPARTMENT",
        "Internal Audit": "INTERNAL AUDIT DEPARTMENT",
        "Legal": "LEGAL DEPARTMENT",
        "Human Resources": "HUMAN RESOURCES DEPARTMENT",
        "IT": "IT DEPARTMENT",
        "Security": "SECURITY DEPARTMENT",
        "Risk Management": "RISK MANAGEMENT DEPARTMENT"
    };

    const mapToCapitalizedFormat = (shortName) => {
        const capitalizedFormat = departmentMapping[shortName];
        return capitalizedFormat;
    };
    useEffect(() => {
        fetchData();
    }, [])

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div className="mx-5">
                <p className="mx-2"><span style={{ fontWeight: "bold", color: "#001836", fontSize: "19px" }}>Scanned documents</span></p>
            </div>
            <div className=" mx-5 row mt-2" >
                <div className="col">
                    <div className="d-flex flex-column">
                        <p style={{ color: "#083180", fontSize: "15px", fontWeight: "bolder" }}>{searchDepartment}</p>
                        {showSearchFields && <div className="row">
                            <div className="col-6" >
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
                        <div className="d-flex flex-column">
                            <div className="form-group mx-3 mt-2">
                                {dataPresent ?
                                    <div className="" style={{ border: "1px solid #ccc", borderRadius: '20px' }}>
                                        <table className="table mt-3" >
                                            <thead>
                                                <tr className="table-primary">
                                                    {selectedDocumentType && selectedDocumentType.searchFields && selectedDocumentType.searchFields.length > 0 ? (
                                                        <>
                                                            <th>No.</th>
                                                            {selectedDocumentType.searchFields.map(field => {
                                                                const formattedFieldName = field.name
                                                                    .toLowerCase()
                                                                    .split('_')
                                                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                                                    .join(' ');

                                                                return <th key={field.name}>{formattedFieldName}</th>;
                                                            })}
                                                            <th>Action</th>
                                                        </>
                                                    ) : (
                                                        <th colSpan={10}>No Fields Available</th>
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {documents && documents.length > 0 ? (
                                                    documents.map((documentType, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            {selectedDocumentType && selectedDocumentType.searchFields && selectedDocumentType.searchFields.length > 0 ? (
                                                                selectedDocumentType.searchFields.map(field => (
                                                                    <td key={field.name}>{documentType.documentFields[field.name]}</td>
                                                                ))
                                                            ) : (
                                                                <th colSpan={10}>No data available</th>
                                                            )}
                                                            <td>
                                                                <span
                                                                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                                                                    className="text-primary"
                                                                    onClick={() => initiateViewModal(documentType)}
                                                                >
                                                                    Show details
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={10}>Loading data or no documents available</td>
                                                    </tr>
                                                )}

                                            </tbody>
                                        </table>
                                    </div>
                                    : (
                                        <div>
                                            <div className="mt-2" style={{ border: "1px solid #ccc", borderRadius: '20px' }}>
                                                <div style={{ marginTop: "80px" }}>
                                                    <div className="d-flex justify-content-center">
                                                        <p style={{ fontSize: "32px", color: "#083156", fontWeight: "bolder" }}>No item found</p>
                                                    </div>
                                                    <p className="mt-2 mx-auto text-center" style={{ maxWidth: '600px', fontSize: "16px", color: "#3d4d5c" }}>
                                                        No document type found in the database. This could be because you haven't inserted any document type. Please ensure that you add document types before searching.
                                                    </p>
                                                    <div className="mt-2 mb-4 d-flex justify-content-center">
                                                        <button className="btn btn-dark" style={{ backgroundColor: "#F1F4F6", borderColor: "#F1F4F6", color: "#3c5d87" }} ><span style={{ fontWeight: "bold" }}>ADD DOCUMENT TYPE</span></button>
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

export default ViewDepartmentalScannedDocument