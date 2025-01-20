import React, { useState } from 'react';

const ScanDocumentCard = ({ documentType,toggleModal }) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardStyles = {
    width: '350px',
    padding: '16px',
    borderRadius: '20px',
    border: `1px solid ${isHovered ? "black" : "#e0e0e0"}`,
    fontFamily: 'Arial, sans-serif',
    transition: 'border-color 0.2s ease',
  };

  const cardHeaderStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const documentNameStyles = {
    color: '#8f9bb3',
    fontSize: '14px',
    fontWeight: '600',
  };

  const bookmarkIconStyles = {
    color: '#FFEFD9',
    fontSize: '18px',
  };

  const departmentNameStyles = {
    color: '#455473',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
  };

  const cardFooterStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const scanCountStyles = {
    display: 'flex',
    alignItems: 'center',
    color: '#718096',
    fontSize: '14px',
  };

  const dotStyles = {
    width: '8px',
    height: '8px',
    backgroundColor: '#48bb78',
    borderRadius: '50%',
    marginRight: '8px',
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div style={cardStyles} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='mx-1'>
      <div style={cardHeaderStyles} className='mt-2 '>
        <span style={documentNameStyles}>{documentType.name}</span>
        <span style={bookmarkIconStyles}><i className="fa-solid fa-bookmark"></i></span>
      </div>
      <h2 style={departmentNameStyles} className='mt-3'>{documentType.department}</h2>
      <div style={cardFooterStyles}>
        <div style={scanCountStyles}>
          <span style={dotStyles}></span>
          <span style={{ color: "#919AAC",fontSize:"13px" }}>{documentType.count} Scanned documents</span>
        </div>
        <button className='btn btn-primary' onClick={()=>toggleModal(documentType)}>
          <span className='mx-2'>scan</span>
          <span><i className="fa-solid fa-arrow-right-to-bracket"></i></span>
        </button>
      </div>
    </div>
  );
};

export default ScanDocumentCard;
