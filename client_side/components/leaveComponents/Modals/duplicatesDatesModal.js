import React from 'react';
import { Modal, } from "reactstrap";
import { formatTextDateInput } from '../../../helpers/dateHelper';

const DuplicatesDatesModal = ({ modalIsOpen, toggleModal, data, setData }) => {

    return (
        <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='sm'>
            <div>
                <div className="m-2">
                    <h4 className="text-primary"><small>Found duplicates</small></h4>
                </div>
                <div>
                    <table className="table table-borderless" style={{ cursor: "pointer" }}>
                        <thead>
                            <tr className='bg-primary table-dark'>
                                <th className='d-flex justify-content-center'>Duplicate dates</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((offDays, index) => (
                                <tr key={index} className='d-flex justify-content-center'>
                                    <td>{formatTextDateInput(offDays)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}

export default DuplicatesDatesModal;
