import { Card, CardTitle, CardText } from "reactstrap";
import Layout from "../components/Layout";

const Home = () => (
	<Layout>
		<div className="row">
			<h4 style={{ marginLeft: "auto" }}>Bank Support Services System</h4>
		</div>
		<div className="row alert alert-secondary">
			<p
				className="lead font-weight-bold text-success"
				style={{ margin: "auto", fontSize: "25px" }}
			>
				MAIN FEATURES
			</p>
		</div>
		<div className="container-fluid text-center">
			<p className="lead">
				<span style={{ color: "purple", fontWeight: "bold" }}>B3S</span>{" "}
				(Bank Support Services System) is a platform that manages bank's
				support services. This system has modules that manage staff
				profiles, payroll, leave, medical insurance, performance
				appraisal, etc.
			</p>
		</div>

		<div className="container-fluid">
			<div className="row">
				<div className="col-md-4 mb-3">
					<Card className="px-1">
						<CardTitle className="font-weight-bold text-center">
							HUMAN RESOURCE
						</CardTitle>
						<CardText className="text-justify">
							The HR module helps the institution to manage its
							staff on items like:
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<strong>Profiles:</strong>&emsp;This allows
									the human resource office to add new staff
									and edit respective profiles. Every staff
									profile contains identification info,
									education background and experience.
								</li>
								<li className="list-group-item">
									<strong>Contracts:</strong>&emsp;Staff
									contracts are either permanent of a fixed
									period. This system will help HR office to
									set, track and terminate a contract via
									reports and other functions.
								</li>
								<li className="list-group-item">
									<strong>Payroll:</strong>&emsp;Every month
									there are recruitment as well as exit of
									staff. The system helps to manage this
									movements. Once the list of current staff is
									valid, the system will calculate net pay for
									each staff, taking into account statutory
									and non-statutory deductions, incentives and
									allowances.
								</li>
								<li className="list-group-item">
									<strong>Leave:</strong>&emsp;This module
									manages staff leaves from planning for each
									year to monitoring how leaves are being
									taken. It manages all types of leaves
									according to the law.
								</li>
								<li className="list-group-item text-center">
									<a
										href="/"
										target="_blank"
										className="text-info"
									>
										HR user guide manual
									</a>
								</li>
							</ul>
						</CardText>
						{/* <Button onClick={() => toggle('site_owner')}>
								Continue as Site Owner
							</Button> */}
					</Card>
				</div>

				<div className="col-md-4 mb-3">
					<Card className="px-1">
						<CardTitle className="font-weight-bold text-center">
							MEDICAL INSURANCE
						</CardTitle>
						<CardText className="text-justify">
							The medical module of this system helps to manage
							staff medical insurance for:
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<strong>HR office:</strong>&emsp;All
									employees are entilted to medical insurance.
									The HR office is responsible to enrole eas
									staff for medical insurance. Details about
									enrolment include staff's eligible
									dependents. As an employee or dependents are
									getting medical services, the system will
									track balances and inform the HR office.
									This system keeps record of health partners
									of the institution and services they offer.
								</li>
								<li className="list-group-item">
									<strong>Staff:</strong>
									&emsp; Employees need to know the balance of
									their medical insurance. This will help to
									plan for future medical services that may be
									needed. Also the system will inform the
									employee about health partners of the
									institution and services they offer.
								</li>
								<li className="list-group-item">
									<strong>Health institution:</strong>
									&emsp; The Bank has partneship with
									different healt institutions including
									clinics, pharmacies and hospitals. Each
									institution using this system will be able
									to send invoice to the system by mean of
									electronic file. This will speed up
									reconciliation and hence payments.
								</li>

								<li className="list-group-item text-center">
									<a
										href="/"
										target="_blank"
										className="text-info"
									>
										Medical insurance user guide manual
									</a>
								</li>
							</ul>
						</CardText>
						{/* <Button onClick={() => toggle('manager')}>
								Continue as Civil Engineer
							</Button> */}
					</Card>
				</div>
				<div className="col-md-4 mb-3">
					<Card className="px-1">
						<CardTitle className="font-weight-bold text-center">
							LOAN LOSS RESERVE
						</CardTitle>
						<CardText className="text-justify">
							The LLRs module will be used for credit enhancement
							that help banks and lenders mitigate estimated
							losses on loans in the event of defaults or
							non-payments. Should borrowers default on their
							loan, banks might use loan loss reserve funds to
							alleviate these losses. The module has the following
							capabilities:
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<strong>Calculation:</strong>&emsp;This
									module helps to calculate Monthly Loss
									Amount which is the sum of all Restructuring
									Losses, Deficiency Losses, Modification
									Default losses, Short-Sale Losses,
									Foreclosure Losses, Equity Loan Losses, Loan
									Sale Losses and losses on Investor-Owned
									Loans realized by the Institution for any
									Shared-Loss Month.
								</li>
								<li className="list-group-item">
									<strong>Provision:</strong>&emsp;Loan loss
									provisions are the portion of the loan
									repayments set aside by banks to cover the
									portions of the loss on defaulted loan
									payments. It helps the bank balance the
									income and survive during bad times and is
									recorded in the income statement as a
									non-cash expense.
								</li>
								<li className="list-group-item">
									<strong>Reconciliation:</strong>&emsp;This
									module ensures that data from loan
									transactions match with the related GL
									postings, minimizing mistakes in financial
									reports.
								</li>
								<li className="list-group-item text-center">
									<a
										href="/"
										target="_blank"
										className="text-info"
									>
										LLRs user guide manual
									</a>
								</li>
							</ul>
						</CardText>
					</Card>
				</div>
				{/* <div className="col-md-4 mb-3">
					<Card className="px-1">
						<CardTitle className="font-weight-bold text-center">
							IT EQUIPMENT
						</CardTitle>
						<CardText className="text-justify">
							The Bank has lot of valuable IT equipment that need
							to be carefully managed for optimum usage. The
							system will help to manage such items as follows:
							<ul className="list-group list-group-flush">
								<li className="list-group-item">
									<strong>Acquired:</strong>&emsp;Every year,
									there is a quite important budget for IT
									equipment in the institution. This system
									will help to track the items that have been
									bought and how much they costed. It will
									also help to track the usage of current
									budget as well as providing valuable
									information to plan upcoming budget.
								</li>
								<li className="list-group-item">
									<strong>Distributed:</strong>
									&emsp;Whenever an item is given to a staff,
									the system will record details about the
									item, the staff and the date. This will help
									to know how IT equipment are distributed
									throughout the institution, thus increasing
									accountability on users responsible for a
									given IT item.
								</li>
								<li className="list-group-item">
									<strong>Disposible:</strong>&emsp;IT
									hardware reaches its end of life. This
									system will help the institution to
									recognize items that need to be replaced
									because they have reached end of life, or
									are damaged and cannot be repaired or are
									lost. The acquisition date and value of each
									item will be also known by the institution.
									This will help to trace all IT equipment.
								</li>
								<li className="list-group-item text-center">
									<a
										href="/"
										target="_blank"
										className="text-info"
									>
										IT Equipment user guide manual
									</a>
								</li>
							</ul>
						</CardText>
					</Card>
				</div> */}
			</div>
		</div>

		<div className="row alert alert-secondary">
			<p
				className="lead"
				style={{
					margin: "auto",
					fontSize: "25px",
					color: "purple",
				}}
			>
				***
			</p>
		</div>
	</Layout>
);

export default Home;
