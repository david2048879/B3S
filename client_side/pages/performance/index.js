import Layout from "../../components/performanceComponents/Layout";

export default function Home() {
 
  return (
    <Layout>


<div className="container mt-5">
      <h1 className="text-center mb-4">Employee Evaluation Performance</h1>

      {/* Employee Info Section */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="employeeName" className="form-label">Employee:</label>
          <span className="p-2"><strong>David Ngendahimana</strong></span>
        </div>
        <div className="col-md-6">
          <label htmlFor="jobTitle" className="form-label">Job Title:</label>
          <span><strong>IT</strong></span>
        </div>
      </div>

      {/* Department and Review Period Section */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="department" className="form-label">Department or Branch:</label>
          <span><strong>Head Office</strong></span>
        </div>
        <div className="col-md-6">
          <label htmlFor="reviewPeriod" className="form-label">Review Period:</label>
          {/* <input
            type="date"
            id="reviewPeriod"
            className="form-control"
            value={reviewPeriod}
            onChange={handleDateChange}
            title="Select review period"
          /> */}
        </div>
      </div>

      {/* Buttons and Modals */}
     
      <div className="d-flex justify-content-center">
  <button className="btn text-white" style={{ backgroundColor: "#223457" }}>
    Next
  </button>
</div>
      </div>
    </Layout>
  );
}
