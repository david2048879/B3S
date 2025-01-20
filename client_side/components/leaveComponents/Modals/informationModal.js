import React from 'react';

import { Modal } from "reactstrap";

const InformationModal = ({ modalIsOpen, toggleModal, message,heading }) => {

    return (
        <div>
            <style>
                {`
          .status-message {
            margin-top: 10px;
            font-size: 1.2rem;  
            color: #333;   
          }
        `}
            </style>
            <Modal isOpen={modalIsOpen} toggle={() => toggleModal()} className="d-flex align-items-center justify-content-center font-monospace" size='md' style={{ minHeight: '100vh' }}>
                <div>
                    <div className="m-2">
                        <h4 className="text-primary"><small>!Important notice</small></h4>
                    </div>
                    <div>
                        <table className="table table-borderless" style={{ cursor: "pointer" }}>
                            <thead>
                                <tr className='bg-primary table-dark'>
                                    <th className='d-flex justify-content-center'>{heading}</th>
                                </tr>
                            </thead>
                        </table>
                        <div className="d-flex flex-column align-items-center mx-3">
                            <p className="font-monospace status-message">{message}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default InformationModal;
