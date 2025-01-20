import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import Layout from "../../components/Layout";
import withHR from "./withHR";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";
import { formatNumber } from "../../helpers/numberFormatter";

const uploadFile = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [file, setFile] = useState();
	const [array, setArray] = useState([]);
	const [fileUploadText, setFileUploadText] = useState("Choose File");
	try {
		const fileReader = new FileReader();
	} catch (error) {
		console.log("Somethis is wrong with fileReader");
	}

	const [state, setState] = useState({
		error: "",
		success: "",
	});
	const { error, success } = state;

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const handleOnChange = (e) => {
		setFile(e.target.files[0]);
		setFileUploadText(e.target.files[0] && e.target.files[0].name);
	};

	const csvFileToArray = (string) => {
		const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
		const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
		const array = csvRows.map((i) => {
			const values = i.split(",");
			const obj = csvHeader.reduce((object, header, index) => {
				object[header] = values[index];
				return object;
			}, {});
			return obj;
		});

		setArray(array);
	};

	const handleOnSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (file) {
				fileReader.onload = function (event) {
					const text = event.target.result;
					csvFileToArray(text);
				};

				fileReader.readAsText(file);
			}
		} catch (error) {
			setState({
				...state,
				error: "",
				success:
					"Make sure you selected correct file having correct format!",
			});
		}
		setLoading(false);
	};

	const handleLoadData = async (e) => {
		e.preventDefault();
		if(fileUploadText !== "deductions.csv" && fileUploadText !=="allowances.csv"){
			setState({ ...state, error: "Make sure you selected a right file!" });
			return
		}
		setLoading(true);		
		try {
			const response = await axios.put(
				`${API}/loadFile/`,
				{
					fileUploadText,
					array,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			setState({
				...state,
				success: response.data && response.data.message,
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

	const readFileForm = () => (
		<Fragment>
			<div className="row">
				<div className="col-md-3 mt-1">
					<button
						className="btn btn-info btn-block"
						onClick={() => router.push("/personnel/monthlySalary")}
					>
						Back
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<label className="btn btn-outline-secondary btn-block">
						{fileUploadText}
						<input
							onChange={handleOnChange}
							type={"file"}
							id={"csvFileInput"}
							accept={".csv"}
							className="form-control"
							hidden
						/>
					</label>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={(e) => {
							handleOnSubmit(e);
						}}
						className="btn btn-outline-primary btn-block"
						title="Display data from the selected file."
					>
						{array.length > 0
							? array.length + " records"
							: "View Data"}
					</button>
				</div>
				<div className="col-md-3 mt-1">
					<button
						onClick={(e) => {
							handleLoadData(e);
						}}
						className="btn btn-outline-warning btn-block"
						title="Upload data from the selected file into the database of deductions or allowances"
					>
						Load Data
					</button>
				</div>
			</div>
		</Fragment>
	);

	const listAllowances = () =>
		array.map((allowance, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span>{allowance.EMPLOYEE_CODE}</span>
					&emsp;
					<span>{allowance.ALLOWANCE_NAME}</span>
					&emsp;
					<span>Repeated: {allowance.REPEATED}</span>
					&emsp;
					<span>
					{allowance["ALLOWANCE_AMOUNT\r"] && formatNumber(parseInt(allowance["ALLOWANCE_AMOUNT\r"].replace('\r', '')))}
					</span>
				</div>
			</div>
		));

	const listDeductions = () =>
		array.map((deduction, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span>{deduction.EMPLOYEE_CODE}</span>
					&emsp;
					<span>{deduction.DEDUCTION_NAME}</span>
					&emsp;
					<span>Repeated: {deduction.REPEATED}</span>
					&emsp;
					<span>
						{deduction["DEDUCTION_AMOUNT\r"] && formatNumber(parseInt(deduction["DEDUCTION_AMOUNT\r"].replace('\r', '')))}
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Upload CSV file</h4>
				</div>

				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}

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
				<div className="row alert alert-secondary">
					<div className="col-md-12">{readFileForm()}</div>
				</div>
				{array.length > 0 && (
					<div>
						<div className="col-md-12">
							{fileUploadText === "allowances.csv" &&
								listAllowances()}
						</div>
						<div className="col-md-12">
							{fileUploadText === "deductions.csv" &&
								listDeductions()}
						</div>
					</div>
				)}
			</div>
			{/* {JSON.stringify(state)} */}
			{/* {JSON.stringify(array)} */}
			{/* {JSON.stringify(
				array.length > 0 &&
					parseInt(
						array[0].EMPLOYEE_CODE,
						array[0].DEDUCTION_AMOUNT.replace('"', "").replace(
							'"',
							""
						)
					)
			)} */}
			{/* {JSON.stringify(
				array.length > 0 &&
					array[0].Month.replace('"', "").replace('"', "")
			)} */}
		</Layout>
	);
};
export default withHR(uploadFile);
