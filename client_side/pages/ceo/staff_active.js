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

const activeStaff = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [profiles, setProfiles] = useState([]);

	const [state, setState] = useState({
		error: "",
		success: "",
	});
	const { error, success } = state;

	useEffect(() => {
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

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/searchProfilesCEO`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setProfiles(response.data.myProfiles);
		setLoading(false);
		setSearchText("");
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
				<div className="form-group col-md-12">{listProfiles()}</div>
			</div>
		</Fragment>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Active Employees</h4>
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

				<div className="row ">
					<form
						className="form-inline col-md-11 bg-primary mb-3 px-1"
						onSubmit={handleSearch}
					>
						<input
							onChange={handleSearchChange}
							type="search"
							value={searchText}
							className="form-control my-1"
							placeholder="Click here then press Enter to list all. To search, type here part of employee name or job title or branch name or employee code or employee email, then press Enter."
							style={{ width: "100%" }}
							title='To list all active employees, click in the search area then press "Enter".'
						/>
					</form>
					<div className="col-md-1">
						<button
							className="btn btn-info btn-block"
							onClick={() => router.push("/ceo")}
						>
							Back
						</button>
					</div>
				</div>
				{addReportForm()}
			</div>
			{/* {JSON.stringify(user)} */}
		</Layout>
	);
};
export default withCEO(activeStaff);
