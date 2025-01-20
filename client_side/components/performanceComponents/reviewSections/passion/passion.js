import React from "react";

const PassionValues = () => {
  const values = [
    {
      id: 1,
      label: "Prayer",
      description:
        "Exhibits a prayerful attitude and is committed to taking concerns and successes before the Lord",
      supervisorDescription:
        "Exhibits commitment to Christ through Urwego and to excellence in all assigned tasks",
    },
    {
      id: 2,
      label: "Allegiance",
      description:
        "Seeks to serve and do whatever it takes to advance Urwego's ministry",
    },
    {
      id: 3,
      label: "Service",
      description:
        "Seeks to be a wise steward of all entrusted resources",
    },
    {
      id: 4,
      label: "Stewardship",
      description: "Strives to find solutions and to do so without complaint",
    },
    {
      id: 5,
      label: "Innovation",
      description:
        "Consistently encourages co-workers and exemplifies joyfulness in all situations",
    },
    {
      id: 6,
      label: "Optimism",
      description:
        "Shows sensitivity and love to all co-workers and other constituents",
    },
    {
      id: 7,
      label: "Nurturing",
      description: "Fosters healthy relationships in the workplace",
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-success mb-3">
        D. Which P.A.S.S.I.O.N. values has this year's performance best supported?
      </h2>
      <p className="text-muted">Only select top 1-2 values.</p>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-start">Self Evaluation</th>
              <th scope="col" className="text-start">Supervisor Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {values.map((value) => (
              <tr key={value.id}>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`self${value.id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`self${value.id}`}
                    >
                      <strong>{value.label}</strong>: {value.description}
                    </label>
                  </div>
                </td>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`supervisor${value.id}`}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`supervisor${value.id}`}
                    >
                      {value.supervisorDescription || value.description}
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mb-4">
        <label className="form-label">
          <strong>Comments on P.A.S.S.I.O.N. value(s) demonstrated (optional):</strong>
        </label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Employee comments"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="form-label">
          <strong>Supervisor comments on P.A.S.S.I.O.N. value(s) demonstrated (optional):</strong>
        </label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Supervisor comments"
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="form-label">
          <strong>In 2024, one P.A.S.S.I.O.N. value I would like to grow in is:</strong>
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Your response here"
        />
      </div>
      <button type="submit" className="btn"style={{ backgroundColor: "#223457", color: "#fff" }}>
      Save and continue
      </button>
    </div>
  );
};

export default PassionValues;
