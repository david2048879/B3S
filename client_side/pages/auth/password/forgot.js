import { useState } from "react";
import axios from "axios";

import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
	const [state, setState] = useState({
		email: "",
		currentPassword: "",
		newPassword: "",
		buttonText: "Change password",
		success: "",
		error: "",
	});
	const { email, currentPassword, newPassword, buttonText, success, error } =
		state;

	const handleChange = (dataName) => (e) => {
		setState({
			...state,
			[dataName]: e.target.value,
			error: "",
			success: "",
			buttonText: "Change password",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Changing password..." });
		try {
			const response = await axios.put(`${API}/reset-password`, {
				email,
				currentPassword,
				newPassword,
			});
			setState({
				...state,
				email: "",
				currentPassword: "",
				newPassword: "",
				buttonText: "Password Changed!",
				success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Change password",
				error: error.response.data.error,
			});
		}
	};

	const passwordForgotForm = () => (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<input
					type="email"
					className="form-control"
					onChange={handleChange("email")}
					value={email}
					placeholder="Email"
					required
				/>
			</div>
			<div className="form-group">
				<input
					type="password"
					className="form-control"
					onChange={handleChange("currentPassword")}
					value={currentPassword}
					placeholder="Current Password"
					required
				/>
			</div>
			<div className="form-group">
				<input
					type="password"
					className="form-control"
					onChange={handleChange("newPassword")}
					value={newPassword}
					placeholder="New Password"
					required
				/>
			</div>
			<div>
				<button className="btn btn-outline-primary btn-block">
					{buttonText}
				</button>
			</div>
		</form>
	);

	return (
		<Layout>
			{/* <div className='row'> */}
			<div className="col-md-6 offset-md-3 py-3">
				<h4>Reset Password</h4>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{passwordForgotForm()}
			</div>
			{/* </div> */}
		</Layout>
	);
};

export default ForgotPassword;
