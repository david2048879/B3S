import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../helpers/alerts";
import { API } from "../config";
import { authenticate, isAuth } from "../helpers/authToken";

const Login = () => {
	const [state, setState] = useState({
		email: "", //hkasingye@urwegobank.com
		password: "", //1234567
		error: "",
		success: "",
		buttonText: "Login",
	});

	const { email, password, error, success, buttonText } = state;

	useEffect(() => {
		isAuth() && Router.push("/");
	}, []);

	const handleChange = (dataName) => (e) => {
		setState({
			...state,
			[dataName]: e.target.value,
			error: "",
			success: "",
			buttonText: "Login",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Logging in..." });
		try {
			const response = await axios.post(`${API}/login`, {
				email: email.includes("@urwegobank.com")
					? email
					: email + "@urwegobank.com",
				password,
			});
			authenticate(response, () => {
				if (isAuth()) {
					Router.push("/dashboard");
				} else {
					Router.push("/login");
				}
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Login",
				error: error.response && error.response.data.error,
			});
		}
	};

	const loginForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					value={email}
					onChange={handleChange("email")}
					type="text" //type="email"
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
				<button className="btn btn-outline-warning">
					{buttonText}
				</button>
				<Link href="/auth/password/forgot">
					<a className="btn btn-outline-danger float-right">
						Reset Password
					</a>
				</Link>
			</div>
		</form>
	);
	return (
		<Layout>
			<div className="col-md-4 offset-md-4 container-fluid">
				<h4>Login</h4>

				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{loginForm()}
			</div>
		</Layout>
	);
};

export default Login;
