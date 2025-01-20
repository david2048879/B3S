import Link from 'next/link';
import React from 'react';


const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-light vh-100" style={{ width: '250px', padding: '20px' }}>
      {/* Sidebar Header */}
      <div className="sidebar-header mb-4">
        <h4 className="text-primary">Performance Review</h4>
      </div>

      {/* Navigation Menu */}
      <ul className="nav flex-column pt-4">
  <li className="nav-item pt-4">
    <Link href="/performance/job_description" className="nav-link text-dark d-flex align-items-center">
      A. Job Description Review
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/position_objective" className="nav-link text-dark d-flex align-items-center">
      B. Position-Specific Objectives
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/behavioralObjectives" className="nav-link text-dark d-flex align-items-center">
      C. Behavioral Objectives
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/passionValue" className="nav-link text-dark d-flex align-items-center">
      D. Which P.A.S.S.I.O.N.
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/professionalDevelopment" className="nav-link text-dark d-flex align-items-center">
    E. Professional Development Objectives for 2025
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/performanceRating" className="nav-link text-dark d-flex align-items-center">
    F. Overall Performance Rating:
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/#passion" className="nav-link text-dark d-flex align-items-center">
    G. Comments on Overall Performance: 
    </Link>
  </li>
  <li className="nav-item pt-4">
    <Link href="/performance/#passion" className="nav-link text-dark d-flex align-items-center">
   Score
    </Link>
  </li>
</ul>

    </div>
  );
};

 export default Sidebar;

