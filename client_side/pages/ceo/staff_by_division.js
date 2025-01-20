import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EyeOutlined } from "@ant-design/icons";

import Layout from "../../components/Layout";
import withCEO from "./withCEO";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatDate } from "../../helpers/dateFormatter";

const divisionStaff = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [profiles, setProfiles] = useState([]);
	const [divisions, setDivisions] = useState([]);

	const [state, setState] = useState({
		division: "",
		error: "",
		success: "",
	});
	const { error, success, division } = state;

	useEffect(() => {
		loadDivisions();
		getProfiles();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const getProfiles = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/profilesCEO`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setProfiles(response.data.myProfiles);
		setLoading(false);
	};

	const loadDivisions = async () => {
		const response = await axios.get(`${API}/divisions`);
		setDivisions(response.data.divisions);
	};

	const handleChange = async (e) => {
		const selectedDivision = e.target.options[e.target.selectedIndex].text
		handleSearch(selectedDivision);
		setState({
			...state,
			division: selectedDivision,
			error: "",
			success: "",
		});
		
	};

	const handleSearch = async (division) => {
		if (division && division.length > 0) {
			setLoading(true);
			const response = await axios.post(
				`${API}/divisionProfilesCEO`,
				{
					division,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setProfiles(response.data.myProfiles);
			setLoading(false);
		} else {
			setState({
				...state,
				error: "Please select a division",
			});
		}
	};

	const listProfiles = () =>
		profiles.map((pfl, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>
						{pfl.empNames.length <= 67
							? pfl.empNames
							: pfl.empNames.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{pfl.currentAppointment.jobTitle
							? pfl.currentAppointment.jobTitle + " - "
							: ""}
						{pfl.currentAppointment.contractType === undefined ||
						pfl.currentAppointment.contractType === "Permanent"
							? ""
							: pfl.currentAppointment.contractType + " - "}
						{pfl.currentAppointment.branch
							? pfl.currentAppointment.branch
							: ""}
					</span>
					<span className="text-danger" style={{ fontSize: "13px" }}>
						&emsp;
						{pfl.currentAppointment.contractEndDate
							? formatDate(pfl.currentAppointment.contractEndDate)
							: ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => router.push(`/ceo/${pfl.empCode}`)}
						title="View this employee's details."
					>
						<EyeOutlined className="text-info" />
					</span>
				</div>
			</div>
		));

	const addReportForm = () => (
		<Fragment>
			<div className="row ">
				<div className="form-group col-md-11">
					<select
						className="form-control"
						onChange={handleChange}
						value={division}
						title="Division"
					>
						<option>Select a Division</option>
						{divisions.length > 0 &&
							divisions.map((dvn, i) => (
								<option key={i} value={dvn.division}>
									{dvn.division}
								</option>
							))}
					</select>
				</div>
				<div className="col-md-1">
						<button
							className="btn btn-info btn-block"
							onClick={() => router.push("/ceo")}
						>
							Back
						</button>
					</div>
			</div>
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Employees By Division</h4>
				</div>
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
				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}
				
				{addReportForm()}
				{listProfiles()}
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withCEO(divisionStaff);
