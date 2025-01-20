import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EditOutlined } from "@ant-design/icons";

import Layout from "../../components/Layout";
import withAdmin from "./withAdmin";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const AddMenu = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [roles, setRoles] = useState([]);
	const [usrRoles, setUsrRoles] = useState([]);
	const [currentUsrRole, setCurrentUsrRole] = useState({});
	const [state, setState] = useState({
		roleName: "",
		roleAction: "",
		linkTo: "",
		linkParameter: "",
		roleSummary: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		roleName,
		roleAction,
		linkTo,
		linkParameter,
		roleSummary,
		error,
		success,
		buttonText,
	} = state;

	useEffect(() => {
		loadRoles();
		getUsrRoles();
	}, []);

	const loadRoles = async () => {
		const response = await axios.get(`${API}/roles`);
		setRoles(response.data.roles);
	};

	const getUsrRole = async (usrRoleID) => {
		handleNewUsrRole();
		const response = await axios.get(`${API}/usrRole/${usrRoleID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setCurrentUsrRole(response.data.myUsrRole);
		if (response.data.myUsrRole && response.data.myUsrRole.roleName) {
			setState({ ...state, ...response.data.myUsrRole });
		}
	};

	const getUsrRoles = async () => {
		setLoading(true);
		const response = await axios.get(`${API}/usrRoles`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setUsrRoles(response.data.myUsrRoles);
		setLoading(false);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/searchUsrRole`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setUsrRoles(response.data.myUsrRoles);
		setLoading(false);
		handleNewUsrRole();
		setSearchText("");
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const handleNewUsrRole = () => {
		setCurrentUsrRole({});
		setState({
			...state,
			roleName: "",
			roleAction: "",
			linkTo: "",
			linkParameter: "",
			roleSummary: "",
			buttonText: "Save",
			error: "",
			success: "",
		});
		setSearchText("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!roleName || !roleAction || !linkTo) {
			setState({
				...state,
				buttonText: "Save",
				error: "Provide role name, action and link!",
			});
			window.scrollTo(0, 0);
			return;
		}
		if(!linkParameter){
			linkParameter: "none"
		}
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/addUsrRole`,
				{
					roleName,
					roleAction,
					linkTo,
					linkParameter,
					roleSummary,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getUsrRoles();
			handleNewUsrRole();
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

	const handleUpdate = async (e) => {
		e.preventDefault();
		if (!roleName || !roleAction || !linkTo) {
			setState({
				...state,
				buttonText: "Save",
				error: "Provide role name, action and link!",
			});
			window.scrollTo(0, 0);
			return;
		}
		if(!linkParameter){
			linkParameter: "none"
		}
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/editUsrRole/${currentUsrRole._id}`,
				{
					roleName,
					roleAction,
					linkTo,
					linkParameter,
					roleSummary,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getUsrRoles();
			handleNewUsrRole();
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

	const addUserRoleForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-6">
					<label className="text-muted ">Role Name: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("roleName")}
						value={roleName}
					>
						<option></option>
						{roles.length > 0 &&
							roles.map((rl, i) => (
								<option key={i} value={rl.roleName}>
									{rl.roleName}
								</option>
							))}
					</select>
				</div>

				<div className="form-group col-md-6">
					<label className="text-muted ">Role Action: </label> <br />
					<input
						type="text"
						onChange={handleChange("roleAction")}
						className="form-control"
						value={roleAction}
						required
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-6">
					<label className="text-muted ">Link To: </label> <br />
					<input
						type="text"
						onChange={handleChange("linkTo")}
						className="form-control"
						value={linkTo}
						title="Enter link where to go when this link is clicked"
					/>
				</div>
				<div className="form-group col-md-6">
					<label className="text-muted ">Link Parameter: </label>{" "}
					<br />
					<input
						type="text"
						onChange={handleChange("linkParameter")}
						className="form-control"
						value={linkParameter}
						title="Enter of the link where to go when it is clicked"
					/>
				</div>
			</div>
			<div className="row">
				<div className="form-group col-md-12">
					<label className="text-muted ">Role Summary: </label> <br />
					<textarea
						rows="3"
						onChange={handleChange("roleSummary")}
						className="form-control"
						value={roleSummary}
					/>
				</div>
			</div>

			<hr />
			<div className="row">
				<div className="col-md-3 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard/")}
					>
						Back
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={handleNewUsrRole}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new user role."
					>
						Clear
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={
							currentUsrRole && currentUsrRole._id
								? handleUpdate
								: handleSubmit
						}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={() => router.push("/admin/changeUserRole")}
						className="btn btn-outline-primary btn-block"
					>
						User Roles
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listUserRoles = () =>
		usrRoles.map((ur, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span>
						{ur.roleName.length <= 67
							? ur.roleName
							: ur.roleName.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{ur.roleAction ? ur.roleAction : ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => getUsrRole(ur._id)}
						title="Edit User Role Menu"
					>
						<EditOutlined className="text-info" />
					</span>
				</div>
			</div>
		));
	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>User Menus</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addUserRoleForm()}</div>
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

				<div className="row ">
					<form
						className="form-inline col bg-info mb-3 px-1"
						onSubmit={handleSearch}
					>
						<input
							onChange={handleSearchChange}
							type="search"
							value={searchText}
							className="form-control my-1"
							placeholder='Type here part of role name or role action, then press "Enter" to search.'
							style={{ width: "100%" }}
							title='Type here part of role name or role action, then press "Enter" to search.'
						/>
					</form>
				</div>

				{listUserRoles()}
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};

export default withAdmin(AddMenu);
