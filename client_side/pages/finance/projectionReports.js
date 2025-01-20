import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import withStaff from "./withFinance";
import { API } from "../../config";
import { Table } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const projectionReport = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [cashProjection, setCashProjection] = useState([]);
	const [state, setState] = useState({
		currentRequestStatus: "All",
		bankName: "All",
		error: "",
		success: "",
	});
	const { currentRequestStatus, bankName, error, success } = state;

	const today = new Date();
	const [weekStartDate, setWeekStartDate] = useState(
		new Date(today.setDate(today.getDate() - today.getDay()))
	);
	const [weekEndDate, setWeekEndDate] = useState(
		new Date(today.setDate(today.getDate() - today.getDay() + 6))
	);

	useEffect(() => {
		getCurrentWeekProjection();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
			buttonText: "Save",
		});
	};

	const columns = [
		{
			title: "REQUESTER",
			dataIndex: "requesterName",
			key: "requesterName",
		},
		{
			title: "PAYING BANK",
			dataIndex: "bankName",
			key: "bankName",
		},
		{
			title: "AMAOUNT",
			dataIndex: "requestAmount",
			key: "requestAmount",
		},
		{
			title: "CURRENCY",
			dataIndex: "currencyCode",
			key: "currencyCode",
		},
		{
			title: "BENEFICIARY",
			dataIndex: "supplierName",
			key: "supplierName",
		},
		{
			title: "STATUS",
			dataIndex: "currentRequestStatus",
			key: "currentRequestStatus",
		},
		{
			title: "DEPARTMENT",
			dataIndex: "departmentName",
			key: "departmentName",
		},
		{
			title: "BRANCH",
			dataIndex: "branchName",
			key: "branchName",
		},
	];

	const getCurrentWeekProjection = async () => {
		if (weekStartDate > weekEndDate) {
			setState({
				...state,
				error: "Ending date cannot be prior to starting date!",
			});
			return;
		} else if (
			!weekStartDate ||
			!weekEndDate ||
			weekEndDate === null ||
			weekStartDate === null
		) {
			setState({
				...state,
				error: "Provide both start and end dates, please!",
			});
			return;
		} else {
			setLoading(true);
			try {
				const response = await axios.put(
					`${API}/cashProjectionReport/`,
					{
						weekStartDate,
						weekEndDate,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (Array.isArray(response.data.cashRequests)) {
					setCashProjection(response.data.cashRequests);
					setLoading(false);
				}
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
		}
	};

	const exportCashProjection = async () => {
		try {
			if (weekStartDate > weekEndDate) {
				setState({
					...state,
					error: "Ending date cannot be prior to starting date!",
				});
				return;
			} else if (
				!weekStartDate ||
				!weekEndDate ||
				weekEndDate === null ||
				weekStartDate === null
			) {
				setState({
					...state,
					error: "Provide both start and end dates, please!",
				});
				return;
			} else {
				setLoading(true);
				const response = await axios.put(
					`${API}/exportCashProjection`,
					{
						weekStartDate,
						weekEndDate,
					},
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				if (
					Array.isArray(response.data.cashRequests) &&
					response.data.cashRequests.length > 0
				) {
					// console.log(response.data.cashRequests);
					let csvContent = response.data.cashRequests
						.map((e) => e.join(","))
						.join("\n");
					const encodedUri =
						"data:text/csv;charset=utf-8," +
						encodeURIComponent(csvContent);
					const link = document.createElement("a");
					link.setAttribute("href", encodedUri);
					link.setAttribute("download", "cashRequests.csv");
					document.body.appendChild(link);
					link.click();
					setLoading(false);
				}
			}
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

	const setDatesForm = () => (
		<div className="row ">
			<div className="form-group col-md-3">
				{/* <label className="text-muted ">Start Date: </label> */}
				<DatePicker
					dateFormat="dd-MM-yyyy"
					selected={weekStartDate}
					onChange={(date) => {
						setWeekStartDate(date);
					}}
					title="Set week START date for which to retrieve data"
				/>
			</div>
			<div className="form-group col-md-3">
				{/* <label className="text-muted ">End Date: </label> */}
				<DatePicker
					dateFormat="dd-MM-yyyy"
					selected={weekEndDate}
					onChange={(date) => {
						setWeekEndDate(date);
					}}
					title="Set week END date for which to retrieve data"
				/>
			</div>

			<button
				className="btn btn-info btn-sm ml-1 form-group"
				onClick={() => router.push("/finance/")}
				title="Go back to main menu"
			>
				Back
			</button>
			<button
				className="btn btn-primary btn-sm ml-1 form-group"
				onClick={getCurrentWeekProjection}
				title="View data within selected date boundaries"
			>
				View
			</button>
			<button
				className="btn btn-primary btn-sm ml-1 form-group"
				onClick={exportCashProjection}
				title="Send data to excel"
			>
				Download
			</button>
		</div>
	);

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Cash Projection Reports</h4>
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
				<div className="row alert alert-secondary">
					<div className="col-md-12">{setDatesForm()}</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">
						<Table dataSource={cashProjection} columns={columns} />
					</div>
				</div>
			</div>
			{/* {JSON.stringify(currentRequestStatus)} */}
		</Layout>
	);
};
export default withStaff(projectionReport);
