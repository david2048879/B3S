import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ViewDaysModal from '../Modals/viewDaysModal';

const LeaveDatesCalendarView = ({ data, toggleCalendarView }) => {
    const fullCalendarRef = useRef();
    const [leaveInfo,setLeaveInfo]=useState([])
    const [eventName, setEventName] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [info,setInfo]=useState({
        start:"",
        end:"",
        daysPlanned:""
    })
    const toggleShowModal = () => {
        setShowModal(!showModal)
    }
    const navigateToEventDate = (eventTitle) => {
        setEventName(eventTitle)
        const fullCalendarApi = fullCalendarRef.current.getApi();
        const event1 = fullCalendarApi.getEvents().find((event) => event.title === eventTitle);
        // Check if the event was found
        if (event1) {
            fullCalendarApi.changeView('dayGridMonth');
            fullCalendarApi.gotoDate(event1.start);
        }
    };
    const handleEventClick = (eventClickInfo) => {
        const { event } = eventClickInfo;
        const clickedLeave = leaveInfo.find((leave) => leave.name === event.title);
        setInfo({
            start:clickedLeave.startDate,
            end:clickedLeave.endDate,
            daysPlanned:clickedLeave.daysPlanned
        })
        setShowModal(true)
    };
    const handleEventMouseEnter = (eventMouseEnterInfo) => {
        const { el } = eventMouseEnterInfo;
        el.style.cursor = 'pointer'; // Set cursor to pointer on mouse enter
    };

    const handleEventMouseLeave = (eventMouseLeaveInfo) => {
        const { el } = eventMouseLeaveInfo;
        el.style.cursor = ''; // Reset cursor on mouse leave
    };
    const validRange = {
        start: '2023-12-01',
        end: '2024-12-31',
    };
    useEffect(() => {
        const mappedLeaveInfo = data.plannedDates.map((leave, index) => ({
            name: `Leave ${index + 1}`,
            startDate: leave.startDate.split('T')[0],
            endDate: leave.endDate.split('T')[0],
            daysPlanned: leave.daysPlanned
        }));
    
        setLeaveInfo(mappedLeaveInfo);
    }, [data]);
    return (
        <div className='row'>
            <div className='col-3'>
                <div className='d-flex justify-content-start'>
                    <button className='btn btn-outline-dark btn-sm mx-2' onClick={toggleCalendarView}>Back in tabular view</button>
                </div>
                <div className='d-flex justify-content-center mt-3'>
                    <p className='text-dark display-6'>Leaves</p>
                </div>
                <div className='mx-2 mt-2'>
                    {leaveInfo.map((leave, index) => {
                        return (
                            <button className={`btn mx-2 px-5 my-1 ${eventName === `Leave ${index + 1}` ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => navigateToEventDate(leave.name)}>Leave {index + 1}</button>
                        )
                    })}

                </div>
            </div>
            <div className='col-9' style={{ height: "410px" }}>
                <FullCalendar
                    ref={fullCalendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    height="100%"
                    initialView="dayGridMonth"
                    events={leaveInfo.map((leave, index) => {
                        return {
                            title: `Leave ${index + 1}`,
                            start: leave.startDate,
                            end: leave.endDate,
                        }
                    })}
                    validRange={validRange}
                    contentHeight="100%"
                    eventClick={handleEventClick}
                    eventMouseEnter={handleEventMouseEnter}
                    eventMouseLeave={handleEventMouseLeave}
                />
            </div>
            {showModal && <ViewDaysModal
                toggleModal={toggleShowModal}
                modalIsOpen={showModal}
                data={info}
                />}
        </div>

    );
};

export default LeaveDatesCalendarView;
