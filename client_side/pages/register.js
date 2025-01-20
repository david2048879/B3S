import { useState, useEffect } from "react";
import Router from "next/router";
import Layout from "../components/Layout";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";
import { API } from "../config";
import { isAuth } from "../helpers/authToken";

const Register = () => {
	const [state, setState] = useState({
		email: "",
		password: "",
		error: "",
		success: "",
		buttonText: "Submit",
	});

	const { email, password, error, success, buttonText } = state;

	useEffect(() => {
		isAuth() && Router.push("/");
	});

	const handleChange = (dataName) => (e) => {
		setState({
			...state,
			[dataName]: e.target.value,
			error: "",
			success: "",
			buttonText: "Submit",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Submitting..." });
		try {
			const response = await axios.post(`${API}/registerLocal`, {
				email,
				password,
			});
			setState({
				email: "",
				password: "",
				buttonText: "Submit",
				success: response.data.message,
			});
			Router.push("/login");
		} catch (error) {
			setState({
				...state,
				buttonText: "Submit",
				error: error.response.data.error,
			});
		}
	};

	const registerForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					value={email}
					onChange={handleChange("email")}
					type="email"
					className="form-control"
					placeholder="Email"
					required
				/>
			</div>
			<div className="form-group">
				<input
					value={password}
					onChange={handleChange("password")}
					type="password"
					className="form-control"
					placeholder="Password"
					required
				/>
			</div>
			<div className="form-group">
				<button className="btn btn-outline-primary btn-block">
					{buttonText}
				</button>
			</div>
		</form>
	);
	return (
		<Layout>
			<div className="col-md-4 offset-md-4 container-fluid">
				<h4>Activate My Employee's User Account</h4>

				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{registerForm()}
				{/* <hr /> */}
				{/* {JSON.stringify(state)} */}
			</div>
		</Layout>
	);
};

export default Register;
