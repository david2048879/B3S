import { useState } from 'react';
import { Modal, } from 'reactstrap';
import { toast } from 'react-toastify';
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import axios from 'axios';
import { API } from '../../../config';
const ModifyDocumentTypeModal = ({ modalIsOpen, toggleModal, data, id, token }) => {
    const [editRows, setEditRows] = useState([]);
    const [updateData, setUpdateData] = useState([]);
    const handleChange = (index, field, value) => {
        const newData = [...updateData];
        newData[index][field] = value;
        setUpdateData(newData);
    };
    const handleModifyClick = (index) => {
        setEditRows((prevEditRows) => {
            const updatedEditRows = [...prevEditRows];
            updatedEditRows[index] = !updatedEditRows[index];
            setUpdateData((prevUpdateData) => {
                const updatedData = [...prevUpdateData];
                updatedData[index] = { ...data[index], name: data[index].name, minLength: data[index].minLength, maxLength: data[index].maxLength };
                return updatedData;
            });
            return updatedEditRows;
        });
    };
    const handleUpdateOne = async (dataToUpdate, index) => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await axios.put(`${API}/archive/document/type/modify`, {
                "id": id, "data": dataToUpdate
            }, config);
            data[index].name = updateData[index].name;
            data[index].minLength = updateData[index].minLength;
            data[index].maxLength = updateData[index].maxLength;
            data[index].docDataType = updateData[index].docDataType;
            handleModifyClick(index)
            toast.success("successfully updated data!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });

        } catch (error) {
            console.log(error);
            toast.error("Failed to update dates!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
        }
    }

    return (
        <Modal isOpen={modalIsOpen} toggle={toggleModal} size='lg'>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB", borderRadius: "10px" }}>
                        <span style={{ color: "#0068D1" }}>
                            Document type properties
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
            <div className='container'>

                <table className="table table-active" style={{ color: "#3d4d5c" }}>
                    <thead>
                        <tr className="table-primary">
                            <th>Name</th>
                            <th>Min Length</th>
                            <th>Max Length</th>
                            <th>data type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((property, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {editRows[index] ? (
                                            <input className="form-control"
                                                type="text"
                                                value={editRows[index] ? updateData[index].name : property.name}
                                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                                            />
                                        ) : (property.name)}
                                    </td>
                                    <td>
                                        {editRows[index] ? (
                                            <input className="form-control"
                                                type="number"
                                                value={editRows[index] ? updateData[index].minLength : property.minLength}
                                                onChange={(e) => handleChange(index, 'minLength', e.target.value)}
                                            />
                                        ) : (
                                            <p className=''>{property.minLength}</p>)}
                                    </td>
                                    <td>
                                        {editRows[index] ? (
                                            <input className="form-control"
                                                type="text"
                                                value={editRows[index] ? updateData[index].maxLength : property.maxLength}
                                                onChange={(e) => handleChange(index, 'maxLength', e.target.value)}
                                            />
                                        ) : (
                                            <p className=''>{property.maxLength}</p>)}
                                    </td>
                                    <td>
                                        {editRows[index] ? (
                                            <select
                                                className="form-control"
                                                value={editRows[index] ? updateData[index].docDataType : property.docDataType}
                                                onChange={(e) => handleChange(index, 'docDataType', e.target.value)}
                                            >
                                                <option value="text">text</option>
                                                <option value="date">date</option>
                                                <option value="Number">Number</option>
                                            </select>

                                        ) : (
                                            <p className=''>{property.docDataType}</p>)}
                                    </td>
                                    <td>
                                        <div className='d-flex flex-row'>
                                            {!editRows[index] ?
                                                (
                                                    <UncontrolledDropdown>
                                                        <DropdownToggle
                                                            role="button"
                                                            size="sm"
                                                        >
                                                            <i className="fa-solid fa-ellipsis"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu className="dropdown-menu-arrow" >
                                                            <DropdownItem onClick={() => handleModifyClick(index)}>
                                                                <div className='d-flex flex-row'>
                                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                                    <p className='mx-3 my-0 py-0 text-'>Modify</p>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                onClick={() => initiateDeleteLeaveModal(index)}
                                                            >
                                                                <div className='d-flex flex-row'>
                                                                    <i className="fa-solid fa-trash"></i>
                                                                    <p className='mx-3 my-0 py-0 text-muted'>Delete</p>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledDropdown>) :
                                                (
                                                    <div className='d-flex flex-row'>
                                                        <button className="btn btn-dark btn-sm" style={{ backgroundColor: "#3f628e", borderColor: "#3f628e", color: "#ffffff" }}
                                                            onClick={() => handleUpdateOne(updateData[index], index)}
                                                        >
                                                            <span style={{ fontWeight: "bold", fontSize: "11px" }}>Apply</span>
                                                        </button>
                                                        <button className="btn btn-danger btn-sm mx-2"
                                                            onClick={() => handleModifyClick(index)}
                                                        >
                                                            <span style={{ fontWeight: "bold", fontSize: "11px" }}>Cancel</span>
                                                        </button>
                                                    </div>
                                                )}
                                        </div>

                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div >
        </Modal >
    );
};

export default ModifyDocumentTypeModal;
