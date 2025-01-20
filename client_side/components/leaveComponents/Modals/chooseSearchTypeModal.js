import React from 'react';

import { Modal, ModalFooter } from "reactstrap";

const ChooseSearchType = ({ modalIsOpen, toggleModal, data, setData }) => {
    const handleLeaveType = (e) => {
        e.preventDefault();
        setData({...data, name: "Leave type", codeName: "leaveType" });
        toggleModal()
    }
    const handleStaffNames = (e) => {
        e.preventDefault();
        setData({...data, name: "Staff name", codeName: "empNames" });
        toggleModal()
    }
    const handleSelectDepartment = (e) => {
        e.preventDefault();
        setData({...data, name: "Department", codeName: "department" });
        toggleModal()
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='sm'>
            <div>
                <div className="m-2">
                    <h4 className="text-primary"><small>choose Search criteria</small></h4>
                </div>
                <div>
                    <table className="table table-borderless table-hover" style={{ cursor: "pointer" }}>
                        <thead>
                            <tr className='bg-primary table-dark'>
                                <th className='d-flex justify-content-center'>search type</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={data.codeName === "empNames" ? 'table-primary' : ''} onClick={handleStaffNames}>
                                <td>STAFF NAMES</td>
                            </tr>
                            <tr className={data.codeName === "leaveType" ? 'table-primary' : ''} onClick={handleLeaveType}>
                                <td>LEAVE TYPE</td>
                            </tr>
                            {data.role&&<tr className={data.codeName === "department" ? 'table-primary' : ''} onClick={handleSelectDepartment}>
                                <td>Department</td>
                            </tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}

export default ChooseSearchType;
