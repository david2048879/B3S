import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API } from '../../../config';

const ActualLeaveDelete = ({ modalIsOpen, token, toggleModal, info }) => {
  const deletePlan = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    }
    try {
      const response = await axios.put(`${API}/leave/actualleave/deleteleave`, info, config)
      toast.success("Successfully saved leave!", {
        position: toast.POSITION.TOP_LEFT, autoClose: 10000
      });
      toggleModal()
    } catch (error) {
      toast.warning("Failed!", {
        position: toast.POSITION.TOP_LEFT, autoClose: 10000
      });
      console.log(error);
    }
  }
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
            <p className="font-monospace status-message">Are you sure you want to delete request</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light mx-2" onClick={toggleModal}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={deletePlan}>
            Yes,delete leave
          </button>
        </ModalFooter>
        <ToastContainer />
      </Modal>
    </div>
  );
};

export default ActualLeaveDelete;
