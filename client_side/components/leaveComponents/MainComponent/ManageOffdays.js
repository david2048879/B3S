import { useState, useEffect,useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { API } from "../../../config";
import 'react-toastify/dist/ReactToastify.css';
import { checkForDuplicate } from "../../../helpers/leaveHelpers";
import DuplicatesDatesModal from "../Modals/duplicatesDatesModal";
import ViewOffdays from "../leaveFunctionalFiles/viewOffdays";
import {
    WarningTwoTone,
} from "@ant-design/icons";


const ManageOffDays = ({ token }) => {
    const [activeTab, setActiveTab] = useState("pending");
    const [disableConfirm, setDisableConfirm] = useState(false)
    const [foundDuplicatesDate, setFoundDuplicatesdate] = useState([])
    const [disableUpdateAll,setDisableUpdateAll]=useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const childRef = useRef();
    const [data, setData] = useState([{
        day: "",
        comment: ""
    }])
    const toggleModal=()=>{
        setModalIsOpen(!modalIsOpen)
    }
    const handleChange = (index, field, value) => {
        const updatedData = [...data];
        if (field === "day") {
            const daysArray = data.map(item => item.day);
            const check = checkForDuplicate(daysArray, value)
            if (!check) {
                updatedData[index][field] = value;
                setData(updatedData)
            }
            else {
                toast.success("This is a duplicate!", {
                    position: toast.POSITION.TOP_LEFT, autoClose: 5000
                });
            }
        }
        else {
            updatedData[index][field] = value;
            setData(updatedData);
        }
    };
    const handleAddOffDay = () => {
        const lastOff = data[data.length - 1];
        if (lastOff.day.trim() !== "" && lastOff.comment.trim() !== "") {
            setData([...data, {
                day: "",
                comment: ""
            }]);
        } else {
            toast.warning("Please fill in data!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
        }

    };
    const handleDeleteOffDays = (index) => {
        const updateOffDays = data.filter((_, i) => i !== index);
        setData(updateOffDays);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        }
        try {
            const response = await axios.post(`${API}/leave/addoffdays`, data, config)
            toast.success("succesffully saved off days!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
            if (response.data.duplicatesPresent) {
                setFoundDuplicatesdate((prevData) => {
                    const newDuplicateData = [...prevData,response.data.duplicates];
                    return newDuplicateData;
                  });
                toggleModal()
            }
        } catch (error) {
            toast.warning("couldnt save off days!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
            console.log(error)
        }
    }
    useEffect(() => {
        const lastData = data[data.length - 1]
        if (lastData.day.trim() !== "" && lastData.comment.trim() !== "") {
            setDisableConfirm(false)
        } else {
            setDisableConfirm(true)
        }
    }, [data])

    const handleParentButtonClick = () => {
        // Call the function in the child component using the ref
        childRef.current.handleUpdateAll();
      };


    return (
        <>
            <div className="mx-5 mt-4 font-monospace">
                <p><strong> Staff leave request </strong></p>
                <div className="card rounded-3 shadow-sm">
                    <table className="table table-borderless">
                        <thead>
                            <tr className="table-primary">
                                <td>User Leave plan request information</td>
                            </tr>
                        </thead>
                    </table>
                    <div className="">
                        <div className="mb-1">
                            <ul className="nav nav-pills" style={{ width: '100%', cursor: "pointer" }}>
                                <li
                                    className={`nav-link text-dark ${activeTab === 'pending' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('pending')}
                                    style={{
                                        width: '50%',
                                        textAlign: 'center',
                                        borderBottom: activeTab === 'pending' ? '2px solid blue' : 'none',
                                        borderRadius: 0,
                                        backgroundColor: activeTab === 'pending' ? '#ffffff' : '',
                                    }}
                                >
                                    Add off days
                                </li>
                                <li
                                    className={`nav-link text-dark ${activeTab === 'Approved' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('Approved')}
                                    style={{
                                        width: '50%',
                                        textAlign: 'center',
                                        borderBottom: activeTab === 'Approved' ? '2px solid blue' : 'none',
                                        borderRadius: 0,
                                        backgroundColor: activeTab === 'Approved' ? '#ffffff' : '',
                                    }}
                                >
                                    View off days
                                </li>
                            </ul>
                        </div>
                        {activeTab === "pending" ?
                            <div style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
                                <table className="table table-borderless" >
                                    <thead>
                                        <tr className="table-success">
                                            <th>NO.</th>
                                            <th>Dates</th>
                                            <th>Comment</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((pickedOff, index) => (
                                            <tr key={index} >
                                                <td>{index + 1}</td>
                                                <td>
                                                    <div className="form-group">
                                                        <input
                                                            className="form-control"
                                                            type="date"
                                                            value={pickedOff.day}
                                                            onChange={(e) => handleChange(index, 'day', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="form-group">
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            placeholder="ex: Day of heroes"
                                                            value={pickedOff.comment}
                                                            onChange={(e) => handleChange(index, 'comment', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {data.length - 1 !== index ? (
                                                        <button
                                                            className='btn btn-danger btn-sm mx-1'
                                                            onClick={() => handleDeleteOffDays(index)}
                                                        >
                                                            <i className="bi bi-trash" style={{ color: "white", fontSize: '1.3em', fontWeight: 'bold' }}></i>
                                                            <span className="">DELETE</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className='btn btn-primary btn-sm mx-1'
                                                            onClick={() => handleAddOffDay()}
                                                        >
                                                            <span className='mx-2'>New off</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                            : <ViewOffdays token={token} ref={childRef} disableUpdateAll={disableUpdateAll} setDisableUpdateAll={setDisableUpdateAll} />}
                    </div>
                    <div className="card-footer">
                        <div className='d-flex justify-content-end mx-3 mb-0 pb-0'>
                        {activeTab==="pending"? <button className='btn btn-primary btn-sm' disabled={disableConfirm} onClick={handleSubmit} >
                                SAVE
                            </button>: <button className='btn btn-primary btn-sm' disabled={disableUpdateAll}  onClick={handleParentButtonClick}>
                                UPDATE ALL
                            </button>}
                        </div>
                    </div>
                </div>
                <div>
                    <ToastContainer />
                </div>
                <div>
                    {modalIsOpen && <DuplicatesDatesModal
                        modalIsOpen={modalIsOpen}
                        toggleModal={toggleModal}
                        data={foundDuplicatesDate}
                    />}
                </div>
            </div>
        </>
    )
}


export default ManageOffDays