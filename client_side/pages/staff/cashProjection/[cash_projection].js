import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EditOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Layout from "../../../components/Layout";
import withStaff from "../withStaff";
import { isAuth } from "../../../helpers/authToken";
import { API } from "../../../config";
import { formatNumber, numToWords } from "../../../helpers/numberFormatter";
import { formatDate } from "../../../helpers/dateFormatter";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const CashProjection = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [currentStaff, setCurrentStaff] = useState({});
	const [modal, setModal] = useState(false);
	const [currentProjection, setCurrentProjection] = useState({});
	const [cashProjection, setCashProjection] = useState([]);
	const [currencies, setCurrencies] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [state, setState] = useState({
		bankName: "",
		currencyCode: "",
		requestAmount: 0,
		description: "",
		supplierName: "",
		currentStatusComment: "",
		error: "",
		success: "",
		buttonText: "Save",
	});
	const {
		bankName,
		currencyCode,
		requestAmount,
		description,
		supplierName,
		currentStatusComment,
		error,
		success,
		buttonText,
	} = state;

	useEffect(() => {
		getStaff();
		getOwnCashProjection();
		loadCurrency();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const getStaff = async () => {
		setLoading(true);
		const response = await axios.get(
			`${API}/staff_email/${isAuth().email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.staffProfile);
		setLoading(false);
	};

	const getOwnCashProjection = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/ownCashRequest/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setCashProjection(response.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const getCashProjection = async (cashRequestID) => {
		setCurrentProjection({});
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/oneCashRequest/${cashRequestID}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setCurrentProjection(response.data.cashProjection);
			setLoading(false);
			setState({
				...state,
				...response.data.cashProjection,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const loadCurrency = async () => {
		const response = await axios.get(`${API}/currencies`);
		setCurrencies(response.data);
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

	const handleNewCashRequest = () => {
		setState({
			...state,
			bankName: "",
			currencyCode: "",
			requestAmount: 0,
			description: "",
			supplierName: "",
			currentStatusComment: "",
			error: "",
			success: "",
			buttonText: "Save",
		});
		setSearchText("");
		setCurrentProjection({});
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.put(
			`${API}/searchOwnCashRequest`,
			{ searchText },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		// console.log(response.data);
		setCashProjection(response.data);
		setLoading(false);
		handleNewCashRequest();
		setSearchText("");
	};

	const toggle = (projection) => {
		setModal(!modal);
		setCurrentProjection(projection);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle}>
						Removing a Cash Projection
					</ModalHeader>
					<ModalBody>
						<div>
							Amount:&emsp;
							<strong>
								{currentProjection &&
									formatNumber(
										currentProjection.requestAmount
									)}{" "}
								{currentProjection &&
									currentProjection.currencyCode}
							</strong>
							<br />
							<br />
							<span className="text-danger">
								You're about to permanently remove the selected
								cash projection!
							</span>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button color="warning" onClick={handleDelete}>
							Continue
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const handleDelete = async () => {
		try {
			window.scrollTo(0, 0);
			setLoading(true);
			setModal(!modal);
			const response = await axios.put(
				`${API}/deleteCashRequest/${currentProjection._id}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getOwnCashProjection();
			handleNewCashRequest();
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error: error.response.data.error,
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!bankName ||
			bankName === "" ||
			!currencyCode ||
			currencyCode === "" ||
			!requestAmount ||
			requestAmount === 0 ||
			requestAmount === "0" ||
			supplierName === "" ||
			!supplierName
		) {
			setState({
				...state,
				buttonText: "Save",
				error: "Please provide valid paying bank, amount and currency, and beneficiary!",
			});
			return;
		}
		setLoading(true);
		setState({ ...state, buttonText: "Saving to database..." });
		try {
			const response = await axios.post(
				`${API}/newCashRequest`,
				{
					bankName,
					currencyCode,
					requestAmount,
					description,
					supplierName,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			getOwnCashProjection();
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: response && response.data.message,
			});
			handleNewCashRequest();
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
			handleNewCashRequest();
		}
	};

	const handleUpdate = async () => {
		setLoading(true);
		setState({ ...state, buttonText: "Updating..." });
		try {
			const response = await axios.put(
				`${API}/editCashRequest/${currentProjection._id}`,
				{
					bankName,
					currencyCode,
					requestAmount,
					description,
					supplierName,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			getOwnCashProjection();
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				success: response.data && response.data.message,
			});
			handleNewCashRequest();
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
			handleNewCashRequest();
		}
	};

	const addCashRequestForm = () => (
		<Fragment>
			<div className="row">
				<div className="form-group col-md-3">
					<label className="text-muted ">Paying Bank: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("bankName")}
						value={bankName}
						required
					>
						<option></option>
						<option>Urwego</option>
						<option>Other Banks - RIPPS</option>
						<option>Other Banks - CHECK</option>
						<option>Wire transfer - TRANSFER ABROAD</option>
					</select>
				</div>

				<div className="form-group col-md-3">
					<label className="text-muted ">Amount: </label> <br />
					<input
						type="number"
						onChange={handleChange("requestAmount")}
						className="form-control"
						value={requestAmount}
						required
					/>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Currency: </label> <br />
					<select
						className="form-control"
						onChange={handleChange("currencyCode")}
						value={currencyCode}
						required
					>
						<option></option>
						{currencies.length > 0 &&
							currencies.map((c, i) => (
								<option key={i} value={c.currency_code}>
									{c.currency}
								</option>
							))}
					</select>
				</div>
				<div className="form-group col-md-3">
					<label className="text-muted ">Beneficiary: </label> <br />
					<input
						type="text"
						onChange={handleChange("supplierName")}
						className="form-control"
						value={supplierName}
						required
						title="Beneficiary can be a service provider or the one posting the request."
					/>
				</div>
			</div>

			<div className="row">
				<div className="form-group col-md-6">
					<label className="text-muted ">Description: </label> <br />
					<textarea
						rows="3"
						onChange={handleChange("description")}
						className="form-control"
						value={description}
					/>
				</div>
				<div className="form-group col-md-6">
					<label className="text-muted ">Finance Comment: </label>{" "}
					<br />
					<textarea
						rows="3"
						onChange={handleChange("currentStatusComment")}
						className="form-control"
						value={currentStatusComment}
						disabled
					/>
				</div>
			</div>
			<hr />
			<div className="row">
				<div className="col-md-4 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/dashboard/")}
					>
						Back
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={handleNewCashRequest}
						className="btn btn-success btn-block"
						title="Clear all fields to be able to add a new user role."
					>
						Clear
					</button>
				</div>
				<div className="col-md-4 mt-1">
					<button
						onClick={
							currentProjection && currentProjection._id
								? handleUpdate
								: handleSubmit
						}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listOwnCashRequests = () =>
		cashProjection &&
		cashProjection.cashRequests &&
		cashProjection.cashRequests.length > 0 &&
		cashProjection.cashRequests.map((cp, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					{i + 1}.&emsp;
					<span>{cp.bankName}</span>
					&emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{formatDate(cp.requestDate)}
					</span>
					&emsp; &emsp;
					<span className="text-danger" style={{ fontSize: "13px" }}>
						{formatNumber(cp.requestAmount)} {cp.currencyCode}
					</span>
					&emsp; &emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						{cp.currentRequestStatus}
					</span>
					&emsp; &emsp;
					{cp.supplierName && (
						<span
							className="text-primary"
							style={{ fontSize: "16px" }}
						>
							{cp.supplierName}
						</span>
					)}
					{cp.currentRequestStatus === "PENDING" && (
						<span
							className="btn btn-sm float-right"
							onClick={() => toggle(cp)}
							title="Delete Cash Request."
						>
							<MinusCircleOutlined className="text-danger" />
						</span>
					)}
					{/* {cp.currentRequestStatus === "PENDING" && ( */}
					<span
						className="btn btn-sm float-right"
						onClick={() => getCashProjection(cp._id)}
						title="Edit Cash Request"
					>
						<EditOutlined className="text-info" />
					</span>
					{/* )} */}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Cash Projection</h4>
				</div>
				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addCashRequestForm()}</div>
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
							placeholder='Type here part of paying bank or status of request (PENDING, PROCESSED or CANCELLED), then press "Enter" to search.'
							style={{ width: "100%" }}
							title='Type here part of paying bank or status of request (PENDING, PROCESSED or CANCELLED), then press "Enter" to search.'
						/>
					</form>
				</div>

				{listOwnCashRequests()}
			</div>
			{modalDialog()}
			{/* {JSON.stringify(cashProjection)} */}
		</Layout>
	);
};
export default withStaff(CashProjection);
