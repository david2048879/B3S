import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API } from '../../../config';

const RecallLeaveModal = ({ modalIsOpen,token, toggleModal, info}) => {
  const RecallLeave = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    }
    try {
      const response = await axios.put(`${API}/leave/actualleave/annualleave/recall`, info, config)
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
            <p className="font-monospace status-message">Are you sure you want to recall this leave</p>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-light mx-2" onClick={toggleModal}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={RecallLeave}>
            Yes,recall leave
          </button>
        </ModalFooter>
        <ToastContainer />
      </Modal>
    </div>
  );
};

export default RecallLeaveModal;
