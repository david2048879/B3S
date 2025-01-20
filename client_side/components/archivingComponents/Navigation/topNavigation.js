import { useState, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import getNavbarItems from "../constants/navBarUtils";
import Router from "next/router";

const Navigation = ({ setNavigation, userDetails }) => {
    const [activeItem, setActiveItem] = useState('PERFORMANCE');
    const [hoveredItem, setHoveredItem] = useState('');
    const [navbarItems, setNavbarItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const activateButton = (item) => {
        setActiveItem(item);
        setNavigation(item);
    };
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
    const handleHoveredItem = (item) => {
        setHoveredItem(item);
    };

    useEffect(() => {
        let role = userDetails.empRole;
        console.log(role);
        
        const navbarItems = getNavbarItems(role);
        setNavbarItems(navbarItems);
        if (userDetails.empRole === "STAFF") {
            setActiveItem("ALL SCANNED COPIES");
        }
        if (userDetails.empRole === "ADMIN") {
            setActiveItem("SCAN");
            setNavigation("SCAN");
        }
    }, [userDetails]);
    useEffect(() => {
        const itemsToShow = navbarItems.slice(0, 5); // Number of items to show initially
        const itemsToHide = navbarItems.slice(5); // Remaining items
        setVisibleItems(itemsToShow);
        setDropdownItems(itemsToHide);
    }, [navbarItems]);
    const [dropdownItems, setDropdownItems] = useState([]);
    // Inline styles for the component
    const navLinkStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        lineHeight: '1.5',
        textAlign: 'center',
        borderRadius: '0.25rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        minWidth: '100px',
        height: '40px'
    };

    const activeStyle = {
        backgroundColor: 'black',
        color: 'white',
        boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)'
    };

    const hoverStyle = {
        backgroundColor: '#f1f4f6',
        borderColor: '#dbdee1'
    };

    return (
        <div className="container-fluid mb-0 mt-1" style={{ fontFamily: "monospace" }}>
            <div className="row">
                <div className="col-2">
                    <p style={{ fontSize: "38px" }}>e-filing</p>
                </div>
                <div className="col-10">
                    <div className="d-flex mt-2 flex-row justify-content-between align-items-center w-100">
                        <ul className="nav d-flex flex-row" style={{ padding: 0, margin: 0 }}>
                            {visibleItems.map((item) => (
                                <li
                                    className="nav-item px-1"
                                    key={item.title}
                                    style={{ cursor: "pointer", padding: 0, margin: 0 }}
                                >
                                    <div
                                        className="nav-link"
                                        style={{
                                            ...navLinkStyle,
                                            ...(activeItem === item.title ? activeStyle : {}),
                                            ...(hoveredItem === item.title && activeItem !== item.title ? hoverStyle : {})
                                        }}
                                        onClick={() => activateButton(item.title)}
                                        onMouseEnter={() => handleHoveredItem(item.title)}
                                        onMouseLeave={() => handleHoveredItem('')}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </div>
                                </li>
                            ))}
                             {dropdownItems.length > 0 && (
                                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                                    <DropdownToggle caret>
                                        More
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {dropdownItems.map((item) => (
                                            <DropdownItem
                                                key={item.title}
                                                onClick={() => activateButton(item.title)}
                                            >
                                                {item.icon} {item.title}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </ul>
                        <div className="d-flex justify-content-end">
                            <button
                                className="border-1 border-primary rounded-3 bg-white"
                                onClick={() => Router.back()} 
                            >
                                GO BACK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mt-0">
                <hr style={{ borderTop: '1.5px solid #f0f0f0', width: '100%' }} className="mx-5 mt-0" />
            </div>
        </div>
    );
};

export default Navigation;
