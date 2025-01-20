import React, { useState,useEffect } from 'react';
import { Modal } from 'reactstrap';

const AddTitlePositionModal = ({ modalIsOpen, toggleModal, handleField, index,position }) => {
    const [inputPosition, setInputPosition] = useState(position);
    useEffect(() => {
        setInputPosition(position);
    }, [position]);
    const onConfirm=(e)=>{
        e.preventDefault()
        if(inputPosition===null){
            handleField(index, 'titlePosition',position );
        }
        else{
            handleField(index, 'titlePosition',inputPosition );
        }
        toggleModal()
    }
    return (
        <Modal isOpen={modalIsOpen} toggle={toggleModal} backdrop="static"
            style={{
                maxWidth: '400px', width: '90%', margin: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className='alert mx-4' style={{ backgroundColor: "#EBF3FB", borderRadius: "10px" }}>
                        <span style={{ color: "#0068D1", fontWeight: 'bold' }}>
                            Position
                        </span>
                    </div>
                </div>
                <div className='col-6'>
                    <div className='d-flex justify-content-end'>
                        <div className="mx-3 mt-3">
                            <i className="fa-regular fa-circle-xmark" onClick={onConfirm} style={{ fontSize: "1.5em", cursor: "pointer", color: "#0068D1" }}></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className='m-4'>
                <form >
                    <div className="form-group">
                        <label htmlFor="position" style={{ fontWeight: 'bold', color: "#3d4d5c" }}>Position</label>
                        <input
                            type="number"
                            min={1}
                            id="position"
                            value={inputPosition}
                            className="form-control"
                            placeholder="Enter position"
                            max={position}
                            required
                            disabled
                            onChange={(e) => {
                                setInputPosition(e.target.value);
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-end mt-4">
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#0068D1" }}
                        onClick={onConfirm}
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddTitlePositionModal;
