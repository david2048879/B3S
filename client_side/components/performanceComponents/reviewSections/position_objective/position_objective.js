import Comment from "./comments";

const PositionObjective = () => {
    return ( 
        <div className="container my-5">
        {/* Section Title */}
        <h6 className="fw-bold">B. Position-Specific Objectives</h6>
        <p>
          Complete the chart below with the Key Performance Indicator (KPI) goals for your position.
          Leave any extra KPI lines blank. <strong>Note:</strong> please use only the first 4 columns during annual goal setting. 
          The 3 grey columns to the right will <em>only</em> be completed during the midterm and annual review 
          with actual performance results at the time of review.
        </p>
  
        <div className="mt-4">
          <label className="fw-bold">
            How often did your supervisor meet with you to discuss these objectives?
          </label>
          <input type="text" className="form-control mt-2" placeholder="Employee click to enter text." />
        </div>

        {/* ----------------Tables---------------------------- */}
        <div className="container my-4">
      <h6 className="text-center fw-bold">
        -------------------------Complete during goal setting-------------------------
      </h6>
      <table className="table table-bordered mt-3 text-center">
        <thead className="table-light">
          <tr>
            <th>Key Performance Indicator (KPI) <br /> <em>(examples)</em></th>
            <th>From (current) <br /> 31-Jan-24</th>
            <th  style={{ backgroundColor: "#223457", color: "#fff" }}>To (target) by <br /> 30-Jun-24</th>
            <th  style={{ backgroundColor: "#223457", color: "#fff" }}>To (target) by <br /> 31-Dec-24</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gross Portfolio</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>No. of groups</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>No. of new groups</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>No. of new clients graduated to MBL</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>MHose usage</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>PAR30</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>PAR90</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>Write-offs</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
        </tbody>
      </table>

      <h6 className="text-center fw-bold">
      ----------------------------Complete during review only-------------------------
      </h6>
      <table className="table table-bordered mt-3 text-center">
        <thead className="table-light">
          <tr>
          <th style={{ backgroundColor: "#223457", color: "#fff" }}>Key Performance Indicator (KPI) <br /> <em>(examples)</em></th>
            <th  style={{ backgroundColor: "#223457", color: "#fff" }}>Results as of <br />
            <div>
              <input
                type="radio"
              />
              <label htmlFor="employee-accurate" className="ml-2">
              30-Jun-24
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="employee-update"
                name="employee-answer"
                value="needs-updating"
              />
              <label htmlFor="employee-update" className="ml-2">
              31-Dec-24
              </label>
            </div>
            
             </th>
            <th  style={{ backgroundColor: "#223457", color: "#fff" }}>Self-Eval Score <br /> (1-5) </th>
            <th  style={{ backgroundColor: "#223457", color: "#fff" }}>SupervisorScore<br /> (1-5) </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Gross Portfolio</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>No. of groups</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>No. of new groups</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>No. of new clients graduated to MBL</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>MHose usage</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>PAR30</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>PAR90</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
          <tr>
            <td>Write-offs</td>
            <td><input type="text" className="form-control" placeholder="Enter value" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
            <td className="bg-light"><input type="text" className="form-control" placeholder="Enter target" /></td>
          </tr>
        </tbody>
      </table>
      <Comment />
      <button type="submit" className="btn mt-4"style={{ backgroundColor: "#223457", color: "#fff" }}>
        Save and continue
      </button>
    </div>
      </div>
     );
}
 
export default PositionObjective;