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
import UpdateDocumentModal from "../modal/updateDocumentModal";
import DeleteDocumentModal from "../modal/deleteDocumentModal";



const ViewScannedDocument = ({ token }) => {
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
    const [deleteData, setDeleteData] = useState({
        documentName:"",
        id:""
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
        setSearchDepartment(department)
        const filtered = data.filter(doc => doc.department === department);
        setDocumentTypes(filtered);
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
    const initiateModifyModal = (data) => {
        setUpdateData(data)
        setModifyModal(true)
    }
    const initiateDeleteModal = (data) => {
        setDeleteData({
            id:data._id,
            documentName:data.docType.docType})
        setDeleteModal(true)
    }
    const handleUpdate=async(e,processData,id)=>{
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
            const response = await axios.post(`${API}/archive/scanned/update`, {processData,id}, config)
            toast.update(toastId.current, { render: "Successfully Updated document", type: toast.TYPE.SUCCESS, autoClose: 2000 })
            const fetchResponse = await axios.post(`${API}/archive/scanned/documents`, { department: searchDepartment, docType: selectedDocument }, config)
            setDataPresent(fetchResponse.data.dataPresent)
            setDocuments(fetchResponse.data.documents)
            setModifyModal(false)
        } catch (error) {
            toast.update(toastId.current, { render: "Failure", type: toast.TYPE.ERROR, autoClose: 2000 })
        }
        
    }
    const handleDeleteDocument=async(e,id)=>{
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
    useEffect(() => {
        fetchData();
    }, [modifyModal])

    return (
        <div style={{ fontFamily: "monospace" }}>
            <div className="mx-5">
                <p className="mx-2"><span style={{ fontWeight: "bold", color: "#001836", fontSize: "19px" }}>Scanned documents</span></p>
            </div>
            <div className=" mx-5 row mt-2" >
                <div className="col">
                    <div className="d-flex flex-column">
                        <p style={{ color: "#083156", fontSize: "15px", fontWeight: "bolder" }}>Search criterias</p>
                        {showSearchFields && <div className="row">
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
                                                {documents.map((documentType, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            {selectedDocumentType.searchFields.map(field => (
                                                                <td key={field.name}>{documentType.documentFields[field.name]}</td>
                                                            ))}
                                                            <td>
                                                                <UncontrolledDropdown>
                                                                    <DropdownToggle
                                                                        role="button"
                                                                        size="sm"
                                                                        color=""
                                                                        onClick={(e) => e.preventDefault()}
                                                                    >
                                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu className="dropdown-menu-arrow" end>
                                                                        <DropdownItem
                                                                            onClick={() => initiateModifyModal(documentType)}
                                                                        >
                                                                            <div className='d-flex flex-row'>
                                                                                <i className="fa-solid fa-pen-to-square"></i>
                                                                                <p className='mx-3 my-0 py-0 text-muted'><strong>Modify</strong></p>
                                                                            </div>
                                                                        </DropdownItem>
                                                                        <DropdownItem
                                                                            onClick={() => initiateDeleteModal(documentType)}
                                                                        >
                                                                            <div className='d-flex flex-row'>
                                                                                <i className="fa-solid fa-trash"></i>
                                                                                <p className='mx-3 my-0 py-0 text-muted'><strong>Delete</strong></p>
                                                                            </div>
                                                                        </DropdownItem>
                                                                        <DropdownItem
                                                                            onClick={() => initiateViewModal(documentType)}
                                                                        >
                                                                            <div className='d-flex flex-row'>
                                                                                <i className="fa-solid fa-eye"></i>
                                                                                <p className='mx-3 my-0 py-0 text-muted'><strong>Show properties</strong></p>
                                                                            </div>
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </UncontrolledDropdown>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
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

export default ViewScannedDocument