import Comment from "../position_objective/comments";

const BeheviorObjective = () => {
    const objectives = [
        {
          id: 1,
          title: "Transformational Impact",
          description:
            "Clearly understands and demonstrates the bank's Mission and PASSION Values, and Clearly understands and demonstrates a Client-focused service attitude.                                                                                               ",
        },
        {
          id: 2,
          title: "Relational Performance",
          description:
            "Employee promotes healthy inter-personal relations among the Employee and clients, Willing to support others in need (Employee or clients), and Willing to take an extra-mile for the benefit of others.",
        },
        {
          id: 3,
          title: "Time Management and Reporting",
          description:
            "Respects working hours, Timely attendance at client and Employee meetings, Timely and accurate reports, and Timely completion of assigned tasks.",
        },
        {
          id: 4,
          title: "Communication",
          description:
            "Communicates effectively with co-workers and clients, Open to constructive criticism, Approachable, Composed, Able to manage conflict, listens well, Negotiates effectively.",
        },
        {
          id: 5,
          title: "Initiative",
          description:
            "Recognizes potential problems and develops solutions, Offers constructive suggestions for improvement, Generates creative ideas and solutions, Takes responsibility for actions, Provides alternatives when making recommendations",
        },
        {
            id: 6,
            title: "Leadership and Employee Management ",
            description:
              "managers and team leaders only): Contributes to departmental and organizational strategic planning, Delegates work appropriately, takes responsibility for the implementation of branch or departmental objectives, Assists Employee in meeting their goals, Responsive to concerns from Employee.",
          },
      ];
  return (
  //   <div className="container mt-5">
  //   <h1 className="text-success mb-4">C. Behavioral Objectives</h1>
  //   <p className="text-muted mb-3">
  //     <strong>Rating Scale:</strong> 5 = Exceptional | 4 = Exceeds
  //     Expectations | 3 = Meets Expectations | 2 = Needs Improvement | 1 =
  //     Unsatisfactory
  //   </p>
  //   <table className="table table-bordered">
  //     <thead className="table-light">
  //       <tr>
  //         <th scope="col" className="text-start">
  //           Objective
  //         </th>
  //         <th scope="col" className="text-center">
  //           Self Evaluation
  //         </th>
  //         <th scope="col" className="text-center">
  //           Supervisor Evaluation
  //         </th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {objectives.map((objective) => (
  //         <tr key={objective.id}>
  //           <td>
  //             <strong>{objective.id}. {objective.title}:</strong>
  //             <p className="text-muted">{objective.description}</p>
  //           </td>
  //           <td className="text-center">
  //             <div className="d-flex justify-content-center gap-2">
  //               {[5, 4, 3, 2, 1].map((value) => (
  //                 <div key={value} className="form-check form-check-inline">
  //                   <input
  //                     className="form-check-input"
  //                     type="radio"
  //                     name={`self${objective.id}`}
  //                     id={`self${objective.id}-${value}`}
  //                     value={value}
  //                   />
  //                   <label
  //                     className="form-check-label"
  //                     htmlFor={`self${objective.id}-${value}`}
  //                   >
  //                     {value}
  //                   </label>
  //                 </div>
  //               ))}
  //             </div>
  //           </td>
  //           <td className="text-center">
  //             <div className="d-flex justify-content-center gap-2">
  //               {[5, 4, 3, 2, 1].map((value) => (
  //                 <div key={value} className="form-check form-check-inline">
  //                   <input
  //                     className="form-check-input"
  //                     type="radio"
  //                     name={`sup${objective.id}`}
  //                     id={`sup${objective.id}-${value}`}
  //                     value={value}
  //                   />
  //                   <label
  //                     className="form-check-label"
  //                     htmlFor={`sup${objective.id}-${value}`}
  //                   >
  //                     {value}
  //                   </label>
  //                 </div>
  //               ))}
  //             </div>
  //           </td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  //   <Comment />
  //   <button type="submit" className="btn btn-primary mt-4">
  //       Next
  //     </button>
  // </div>
  <div className="container mt-5">
      <h1 className="text-success mb-4">C. Behavioral Objectives</h1>
      <p className="text-muted mb-3">
        <strong>Rating Scale:</strong> 5 = Exceptional | 4 = Exceeds
        Expectations | 3 = Meets Expectations | 2 = Needs Improvement | 1 =
        Unsatisfactory
      </p>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-start">
                Objective
              </th>
              <th scope="col" className="text-center">
                Self Evaluation
              </th>
              <th scope="col" className="text-center">
                Supervisor Evaluation
              </th>
            </tr>
          </thead>
          <tbody>
            {objectives.map((objective) => (
              <tr key={objective.id}>
                <td>
                  <strong>
                    {objective.id}. {objective.title}:
                  </strong>
                  <p className="text-muted">{objective.description}</p>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((value) => (
                      <div key={value} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`self${objective.id}`}
                          id={`self${objective.id}-${value}`}
                          value={value}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`self${objective.id}-${value}`}
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    {[5, 4, 3, 2, 1].map((value) => (
                      <div key={value} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`sup${objective.id}`}
                          id={`sup${objective.id}-${value}`}
                          value={value}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`sup${objective.id}-${value}`}
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Comment />
      <button type="submit" className="btn mt-4" style={{ backgroundColor: "#223457", color: "#fff" }}>
      Save and continue
      </button>
    </div>
);
};

export default BeheviorObjective;
