import React, { useState } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
const ScannedDocumentCard = ({ document, initiateDeleteModal,initiateModifyModal,initiateViewModal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardStyles = {
    width: '100%',
    maxWidth: '550px',
    padding: '20px',
    borderRadius: '15px',
    border: `1px solid ${isHovered ? "#007BFF" : "#0099E8"}`,
    boxShadow: isHovered ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
  };

  const documentNameStyles = {
    fontSize: '16px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#333',
  };

  const cardHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  };

  const optionsIconStyles = {
    fontSize: '24px',
    color: '#8f9bb3',
    cursor: 'pointer',
  };

  const documentInfoStyles = {
    fontSize: '14px',
    color: '#455473',
    fontWeight: '600',
  };

  const scanDateStyles = {
    fontSize: '12px',
    color: '#6c757d',
    marginTop: '4px',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      style={cardStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="mb-3"
    >
      {/* Document Title */}
      <div style={cardHeaderStyles}>
        <span style={documentNameStyles}>
          {document.documentTitle.length > 50
            ? document.documentTitle.substring(0, 50) + "..."
            : document.documentTitle}
        </span>
        <span style={optionsIconStyles}>
          <UncontrolledDropdown>
            <DropdownToggle
              tag="span" // Use span as the toggle element
              style={optionsIconStyles} // Apply your custom styles
              role="button"
              onClick={(e) => e.preventDefault()}
            >
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" end>
              <DropdownItem onClick={() => initiateModifyModal(document)}>
                <div className='d-flex flex-row'>
                  <i className="fa-solid fa-pen-to-square"></i>
                  <p className='mx-3 my-0 py-0 text-muted'><strong>Modify</strong></p>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => initiateDeleteModal(document)}>
                <div className='d-flex flex-row'>
                  <i className="fa-solid fa-trash"></i>
                  <p className='mx-3 my-0 py-0 text-muted'><strong>Delete</strong></p>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => initiateViewModal(document)}>
                <div className='d-flex flex-row'>
                  <i className="fa-solid fa-eye"></i>
                  <p className='mx-3 my-0 py-0 text-muted'><strong>Show properties</strong></p>
                </div>
              </DropdownItem>
              <DropdownItem onClick={() => { window.open(`/archiving/view/${document._id}`, '_blank') }}>
                <div className='d-flex flex-row'>
                <i className="fa-solid fa-file"></i>
                  <p className='mx-3 my-0 py-0 text-muted'><strong>View files</strong></p>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </span>
      </div>

      {/* Document Type, Department, and Scanned Date */}
      <div className="row align-items-center">
        {/* Document Type */}
        <div className="col-6" style={documentInfoStyles}>
          <i className="fa-solid fa-file-alt mr-2"></i> {document.docType.docType}
        </div>

        {/* Department */}
        <div className="col-4" style={documentInfoStyles}>
          <i className="fa-solid fa-building mr-2"></i> {document.docType.department}
        </div>

        {/* Scanned Date */}
        <div className="col-2 text-right" style={scanDateStyles}>
          Scanned on: {new Date(document.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ScannedDocumentCard;
