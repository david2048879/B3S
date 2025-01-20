const BendBankTables = () => {
    return ( 
        <section className="mt-5">
        <h5>
          Beyond Bank: One family empowering the underserved in a God-honoring
          and profitable way.
        </h5>
        <h4 className="">2024 Strategic Objectives</h4>
        <table className="table table-hover table-striped mt-3">
          <thead className="bg-primary text-white">
            <tr style={{ backgroundColor: "#223457", color: "#fff" }}>
              <th>Strategic Objectives</th>
              <th>Definitions</th>
              <th>Key Results</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1. Deepen Client Engagement</td>
              <td>
                We will build lasting relationships with our clients that foster
                transformation.
              </td>
              <td>
                - 5pt improvement on each 2024 Client Satisfaction survey vs.
                2023
              </td>
            </tr>
            <tr>
              <td>2. Grow Profitably</td>
              <td>
                We will scale and be profitable while remaining mission true.
              </td>
              <td>Annual Operating Profit for 2024</td>
            </tr>
            <tr>
              <td>3. Expand Frontiers</td>
              <td>
                “Beyond Bank” — we will use technology to expand outreach beyond
                branches and reduce operating costs.
              </td>
              <td>
                - &gt; 70% of transactions through digital channels by
                31-Dec-2024
                <br />- Opex ratio &lt; 36% for 2024
              </td>
            </tr>
          </tbody>
        </table>

        <div class="container my-4">
          <h6 class="text-center fw-bold mb-4">
            To achieve our strategic plan, we will focus on the following
            supporting objectives:
          </h6>
          <div class="table-responsive">
            <table class="table table-hover table-striped align-middle shadow-sm">
              <tbody>
                <tr class="bg-light">
                  <th class="text-primary">People</th>
                  <td>Equipped staff who love their work.</td>
                </tr>
                <tr>
                  <th class="text-primary">Products</th>
                  <td>
                    Responsive and profitable products delivered with
                    distinguished service.
                  </td>
                </tr>
                <tr class="bg-light">
                  <th class="text-primary">Technology</th>
                  <td>
                    Trustworthy, people-first technology that simplifies work
                    and meets client needs.
                  </td>
                </tr>
                <tr>
                  <th class="text-primary">Partnerships</th>
                  <td>
                    Leverage the strengths of others to benefit our clients and
                    achieve our goals.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
     );
}
 
export default BendBankTables;