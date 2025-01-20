import { useState } from "react";


const PerformanceRating = () => {
  const [selfRating, setSelfRating] = useState("");
  const [supervisorRating, setSupervisorRating] = useState("");

  const handleRatingChange = (setRating) => (e) => {
    setRating(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Self Rating: ${selfRating}, Supervisor Rating: ${supervisorRating}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white text-center">
              <h2 className="mb-0">Overall Performance Rating</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Self-Evaluation Section */}
                <div className="mb-4">
                  <h5 className="mb-3 text-primary">Self-Evaluation Score:</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {[
                      "Exceptional",
                      "Exceeds Expectations",
                      "Meets Expectations",
                      "Needs Improvement",
                      "Unsatisfactory",
                    ].map((label, idx) => (
                      <div className="form-check p-3" key={idx}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="selfRating"
                          id={`self-${label}`}
                          value={label}
                          onChange={handleRatingChange(setSelfRating)}
                          checked={selfRating === label}
                        />
                        <label
                          className="form-check-label text-secondary"
                          htmlFor={`self-${label}`}
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supervisor Score Section */}
                <div className="mb-4">
                  <h5 className="mb-3 text-primary">Supervisor Score:</h5>
                  <div className="d-flex flex-wrap gap-3">
                    {[
                      "Exceptional",
                      "Exceeds Expectations",
                      "Meets Expectations",
                      "Needs Improvement",
                      "Unsatisfactory",
                    ].map((label, idx) => (
                      <div className="form-check p-3" key={idx}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="supervisorRating"
                          id={`supervisor-${label}`}
                          value={label}
                          onChange={handleRatingChange(setSupervisorRating)}
                          checked={supervisorRating === label}
                        />
                        <label
                          className="form-check-label text-secondary"
                          htmlFor={`supervisor-${label}`}
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-3">
                  <p className="text-muted small">
                    <strong>**</strong> If checking{" "}
                    <strong>Needs Improvement</strong>, supervisor should
                    consider a Professional Development Plan for the employee.
                  </p>
                  <p className="text-muted small">
                    <strong>*</strong> If checking <strong>Unsatisfactory</strong>,
                    supervisor must complete a Performance Improvement Plan
                    (PIP) for the employee.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-lg" style={{ backgroundColor: "#223457", color: "#fff" }}>
                    Save and Next
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceRating;
