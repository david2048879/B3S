import { useState, useEffect } from 'react';
import React from 'react';
import getSidebarItems from '../Constants/sideBarUtils';
import getRole from '../Constants/userRoles';

const SideNav = ({ setPage, addLeave, staffRole }) => {
    const [sideBarItems, setSideBarItems] = useState([])
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [hoveredItem, setHoveredItem] = useState('')
    const [systemAdmin,setSystemAdmin]=useState(false)
    const toggleScreens = (item) => {
        setActiveItem(item)
        setPage(item)
    }
    const handleHoveredItem = (item) => {
        setHoveredItem(item)
    }
    useEffect(() => {
        let role;
        role=staffRole.empRole
        const dashboardItems = getSidebarItems(role)
        setSideBarItems(dashboardItems)
    }, [])
    return (
        <>
            <div className='d-flex flex-column mt-5 font-monospace' style={{ backgroundColor: "white", position: "fixed", height: "100vh" }}>
                <div>
                    <p className='m-0 p-0' style={{ whiteSpace: 'nowrap' }}>Leave plan</p>
                    <hr />
                </div>
                <div className='mt-1'>
                    <ul className="nav nav-pills d-flex flex-column">
                        {sideBarItems.map((item) => {
                            return (
                                <li className="nav-item" key={item.title} style={{ cursor: "pointer" }}>
                                    {/* "nav-link active" */}
                                    <div className={`nav-link mt-0 text-dark  ${staffRole.empRole==="SYSTEMADMIN"?`my-0`:``} ${activeItem === `${item.title}` ? 'fw-bold text-white' : 'fw-light'}`}
                                        onClick={() => toggleScreens(`${item.title}`)}
                                        // i want to apply is hovered when and only if active is set to false
                                        style={{
                                            backgroundColor:
                                                activeItem === item.title
                                                    ? 'black'
                                                    : hoveredItem === item.title && activeItem !== item.title
                                                        ? '#f3f3fb'
                                                        : '',
                                        }}
                                        onMouseEnter={() => handleHoveredItem(`${item.title}`)}
                                        onMouseLeave={() => handleHoveredItem('')}
                                    >
                                        {item.title}
                                    </div>
                                </li>
                            )
                        })}
                    </ ul>
                </div>
                <div className="fixed-bottom mb-4 mx-4">
                    <button className="btn btn-primary"
                        onClick={() => addLeave()}
                    >
                        Request leave
                    </button>
                </div>
            </div>
        </>
    )
}

export default SideNav;