import { Modal, ModalBody, ModalFooter } from 'reactstrap';

const DeleteUserRoleModal = ({ modalIsOpen,info, toggleModal,deleteHandler }) => {
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

      <Modal isOpen={modalIsOpen} toggle={toggleModal} className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <ModalBody>
          <div className="d-flex flex-column align-items-center">
            <p className="font-monospace status-message">Are you sure you want to delete <span className='text-primary'><strong>{info.empNames}</strong></span> as a supervisor</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light mx-2" onClick={toggleModal}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={deleteHandler}>
            Yes,delete from roles
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default DeleteUserRoleModal;
