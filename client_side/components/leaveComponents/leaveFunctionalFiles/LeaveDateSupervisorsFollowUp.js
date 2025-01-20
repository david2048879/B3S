import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ViewDaysModal from '../Modals/viewDaysModal';
import { UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";

const LeaveDateSupervisorFollowUp = ({ data, toggleCalendarView }) => {
    const fullCalendarRef = useRef();
    const [leaveInfo, setLeaveInfo] = useState([])
    const [eventName, setEventName] = useState("")
    const [selectedUser, setSelectedUser] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState({
        start: "",
        end: "",
        daysPlanned: ""
    })
    const [leaveOwner, setLeaveOwner] = useState([])
    const toggleShowModal = () => {
        setShowModal(!showModal)
    }
    const navigateToEventDate = (eventTitle) => {
        setEventName(eventTitle)
        setSelectedUser(eventTitle.split(' ').slice(0, -2).join(' ').trim())
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
            start: clickedLeave.startDate,
            end: clickedLeave.endDate,
            daysPlanned: clickedLeave.daysPlanned
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
        // const mappedLeaveInfo = data.map((leave, index) => ({
        //     name: `{} ${index + 1}`,
        //     startDate: leave.startDate.split('T')[0],
        //     endDate: leave.endDate.split('T')[0],
        //     daysPlanned: leave.daysPlanned
        // }));
        let mappedLeaveInfo = [];
        for (let i = 0; i < data.length; i++) {
            for (let a = 0; a < data[i].plannedDates.length; a++) {
                mappedLeaveInfo.push({
                    approved: data[i].supervisorValidated,
                    name: `plan ${a + 1}`,
                    owner: `${data[i].staff.empNames}`,
                    startDate: data[i].plannedDates[a].startDate.split('T')[0],
                    endDate: data[i].plannedDates[a].endDate.split('T')[0],
                    daysPlanned: data[i].plannedDates[a].daysPlanned
                })
            }
        }
        const newArray = mappedLeaveInfo.reduce((acc, current) => {
            const existingOwner = acc.find(item => item.owner === current.owner);
            if (!existingOwner) {
                acc.push({ owner: current.owner, plans: [current.name] });
            } else {
                existingOwner.plans.push(current.name);
            }
            return acc;
        }, []);

        console.log("new array ", newArray);
        console.log(mappedLeaveInfo);
        setLeaveOwner(newArray)
        setLeaveInfo(mappedLeaveInfo);
    }, [data]);
    return (
        <div className="card rounded-3 shadow-sm" style={{ width: "119%",height:"600px" }}>
            <table className="table table-borderless">
                <thead>
                    <tr className="table-primary">
                        <td>User Leave plan request information</td>
                    </tr>
                </thead>
            </table>
            <div className='row'>
                <div className='col-2'>
                    <div className='d-flex justify-content-start'>
                        <button className='btn btn-dark btn-sm mx-2' onClick={toggleCalendarView}>Back</button>
                    </div>
                    <div className='d-flex justify-content-center mt-1'>
                        <p className='text-dark display-6'>Staff</p>
                    </div>
                    <div className=' mt-0'>
                        {leaveOwner.map((leave, index) => {
                            return (
                                <>
                                    <div style={{ maxHeight: "100%", minHeight: "100%", overflowY: "auto" }} className='mx-1'>
                                    <button className={`btn btn-sm  my-1 ${eventName.split(' ').slice(0, -2).join(' ').trim() === `${leave.owner}` ? 'btn-primary' : 'btn-outline-primary'}`} id={`plan${index}`}><small>{leave.owner} </small></button>
                                    <UncontrolledPopover
                                        placement="right"
                                        target={`plan${index}`}
                                        trigger="legacy"
                                    >
                                        <PopoverBody>
                                            <div className="d-flex flex-column">
                                                {leave.plans.map((plan, planIndex) => (
                                                    <button type="button" key={planIndex} className="btn btn-success mt-1"
                                                        onClick={() => navigateToEventDate(`${leave.owner} ${plan}`)}
                                                    >
                                                        {plan}
                                                    </button>))}
                                            </div>
                                        </PopoverBody>
                                    </UncontrolledPopover>
                                    </div>
                                </>
                            )
                        })}

                    </div>
                </div>
                <div className='col-10' style={{ height: "410px" }}>
                    <FullCalendar
                        ref={fullCalendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        height="131%"
                        initialView="dayGridMonth"
                        events={leaveInfo.map((leave, index) => {
                            return {
                                title: `${leave.owner} ${leave.name}`,
                                start: leave.startDate,
                                end: leave.endDate,
                                backgroundColor: leave.owner === selectedUser ? '#008000' : leave.approved ? 'black' : '3788d8',
                                borderColor: leave.owner === selectedUser ? '#008000' : leave.approved ? 'black' : '3788d8',
                            }
                        })}
                        validRange={validRange}
                        contentHeight="100%"
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
        </div>
    );
};

export default LeaveDateSupervisorFollowUp;
