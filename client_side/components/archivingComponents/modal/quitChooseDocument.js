import { Modal, } from 'reactstrap';

const QuitChooseDocumentTypeModal = ({ modalIsOpen, toggleModal }) => {
    return (
            <Modal isOpen={modalIsOpen} toggle={toggleModal} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh'}} >
                <div className='mx-3'>
                    <div className='mt-4'>
                        <p style={{ color: '#083156', fontSize: "24px", fontWeight: "bold" }}>Are you sure you want to quit ?</p>
                    </div>
                    <div className='row mb-4'>
                        <div className='col-6'>
                            <button className="btn btn-dark" style={{ backgroundColor: "#FFFFFF", borderColor: "#3f628e", }} onClick={toggleModal}><span style={{ fontWeight: "bold", color: "#3f628e", marginRight: "85px", marginLeft: "85px" }}>QUIT</span></button>
                        </div>
                        <div className='col-6'>
                            <button className="btn btn-dark" style={{ backgroundColor: "#3f628e", borderColor: "#3f628e" }}><span style={{ fontWeight: "bold", marginRight: "60px", marginLeft: "60px" }}>CONTINUE</span></button>
                        </div>
                    </div>
                </div>
            </Modal>
    );
};

export default QuitChooseDocumentTypeModal;
