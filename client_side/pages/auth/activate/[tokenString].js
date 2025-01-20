import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";
import { API } from "../../../config";
import Layout from "../../../components/Layout";
import { withRouter } from "next/router";

const ActivateAccount = ({ router }) => {
	const [state, setState] = useState({
		email: "",
		token: "",
		buttonText: "Click here to activate your user account",
		success: "",
		error: "",
	});
	const { email, token, buttonText, success, error } = state;

	useEffect(() => {
		let token = router.query.tokenString;
		if (token) {
			const { email } = jwt.decode(token);
			setState({ ...state, email, token });
		}
	}, [router]);

	const submitToken = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: "Activating" });

		try {
			const response = await axios.post(`${API}/register/activate`, {
				token,
			});
			setState({
				...state,
				email: "",
				token: "",
				buttonText: "Activated",
				success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Click here to activate your user account",
				error: error.response.data.error,
			});
		}
	};

	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<h4>Activate account </h4>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				<button
					className="btn btn-outline-warning btn-block"
					onClick={submitToken}
				>
					{buttonText}
				</button>
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};

export default withRouter(ActivateAccount);
