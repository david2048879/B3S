import { useState } from 'react';

export default function ProfessionalDevelopmentForm() {
  const [objectives, setObjectives] = useState([{ developmentObjective: '', startMonth: '', endMonth: '' }]);

  const addObjective = () => {
    setObjectives([...objectives, { developmentObjective: '', startMonth: '', endMonth: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index][field] = value;
    setObjectives(updatedObjectives);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Professional Development Objectives for 2025</h2>
      <p>
        Our goal is to build healthy Employees and leaders who are strong and growing in each of the 5Cs – Christ, Community,
        Character, Calling, and Competencies. To accomplish development in the 5Cs, we focus on four dynamics of
        transformation: RISE – Relational, Instructional, Spiritual, and Experiential.
      </p>
      <p>
        These four areas provide a holistic approach to developing our Employees that goes well beyond solely taking a class or
        reading a book. When defining Employee development objectives keep the 5Cs and RISE in mind.
      </p>

      <ul>
        <li><strong>Relational:</strong> Built in community; leaders build leaders.</li>
        <li><strong>Instructional:</strong> Direct teaching & guidance to grow in specific ways.</li>
        <li><strong>Spiritual:</strong> Ultimately, God is the One who builds leaders.</li>
        <li><strong>Experiential:</strong> Learn by doing, built through fire; challenging stretch assignments.</li>
      </ul>

      <p>
        Feel free to list as many objectives as you want. We encourage each Employee to have <strong>at least one</strong>
        professional development objective. Your supervisor can help keep you accountable.
      </p>

      <form>
        {objectives.map((objective, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor={`objective-${index}`} className="form-label">
                  Development Objective(s):
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`objective-${index}`}
                  value={objective.developmentObjective}
                  onChange={(e) => handleInputChange(index, 'developmentObjective', e.target.value)}
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label htmlFor={`startMonth-${index}`} className="form-label">
                    Start Month:
                  </label>
                  <input
                    type="month"
                    className="form-control"
                    id={`startMonth-${index}`}
                    value={objective.startMonth}
                    onChange={(e) => handleInputChange(index, 'startMonth', e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor={`endMonth-${index}`} className="form-label">
                    End Month:
                  </label>
                  <input
                    type="month"
                    className="form-control"
                    id={`endMonth-${index}`}
                    value={objective.endMonth}
                    onChange={(e) => handleInputChange(index, 'endMonth', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <button type="button" style={{ backgroundColor: "#223457", color: "#fff" }} className="btn" onClick={addObjective}>
          Add Objective
        </button>

        <div className="mt-4">
          <h5>How can your supervisor or the Staff Development Department help you achieve these objectives?</h5>
          <textarea className="form-control" rows="3"></textarea>
        </div>

        <div className="mt-4">
          <h5>Result at time of Review:</h5>
          <textarea className="form-control" rows="3"></textarea>
        </div>

        <div className="mt-4">
          <h5>Employee Comments:</h5>
          <textarea className="form-control" rows="3"></textarea>
        </div>

        <div className="mt-4">
          <h5>Supervisor Comments:</h5>
          <textarea className="form-control" rows="3"></textarea>
        </div>

        <button type="submit" className="btn mt-3" style={{ backgroundColor: "#223457", color: "#fff" }}>
          Submit
        </button>
      </form>
    </div>
  );
}
