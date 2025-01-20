import BendBankTables from "./bendBankTables";
export default function JobDescription() {
  return (
    <div className="container mt-4">
      {/* <h1 className="text-cyan-blue"></h1> */}
      <section className="border p-4">
        <h2 className=""> A. Job Description Review</h2>
        <form className="mt-4">
          <div className="form-group">
            <label className="font-weight-bold">Employee Answer:</label>
            <div>
              <input
                type="radio"
                id="employee-accurate"
                name="employee-answer"
                value="accurate"
              />
              <label htmlFor="employee-accurate" className="ml-2">
                Current job description accurately reflects the role
                requirements.
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
                Current job description needs updating.
              </label>
            </div>
          </div>
          <div className="form-group mt-3">
            <label className="font-weight-bold">Supervisor Answer:</label>
            <div>
              <input
                type="radio"
                id="supervisor-update"
                name="supervisor-answer"
                value="needs-updating"
              />
              <label htmlFor="supervisor-update" className="ml-2">
                Current job description needs updating. Please find revised
                version attached.
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="supervisor-submit"
                name="supervisor-answer"
                value="submit-hr"
              />
              <label htmlFor="supervisor-submit" className="ml-2">
                Current job description needs updating. Supervisor will submit
                to HR before <input type="date" className="ml-2" />
              </label>
            </div>
          </div>
          {/* ....................STRATEGIC OBJECTIVES TABLE.................................. */}
          <BendBankTables />
        </form>
      </section>

      <button type="submit" className="btn mt-4" style={{ backgroundColor: "#223457", color: "#fff" }}>
      Save and continue
      </button>
    </div>
  );
}
