import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from "react-toastify";



const CalendarView = ({ leaveInfo, setLeaveInfo, toggleCalendarView }) => {
    const fullCalendarRef = useRef()
    const [activateWarning, setActivateWaraning] = useState(false)
    const [eventName, setEventName] = useState("")
    const [colorEvent, setColorEvent] = useState("")
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
    const handleEventDrop = (eventDropInfo) => {
        const { event } = eventDropInfo;
        setColorEvent(event.title)
        // Find the index of the dragged event in the leaveInfo array
        const eventIndex = leaveInfo.findIndex((leave) => leave.name === event.title);
        const startdate=new Date(event.start)
        // console.log(date);
        // Update the start and end dates in the leaveInfo array
        if (eventIndex !== -1) {
            const updatedLeaveInfo = [...leaveInfo];
            if (!isWeekend(startdate)) {
                updatedLeaveInfo[eventIndex].startDate = event.start.toISOString().split('T')[0];
                updatedLeaveInfo[eventIndex].endDate = event.end ? event.end.toISOString().split('T')[0] : event.start.toISOString().split('T')[0];
                setLeaveInfo(updatedLeaveInfo);
                setActivateWaraning(false)
            } else {
                toast.success("Leave dates can not start in the weekend !", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000
                });
                setActivateWaraning(true)
            }
        }

    };
    const isWeekend = (date) => {
        const dayOfWeek = new Date(date).getDay();
        return dayOfWeek === 0 || dayOfWeek === 6; // 0 is Sunday, 6 is Saturday
    };
    const validRange = {
        start: '2023-12-01',
        end: '2024-12-31',
    };
    return (
        <div className='row'>
            <div className='col-3'>
                <div className='d-flex justify-content-start'>
                    <button className='btn btn-dark btn-sm' onClick={toggleCalendarView}>Back</button>
                </div>
                <div className='d-flex justify-content-center mt-3'>
                    <p className='text-dark display-6'>Leaves</p>
                </div>
                <div className='mx-2 mt-2'>
                    {leaveInfo.map((leave, index) => {
                        return (
                            <button className={`btn mx-2 px-5 my-1 ${eventName === leave.name ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => navigateToEventDate(leave.name)}>{leave.name}</button>
                        )
                    })}

                </div>
            </div>
            <div className='col-9' style={{ height: "500px" }}>
                <FullCalendar
                    ref={fullCalendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    height="100%"
                    initialView="dayGridMonth"
                    events={leaveInfo.map((leave, index) => {
                        return {
                            title: leave.name,
                            start: leave.startDate,
                            end: leave.endDate,
                            color: colorEvent === leave.name && activateWarning ? "red" : "",
                        }
                    })}
                    editable={true}
                    eventDrop={handleEventDrop}
                    eventResizableFromStart={false}
                    eventDurationEditable={false}
                    validRange={validRange}
                />
            </div>
        </div>

    );
};

export default CalendarView;
