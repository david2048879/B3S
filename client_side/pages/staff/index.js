import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { API } from "../../config";
import withStaff from "./withStaff";

const Staff = ({ user, token }) => {
	const [staffID, setStaffID] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getStaff();
	}, []);

	const getStaff = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/findStaff/${user.email}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(response.data)
			setStaffID(response.data.foundStaff.empCode);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setStaffID("");
		}
	};

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-3">
				<div className="row pt-2">
					<h4>Employee Dashboard</h4>
				</div>
				{loading && (
					<div class="text-center">
						<div class="spinner-border spinner-border-sm text-primary" role="status">
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				)}

				<div className="row alert alert-secondary p-2">
					<div className="col-md-12">
						<Link
							href={
								staffID !== ""
									? `/staff/profile/${staffID}`
									: "/staff"
							}
						>
							<a>
								<span className="text-primary font-weight-bold float-left">
									Personal profile:&emsp;
								</span>
								Keep your profile up to date for better human
								resource management. Provide your full
								identification data, contacts, education
								background, experience and your current best
								photo.
							</a>
						</Link>
					</div>
				</div>
				<div className="row alert alert-secondary p-2">
					<div className="col-md-12">
						<Link
							href={
								staffID !== ""
									? `/staff/salaryInfo/${staffID}`
									: "/staff"
							}
						>
							<a>
								<span className="text-primary font-weight-bold float-left">
									Salary information:&emsp;
								</span>
								Access information on how you've been paid every
								month. The information includes basic salary,
								allowances, deductions (statatory and
								non-statatory) and your net pay for each month.
							</a>
						</Link>
					</div>
				</div>
				{/* <div className="row alert alert-secondary p-2">
					<div className="col-md-12">
						<Link href={`/staff/leaveData/${staffID}`}>
							<a className="text-sucess">
								<span className="text-primary font-weight-bold float-left">
									Leave requests:&emsp;
								</span>
								Use this link to apply for leave. You can also
								see how many days are left and details on how
								you've been taking leaves.
							</a>
						</Link>
					</div>
				</div> */}
			</div>
			{/* {JSON.stringify(staffID)} */}
		</Layout>
	);
};

export default withStaff(Staff);
