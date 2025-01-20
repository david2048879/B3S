import { useEffect, useState, useRef } from "react"
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { API } from "../../../config";
import 'react-toastify/dist/ReactToastify.css';
import ShowPropertiesModal from "../modal/showPropertiesModal";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import DocumentTypePropertiesModal from "../modal/modifyDocumentTypeProperties";



const ViewDocumentType = ({ token,setNavigation }) => {
    const [data, setData] = useState([])
    const [modifyModal, setModifyModal] = useState(false)
    const [dataPresent, setDataPresent] = useState(false)
    const [properties, setProperties] = useState()
    const [showProperties, setShowProperties] = useState({
        visible: false,
        data: {}
    })
    const [searchCriterias, setSearchCriterias] = useState({
        department: "",
        docType: ""
    })
    const toggleModifyModal = () => {
        setModifyModal(!modifyModal)
    }
    const toggleShowProperties = () => {
        setShowProperties({ ...showProperties, visible: !showProperties.visible })
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
            setDataPresent(response.data.dataPresent)
            console.log(response.data);
        }
        catch (error) {
            console.log(error);
            // toast.error("System failure", {
            //     position: toast.POSITION.TOP_LEFT, autoClose: 5000
            // });
        }
    }

    const initiateViewPropertiesModal = (data) => {
        setShowProperties({
            visible: true,
            data: data
        })
    }
    const initiateModifyModal = (data) => {
        setProperties(data)
        setModifyModal(true)
    }
    useEffect(() => {
        fetchData();
    }, [modifyModal])
    const filteredData = dataPresent && data.filter(searchedDocs => {
        return (searchCriterias.docType === "" || searchedDocs.docType.toLowerCase().includes(searchCriterias.docType.toLowerCase())) &&
            (searchCriterias.department === "" || searchedDocs.department === searchCriterias.department);
    });
    return (
        <div style={{ fontFamily: "monospace" }}>
            <div className=" d-flex flex-row mx-5">
                <p> <span style={{ fontWeight: "bolder", fontSize: "0.6em", color: "black", cursor: "pointer" }}><i className="fa-solid fa-less-than"></i></span></p>
                <p className="mx-2"><span style={{ fontSize: "19px", fontWeight: "bolder", color: "#8c96a1", cursor: "pointer" }}>Document operations</span> / <span style={{ fontWeight: "bold", color: "#001836", fontSize: "19px" }}>list of document types</span></p>
            </div>
            <div className=" mx-5 row mt-2" >
                <div className="col">
                    <div className="d-flex flex-column">
                        <p style={{ color: "#083156", fontSize: "15px", fontWeight: "bolder" }}>Search criterias</p>
                        <div className="row">
                            <div className="col-6">
                                <div className="d-flex flex-column">
                                    <div class="input-group mx-3 mt-2">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">
                                                <i className="fa-solid fa-building" style={{ color: "#1e3050" }}></i>
                                            </span>
                                        </div>
                                        <select className="form-control" id="department" value={searchCriterias.department} onChange={(e) => setSearchCriterias({ ...searchCriterias, department: e.target.value })}>
                                            <option>Choose</option>
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
                                <div className="input-group mx-3 mt-2" >
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">
                                            <i className="fa-solid fa-building" style={{ color: "#1e3050" }}></i>
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" placeholder="document name...." value={searchCriterias.docType} onChange={(e) => setSearchCriterias({ ...searchCriterias, docType: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="form-group mx-3 mt-2">
                                {dataPresent ?
                                    <div className=""  
                                    style={{
                                        border: "1px solid #ccc",
                                        borderRadius: "20px",
                                        backgroundColor: "#f9fafc",
                                        padding: "40px",
                                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                                    }}>
                                        <table className="table mt-3" >
                                            <thead>
                                                <tr className="table-primary">
                                                    <th>NO.</th>
                                                    <th>Document name</th>
                                                    <th>Department</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredData.map((documentType, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{documentType.docType}</td>
                                                            <td>{documentType.department}</td>
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
                                                                            onClick={() => initiateShowLeaveDetails(pendingLeave)}
                                                                        >
                                                                            <div className='d-flex flex-row'>
                                                                                <i className="fa-solid fa-trash"></i>
                                                                                <p className='mx-3 my-0 py-0 text-muted'><strong>Delete</strong></p>
                                                                            </div>
                                                                        </DropdownItem>
                                                                        <DropdownItem
                                                                            onClick={() => initiateViewPropertiesModal(documentType)}
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
                                                            No Document Type available yet
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
                                                        It seems that no document types have been inserted into the system. Please ensure that the admin insert a new document type.
                                                    </p>
                                                    <div className="mt-4 mb-4 d-flex justify-content-center">
                                                        <button
                                                        onClick={()=>setNavigation("ADD NEW DOCUMENT TYPE")}
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
                                                            <span style={{ fontWeight: "bold" }}>ADD NEW DOCUMENT TYPE</span>
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
            </div>
            <div>
                {modifyModal &&
                    <DocumentTypePropertiesModal
                        modalIsOpen={modifyModal}
                        toggleModal={toggleModifyModal}
                        data={properties.searchFields}
                        id={properties._id}
                        token={token}
                    />}
            </div>
            <div>
                {showProperties.visible &&
                    <ShowPropertiesModal
                        modalIsOpen={showProperties.visible}
                        toggleModal={toggleShowProperties}
                        data={showProperties.data} />}
            </div>
            <ToastContainer />
        </div>
    )
}

export default ViewDocumentType