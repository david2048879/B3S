import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EditOutlined } from "@ant-design/icons";

import Layout from "../../components/Layout";
import withAdmin from "./withAdmin";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const changeUserRole = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [roles, setRoles] = useState([]);
	const [users, setUsers] = useState([]);
	const [currentUser, setCurrentUser] = useState({});
	const [state, setState] = useState({
		roleName: "",
		success: "",
		buttonText: "Save",
	});
	const {
		roleName,
		error,
		success,
		buttonText,
	} = state;

	useEffect(() => {
		loadRoles();
		getUsers();
	}, []);

	const loadRoles = async () => {
		const response = await axios.get(`${API}/roles`);
		setRoles(response.data.roles);
	};

	const getUsers = async () => {
		handleNewUser();
		const response = await axios.get(`${API}/users/`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setUsers(response.data.myUsers);
	};

    const getUser = async (userID) => {
		const response = await axios.get(`${API}/user/${userID}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
        setCurrentUser(response.data.myUser);
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.post(
			`${API}/searchUsers`,
			{
				searchValue: searchText,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setUsers(response.data.myUsers);
		setLoading(false);
		handleNewUser();
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

	const handleNewUser = () => {
		setCurrentUser({});
		setState({
			...state,
			roleName: "",
			buttonText: "Save",
			error: "",
			success: "",
		});
		setSearchText("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!roleName || !currentUser._id) {
			setState({
				...state,
				buttonText: "Save",
				error: "Choose a user and the new role!",
			});
			window.scrollTo(0, 0);
			return;
		}
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.put(
				`${API}/changeUserRole/${currentUser._id}`,
				{
					newRole: roleName
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getUsers();
			handleNewUser();
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

	const changeUserRoleForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-12">
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
			</div>

			<hr />
			<div className="row">
				<div className="col-md-6 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/admin/addMenu/")}
					>
						Back
					</button>
				</div>
				<div className="col-md-6 mt-1">
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

	const listUsers = () =>
		users.map((usr, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span>
						{usr.role.length <= 67
							? usr.role
							: usr.role.substring(0, 67) + "..."}
					</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{usr.fullName ? usr.fullName : ""}
					</span>
					<span
						className="btn btn-sm float-right"
						onClick={() => getUser(usr._id)}
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
					<h4>User Roles</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}
				<div className="row alert bg-light">
					<div className="col">
						<h5 className="text-danger font-weight-bold">
							{currentUser && currentUser.fullName
								? currentUser.fullName
								: "Select a user for whom you want to change role."}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "16px", color: "black" }}>
							{currentUser && currentUser.role
								? "Current Role: " + currentUser.role
								: ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "16px", color: "black" }}>
							{currentUser && currentUser.email
								? "Email: " + currentUser.email
								: ""}
						</h6>
						&emsp;						
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{changeUserRoleForm()}</div>
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
							placeholder='Type here part of user name or full name or email, then press "Enter" to search.'
							style={{ width: "100%" }}
						/>
					</form>
				</div>

				{listUsers()}
			</div>
			{/* {JSON.stringify(users)} */}
		</Layout>
	);
};

export default withAdmin(changeUserRole);
