import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MinusCircleOutlined } from "@ant-design/icons";

import Layout from "../../../components/Layout";
import withBranchManager from "../withBranchManager";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const Supervision = ({ token }) => {
	const router = useRouter();
	const { officer_code } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [selectedMember, setSelectedMember] = useState({});

	const [staffSupervision, setStaffSupervision] = useState([]);
	const [saleOfficers, setSaleOfficers] = useState([]);
	const [state, setState] = useState({
		staffCode: "",
		staffNames: "",
		staffExistingNew: "",
		staffJobTitle: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		staffCode,
		staffNames,
		staffExistingNew,
		staffJobTitle,
		error,
		success,
		buttonText,
	} = state;

	useEffect(() => {
		getStaff();
	}, [router]);

	useEffect(() => {
		getSaleOfficers();
	}, [currentStaff]);

	const getStaff = async () => {
		const response = await axios.get(`${API}/bm_profileOC/${officer_code}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentStaff(response.data.myProfile);
		setStaffSupervision(
			response.data.myProfile.currentMonthSalary.teamLeading
		);
	};

	const getTeamMemberDetails = async (oC) => {
		const response = await axios.get(`${API}/bm_profileEmpCode/${oC}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setSelectedMember(response.data.myProfile)
	};

	const getSaleOfficers = async () => {
		const response = await axios.post(
			`${API}/bm_sale_officers/`,
			{
				branchName:
					currentStaff &&
					currentStaff.currentAppointment &&
					currentStaff.currentAppointment.branch,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setSaleOfficers(response.data.saleOfficers);
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
		if (name === "staffCode") {
			getTeamMemberDetails(e.target.value);
		} 
	};

	const handleNewSupervision = () => {
		setState({
			...state,
			staffCode: "",
			staffNames: "",
			staffExistingNew: "",
			staffJobTitle: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const removeSupervision = async (sup) => {
		setLoading(true);
		setStaffSupervision(currentStaff.currentMonthSalary.teamLeading);
		const supIndex = staffSupervision.findIndex(
			(superv) => superv.staffCode === sup.staffCode
		);
		if (supIndex !== -1) staffSupervision.splice(supIndex, 1);

		//======================================Save array of teamLeading to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/bm_supervision/${currentStaff._id}`,
				{
					staffSupervision,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			handleNewSupervision();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (
			staffCode === "" ||
			!staffCode ||
			staffExistingNew === "" ||
			!staffExistingNew
		) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: "",
				error: "Please select a team member and status!",
			});
			return;
		}
		setLoading(true);
		//======================Adding new team member to the array
		setStaffSupervision(currentStaff.currentMonthSalary.teamLeading);

		const supIndex = staffSupervision.findIndex(
			(sup) => sup.staffCode === staffCode
		);
		if (supIndex !== -1) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: "Looks like that staff has been added to the team!",
			});
			return;
		} else {
			let newSupervision = {};
			newSupervision.staffCode = selectedMember.officerCode;
			newSupervision.staffNames = selectedMember.empNames;
			newSupervision.staffJobTitle = selectedMember.currentAppointment.jobTitle;
			newSupervision.staffExistingNew = staffExistingNew;
			staffSupervision.push(newSupervision);
		}

		//======================================Save array of supervision to the db
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/bm_supervision/${currentStaff._id}`,
				{
					staffSupervision,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			handleNewSupervision();
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});			
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const supervisionForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-8">
					<label className="text-muted ">
						Choose a team member:{" "}
					</label>{" "}
					<br />
					<select
						className="form-control"
						onChange={handleChange("staffCode")}
						value={staffCode}
						name="staffCode"
						title="Sales officer"
					>
						<option></option>
						{saleOfficers.length > 0 &&
							saleOfficers.map((saleofficer, i) => (
								<option
									key={saleofficer.empCode}
									value={saleofficer.empCode}
								>
									{saleofficer.empNames}
								</option>
							))}
					</select>
				</div>

				<div className="form-group col-md-4">
					<label className="text-muted ">Status: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("staffExistingNew")}
						value={staffExistingNew}
						title="If the staff has less than one year => new otherwise => existing"
					>
						<option></option>
						<option key="New" value="New">
							New
						</option>
						<option key="Existing" value="Existing">
							Existing
						</option>
					</select>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/branchManager/")}
					>
						Back
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={handleNewSupervision}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new supervision."
					>
						New
					</button>
				</div>

				<div className="col-md-4 mt-1">
					<button
						onClick={handleSubmit}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listTeamMembers = () =>
		staffSupervision &&
		staffSupervision.map((sup, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>{sup.staffNames ? sup.staffNames : ""}</span>
					&emsp;&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{sup.staffExistingNew ? sup.staffExistingNew : ""}
					</span>
					&emsp;&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{sup.staffJobTitle ? sup.staffJobTitle : ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => removeSupervision(sup)}
						title="Remove this staff from the group."
					>
						<MinusCircleOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Team Leading</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}
				{loading && (
					<div class="text-center">
						<div
							class="spinner-border spinner-border-sm text-primary"
							role="status"
						>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				)}
				<div className="row alert bg-light">
					<div className="col">
						<h5 className="text-primary font-weight-bold">
							{currentStaff && currentStaff.empNames
								? currentStaff.empNames
								: ""}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff && currentStaff.empCode
								? "Emp. ID: " + currentStaff.empCode
								: ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff && currentStaff.officerCode
								? "Officer Code: " + currentStaff.officerCode
								: ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff && currentStaff.currentAppointment && currentStaff.currentAppointment.branch 
								? "Branch: " + currentStaff.currentAppointment.branch
								: ""}
						</h6>
						&emsp;
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{supervisionForm()}</div>
				</div>

				{staffSupervision &&
					staffSupervision.length > 0 &&
					listTeamMembers()}
			</div>
			{/* {JSON.stringify(selectedMember)} */}
		</Layout>
	);
};
export default withBranchManager(Supervision);
