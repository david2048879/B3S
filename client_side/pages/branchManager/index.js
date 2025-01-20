import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { TeamOutlined } from "@ant-design/icons";
import Layout from "../../components/Layout";
import { API } from "../../config";
import withBranchManager from "./withBranchManager";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const teamLeaders = ({ user, token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [brachStaff, setBranchStaff] = useState([]);
	const [state, setState] = useState({
		error: "",
		success: "",
	});
	const { error, success } = state;

	useEffect(() => {
		getBranchStaff();
	}, []);

	const getBranchStaff = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/allBranchStaff/${user.email}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			// console.log(response.data)
			setBranchStaff(response.data.branchStaff);
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	};

	const listBranchStaff = () =>
		brachStaff.map((bs, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>
						{bs.empNames.length <= 67
							? bs.empNames
							: bs.empNames.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{bs.currentAppointment.jobTitle ? bs.currentAppointment.jobTitle : ""}
					</span>
					{(bs.currentAppointment.jobTitle === "Sales Team Leader" ||
						bs.currentAppointment.jobTitle === "Senior Sales Team Leader") && (
						<span
							className="btn btn-sm float-right"
							onClick={() =>
								router.push(
									`/branchManager/supervision/${bs.officerCode}`
								)
							}
							title="Add supervised staff for team leader"
						>
							<TeamOutlined className="text-primary" />
						</span>
					)}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Setting Sale Teams</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				{/* <div className="row alert bg-light">
					<div className="col">
						<h5 className="text-primary font-weight-bold">
							{currentIncentive && currentIncentive.empNames
								? currentIncentive.empNames
								: "Select an employee to view data"}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentIncentive && currentIncentive.jobTitle
								? currentIncentive.jobTitle
								: ""}
							&emsp;
							{currentIncentive && currentIncentive.officerCode
								? ": " + currentIncentive.officerCode
								: ""}
						</h6>
					</div>
				</div> */}

				{/* <div className="row alert alert-secondary">
					<div className="col-md-12">{incentiveForm()}</div>
				</div> */}
				{loading && (
					<div class="text-center">
						<div
							class="spinner-border spinner-border-lg text-danger"
							role="status"
						>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				)}

				{/* <div className="row ">
					<form
						className="form-inline col bg-info mb-3 px-1"
						onSubmit={handleSearch}
					>
						<input
							onChange={handleSearchChange}
							type="search"
							value={searchText}
							className="form-control my-1"
							placeholder='Type here part of employee name, job title, branch name or full employee code, officer code, then press "Enter" to search.'
							style={{ width: "100%" }}
						/>
					</form>
				</div> */}

				{listBranchStaff()}
			</div>
			{/* {JSON.stringify(staffID)} */}
		</Layout>
	);
};

export default withBranchManager(teamLeaders);
