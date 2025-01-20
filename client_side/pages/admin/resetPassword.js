import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import withAdmin from "./withAdmin";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { API } from "../../config";
import Layout from "../../components/Layout";

const resetPassword = ({ token }) => {
	const router = useRouter();
	const [state, setState] = useState({
		email: "",
		newPassword: "",
		buttonText: "Reset password",
		success: "",
		error: "",
	});
	const { email, newPassword, buttonText, success, error } = state;

	const handleChange = (dataName) => (e) => {
		setState({
			...state,
			[dataName]: e.target.value,
			error: "",
			success: "",
			buttonText: "Reset password",
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Resetting password..." });
		try {
			const response = await axios.put(
				`${API}/resetUserPassword`,
				{
					email,
					newPassword,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setState({
				...state,
				email: "",
				newPassword: "",
				buttonText: "Password is reset!",
				success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Reset password",
				error: error.response.data.error,
			});
		}
	};
	const resetPasswordForm = () => (
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
					onChange={handleChange("newPassword")}
					value={newPassword}
					placeholder="Password"
					required
				/>
			</div>
			<div className="row">
				<div className="col-md-6 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard/")}
					>
						Back
					</button>
				</div>
				<div className="col-md-6 mt-1">
					<button className="btn btn-outline-primary btn-block">
						{buttonText}
					</button>
				</div>
			</div>
		</form>
	);

	return (
		<Layout>
			{/* <div className='row'> */}
			<div className="col-md-4 offset-md-4 py-3">
				<h4>Reset User Password</h4>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{resetPasswordForm()}
			</div>
			{/* </div> */}
		</Layout>
	);
};

export default withAdmin(resetPassword);
