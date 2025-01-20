import { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { formatTextDateInput } from '../../../helpers/dateHelper';
import { checkIfIsAWeekendHowManyDaysShouldBeAdded } from '../../../helpers/leaveHelpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API } from '../../../config';

const StaffUpdateDatesModal = ({ modalIsOpen, token, toggleModal, info, remainingDays }) => {
  const [planDate, setPlanDate] = useState({
    startDate: "",
    endDate: "",
    daysPicked: 0
  })
  const [maximumDate,setMaximumDate]=useState()
  const [activateConfirm, setActivateConfirm] = useState(false)
  const countWeekenddays = (startDate, endDate) => {
    let weekenddaysCount = 0;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekenddaysCount++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekenddaysCount;
  }
  const calculateMaxEndDate = () => {
    if (planDate.startDate && info.daysTaken) {
      const startDate = new Date(planDate.startDate);
      let daysToCount = info.daysTaken + remainingDays;
      let daysToTake = info.daysTaken + remainingDays - 1
      let currentDate = new Date(startDate);
      while (daysToCount > 0) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          daysToTake++
        }
        daysToCount--;
        currentDate.setDate(currentDate.getDate() + 1);
      }
      const weekendCheckInOffs = checkIfIsAWeekendHowManyDaysShouldBeAdded(new Date(startDate.getTime() + (daysToTake * 24 * 60 * 60 * 1000)));
      let addOnDays = 0
      if (weekendCheckInOffs.check) {
        addOnDays = 2
      }
      const total = daysToTake + addOnDays
      const maxDate = new Date(startDate.getTime() + (total * 24 * 60 * 60 * 1000));
      const md=formatTextDateInput(maxDate)
      setMaximumDate(md)
      return maxDate.toISOString().split('T')[0];
    }
  }


  useEffect(() => {
    calculateMaxEndDate()
  }, [planDate.startDate])

  const handleChanges = (e, dateType) => {
    if (dateType === "startDate") {
      const check = checkForWeekendDays(e.target.value, dateType)
      if (check) {
        setPlanDate({ ...planDate, startDate: e.target.value })
      }
    }
    else {
      if (dateType === "endDate") {
        const check = checkForWeekendDays(e.target.value, dateType)
        if (check) {
          handleEndDateChange(e.target.value)
        }
      }
    }
  }
  const checkForWeekendDays = (value, dateType) => {
    const givenDate = new Date(value).getDay()
    if (givenDate === 0 || givenDate === 6) {
      toast.error(`${dateType.split(/(?=[A-Z])/).join(' ')} cannot be a weekend day,choose Another`, {
        position: toast.POSITION.TOP_LEFT, autoClose: 5000
      });
      return false
    }
    return true;
  }

  const handleEndDateChange = (value) => {
    const timeDiff = Math.max(Math.abs(new Date(planDate.startDate).getTime() - new Date(value).getTime()));
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    diffDays = diffDays + 1;
    const weekendDays = countWeekenddays(planDate.startDate, new Date(value))
    const pickedDays = diffDays - weekendDays;
    const checkOverlapping = overlappingDates(value);
    if (checkOverlapping) {
      toast.error("Dear staff dates are overlapping from your previous plan!", {
        position: toast.POSITION.TOP_RIGHT, autoClose: 10000
      });
    }
    else {
      setPlanDate({ ...planDate, endDate: value, daysPicked: pickedDays })
    }
  }

  const overlappingDates = (value) => {
    const plannedDates = info.updateData.plannedDates;
    const selectedStartDate = planDate.startDate;
    const selectedEndDate = value;
    let count = 0;

    for (const plannedDate of plannedDates) {
      const plannedStartDate = plannedDate.startDate.split('T')[0];
      const plannedEndDate = plannedDate.endDate.split('T')[0];
      if (
        selectedStartDate <= plannedEndDate &&
        selectedEndDate >= plannedStartDate
      ) {
        if (plannedDate._id === info._id) {
          // If the _id matches, skip this iteration
          continue;
        }
        // Overlap found
        count++;
      }
    }
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  };
  const UpdatePlan = async (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': "application/json",
        'Authorization': `Bearer ${token}`
      }
    }
    const information = {
      startDate: planDate.startDate,
      endDate: planDate.endDate,
      daysPicked: planDate.daysPicked,
      index: info.index,
      id: info.updateData._id
    }
    // console.log(planDate.daysPicked);
    try {
      const response = await axios.put(`${API}/leave/planneddates/staff/update`, information, config)
      toast.success("Successfully updated leave!", {
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

  useEffect(() => {
    if (planDate?.startDate !== "") {
      if (planDate.endDate !== "") {
        setActivateConfirm(true)
      }
      else {
        setActivateConfirm(false)
      }
    }
    else {
      setActivateConfirm(true)
    }
  }, [planDate])


  return (
    <Modal isOpen={modalIsOpen} toggle={toggleModal} className="d-flex align-items-center justify-content-center font-monospace">
      <ModalHeader toggle={() => toggleModal()}>
        <div className="m-2">
          <h4 className="text-primary">Modify leave dates</h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <div>
          <div>
            <form>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    // min={(info.updateData.plannedDates[info.index].endDate).split('T')[0]}
                    className="form-control"
                    value={planDate.startDate ? planDate.startDate : formatTextDateInput(info.startDate)}
                    onChange={(e) => handleChanges(e, "startDate")}
                  />
                </div>

                <div className="form-group col-md-6">
                  <label htmlFor="endDate">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    disabled={!planDate.startDate}
                    min={planDate.startDate}
                    max={maximumDate}
                    className="form-control"
                    value={planDate.endDate ? planDate.endDate : formatTextDateInput(info.endDate)}
                    onChange={(e) => handleChanges(e, "endDate")}
                  />
                </div>
              </div>
            </form>

          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-light mx-2" onClick={toggleModal}>
          Cancel
        </button>
        <button className="btn btn-primary" disabled={!activateConfirm} onClick={UpdatePlan}>
          Yes,Update plan
        </button>
      </ModalFooter>
      <ToastContainer />
    </Modal>
  );
};

export default StaffUpdateDatesModal;
