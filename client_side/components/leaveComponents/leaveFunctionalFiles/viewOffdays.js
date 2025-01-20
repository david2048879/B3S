import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import {
    WarningTwoTone,
    EllipsisOutlined,
    EditOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { API } from "../../../config";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { formatTextDateInput } from "../../../helpers/dateHelper";
import axios from "axios";
import { checkForDuplicate } from "../../../helpers/leaveHelpers";

const ViewOffdays = forwardRef(({ token, disableUpdateAll, setDisableUpdateAll }, ref) => {
    const [data, setData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [updateData, setUpdateData] = useState([{
        day: "",
        comment: ""
    }]);
    const [dataPresent, setDataPresent] = useState(false);
    const [editRows, setEditRows] = useState([]);
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await axios.get(`${API}/leave/viewoffdays`, config);
            setDataPresent(response.data.dataPresent);
            setData(response.data.alloff);
        } catch (error) {
            console.log(error);
        }

    }
    useEffect(async () => {
        fetchData()
    }, []);
    const handleChange = (index, field, value) => {
        const newData = [...updateData];
        if (field === "day") {
            const daysArray = updateData.filter(date => date !== undefined).map(item => formatTextDateInput(item.day));
            const check = checkForDuplicate(daysArray, value)
            const daysInDBArray = data.map(dbDays => formatTextDateInput(dbDays.day))
            const checkForDuplicateInDB = checkForDuplicate(daysInDBArray, value)
            if (!check && !checkForDuplicateInDB) {
                newData[index][field] = value;
                setUpdateData(newData)
            }
            else {
                toast.success("This is a duplicate!", {
                    position: toast.POSITION.TOP_LEFT, autoClose: 5000
                });
            }
        }
        else {
            newData[index][field] = value;
            setUpdateData(newData);
        }
    };

    const handleModifyClick = (index) => {
        setEditRows((prevEditRows) => {
            const updatedEditRows = [...prevEditRows];
            updatedEditRows[index] = !updatedEditRows[index];
            setUpdateData((prevUpdateData) => {
                const updatedData = [...prevUpdateData];
                updatedData[index] = { ...data[index], comment: data[index].comment, day: formatTextDateInput(data[index].day) };
                return updatedData;
            });
            return updatedEditRows;
        });
    };

    const handleUpdateAll = async () => {
        let updateArray = [];
        updateData = updateData.filter(date => date !== undefined).filter(date => date.comment !== "")
        for (let i = 0; i < updateData.length; i++) {
            let isDuplicate = false;
            for (let a = 0; a < data.length; a++) {
                if (
                    updateData[i].comment === data[a].comment &&
                    formatTextDateInput(updateData[i].day) === formatTextDateInput(data[a].day)
                ) {
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
                updateArray.push(updateData[i]);
            }
        }
        // console.log("update array",updateArray);
        try {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.put(`${API}/leave/offdays/updatemany`, updateArray, config);
            toast.success("successfully updated data!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
            setEditRows(prevEditRows => {
                const updatedEditRows = prevEditRows.map((value, index) => {
                    return editRows[index] ? false : value;
                });
                return updatedEditRows;
            });
            fetchData()

        } catch (error) {
            console.log(error);
            toast.error("Failed to update dates!", {
                position: toast.POSITION.TOP_LEFT, autoClose: 5000
            });
        }
    };

    const handleUpdateOne = async (dataToUpdate, index) => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await axios.put(`${API}/leave/offdays/updateone`, dataToUpdate, config);
            data[index].comment = updateData[index].comment;
            data[index].day = updateData[index].day;
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

    useImperativeHandle(ref, () => ({
        handleUpdateAll,
    }));

    useEffect(() => {
        let count = 0
        let countComment = 0
        const datedataArray = data.map(days => formatTextDateInput(days.day));
        const dateupdateDataArray = updateData.filter(date => date !== undefined).map(offs => offs.day).filter(date => date !== "")
        const commentdataArray = data.map(days => days.comment);
        const commentupdateDataArray = updateData.filter(offs => offs !== undefined).map(offs => offs.comment).filter(date => date !== "");
        for (let i = 0; i < dateupdateDataArray.length; i++) {
            if (dateupdateDataArray[0] !== "") {
                if (!(datedataArray.includes(dateupdateDataArray[i]))) {
                    count++;
                }
            }
        }
        for (let a = 0; a < commentupdateDataArray.length; a++) {
            if (commentupdateDataArray[0] !== "") {
                if (!(commentdataArray.includes(commentupdateDataArray[a]))) {
                    countComment++;
                }
            }
        }
        if (count > 0 || countComment > 0) {
            setDisableUpdateAll(false)
        }
        else {
            setDisableUpdateAll(true)
        }

    }, [updateData]);


    return (
        <div className="mt-1 font-monospace" style={{ maxHeight: "375px", minHeight: "378px", overflowY: "auto" }}>
            {dataPresent ? (
                <table className="table table-borderless">
                    <thead>
                        <tr className="table-success table-dark">
                            <th>NO.</th>
                            <th>Dates</th>
                            <th>Comment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((info, index) => (
                            <tr key={info._id}>
                                <td>{index + 1}</td>
                                <td>
                                    {editRows[index] ? (
                                        <input
                                        className="form-control"
                                            type="date"
                                            value={editRows[index] ? updateData[index].day : formatTextDateInput(info.day)}
                                            onChange={(e) => handleChange(index, 'day', e.target.value)}
                                        />
                                    ) : (
                                        formatTextDateInput(info.day)
                                    )}
                                </td>
                                <td>
                                    {editRows[index] ? (
                                        <input
                                        className="form-control"
                                            type="text"
                                            value={editRows[index] ? updateData[index].comment : info.comment}
                                            onChange={(e) => handleChange(index, 'comment', e.target.value)}
                                        />
                                    ) : (
                                        info.comment
                                    )}
                                </td>
                                <td>
                                    {!editRows[index] ? (
                                        <UncontrolledDropdown>
                                            <DropdownToggle
                                                role="button"
                                                size="sm"
                                                color=""
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                <EllipsisOutlined style={{ transform: 'rotate(90deg)' }} />
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-arrow" end>
                                                <DropdownItem onClick={() => handleModifyClick(index)}>
                                                    <div className='d-flex flex-row'>
                                                        <EditOutlined />
                                                        <p className='mx-3 my-0 py-0 text-muted'>Modify</p>
                                                    </div>
                                                </DropdownItem>
                                                <DropdownItem
                                                    onClick={() => initiateDeleteLeaveModal(index)}
                                                >
                                                    <div className='d-flex flex-row'>
                                                        <DeleteOutlined />
                                                        <p className='mx-3 my-0 py-0 text-muted'>Delete</p>
                                                    </div>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>)
                                        : (
                                            <div className="d-flex flex-row">
                                                <button className="btn btn-sm btn-primary mx-3"
                                                    onClick={() => handleUpdateOne(updateData[index], index)}
                                                    disabled={
                                                        data[index].comment === updateData[index].comment
                                                        && formatTextDateInput(data[index].day) === updateData[index].day
                                                    }
                                                >
                                                    Apply the changes
                                                </button>
                                                <button className="btn btn-sm btn-light"
                                                    onClick={() => handleModifyClick(index)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            ) : (
                <div>
                    <div className="d-flex justify-content-center mt-5">
                        <div className="d-flex flex-column">
                            <WarningTwoTone style={{ fontSize: "7rem" }} />
                            <p style={{ fontSize: '2rem' }} className="mt-3">No off days</p>
                        </div>
                    </div>
                    <div>
                        <ToastContainer />
                    </div>
                </div>

            )}
        </div>
    );
})

export default ViewOffdays;
