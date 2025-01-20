import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../../components/Layout";
// import withHR from "../withHR";
import withStaff from "../../staff/withStaff";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const StaffDocuments = ({ token }) => {
	const router = useRouter();
	const { document_staffid } = router.query;
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [docTitle, setDocTitle] = useState("");
	const [docKey, setDocKey] = useState("");
	const [currentStaff, setCurrentStaff] = useState({});
	const [staffDocuments, setStaffDocuments] = useState([]);
	const [expDocuments, setExpDocuments] = useState([]);
	const [eduDocuments, setEduDocuments] = useState([]);
	const [otherDocuments, setOtherDocuments] = useState([]);

	const [state, setState] = useState({
		title: "",
		description: "",
		docType: "",
		error: "",
		success: "",
		formData: process.browser && new FormData(),
		buttonText: "Save",
		documentUploadText: "Choose a PDF Document",
	});
	const {
		title,
		description,
		docType,
		success,
		error,
		formData,
		buttonText,
		documentUploadText,
	} = state;

	useEffect(() => {
		getStaff();
	}, [router]);

	useEffect(() => {
		let expDocs = [];
		let eduDocs = [];
		let otherDocs = [];
		staffDocuments.forEach((doc) => {
			if (doc.docType === "Work Experience") {
				expDocs.push(doc);
			} else if (doc.docType === "Education") {
				eduDocs.push(doc);
			} else {
				otherDocs.push(doc);
			}
		});
		setExpDocuments(expDocs);
		setEduDocuments(eduDocs);
		setOtherDocuments(otherDocs);
	}, [staffDocuments]);

	const getStaff = async () => {
		const response = await axios.get(
			`${API}/staffProfile/${document_staffid}`,
			{
				//profile
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentStaff(response.data.myProfile);
		setStaffDocuments(response.data.myProfile.cvDocuments);
	};

	const toggle = (doc) => {
		setModal(!modal);
		setDocTitle(doc && doc.title);
		setDocKey(doc && doc.content && doc.content.key);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader toggle={toggle}>Staff Documents</ModalHeader>
					<ModalBody>
						Delete <strong>{docTitle}</strong>?{" "}
					</ModalBody>
					<ModalFooter>
						<Button color="danger" onClick={handleDelete}>
							Delete
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const handleChange = (name) => (e) => {
		const value = name === "document" ? e.target.files[0] : e.target.value;
		const documentName =
			name === "document"
				? e.target.files[0].name
				: "Choose a PDF Document";
		formData.set(name, value);
		setState({
			...state,
			[name]: value,
			error: "",
			success: "",
			documentUploadText: documentName,
			buttonText: "Save",
		});
	};

	const handleNewDocument = () => {
		setState({
			...state,
			title: "",
			description: "",
			docType: "",
			formData: process.browser && new FormData(),
			buttonText: "Save",
			documentUploadText: "Choose a PDF Document",
			success: "",
			error: "",
		});
	};

	const displayDocData = async (docID) => {
		setState({
			...state,
			title: "",
			description: "",
			docType: "",
			formData: process.browser && new FormData(),
			buttonText: "Save",
			documentUploadText: "Choose a PDF Document",
			success: "",
			error: "",
		});
		const docIndex = staffDocuments.findIndex((doc) => doc._id === docID);
		if (docIndex !== -1) {
			setState({
				...state,
				title: staffDocuments[docIndex].title,
				description: staffDocuments[docIndex].description,
				docType: staffDocuments[docIndex].docType,
				formData: process.browser && new FormData(),
				buttonText: "Save",
				documentUploadText: "Choose a PDF Document",
				success: "",
				error: "",
			});
		}
	};

	const handleDelete = async () => {
		setModal(!modal);
		setLoading(true);
		setStaffDocuments(currentStaff.cvDocuments);

		const docIndex = staffDocuments.findIndex(
			(doc) => doc.content.key === docKey
		);
		if (docIndex !== -1) staffDocuments.splice(docIndex, 1);
		try {
			const response = await axios.put(
				`${API}/delStaffDocument/${document_staffid}`,
				{
					staffDocuments,
					documentKey: docKey,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getStaff();
			setLoading(false);
			setState({
				...state,
				title: "",
				description: "",
				docType: "",
				formData: process.browser && new FormData(),
				buttonText: "Save",
				documentUploadText: "Choose a PDF Document",
				success: response.data && response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				error: error.response.data.error,
			});
			setLoading(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.has("document")) {
			return setState({
				...state,
				error: "Please, pick a document to upload!",
			});
		}
		// formData.set("staff_id", document_staffid);
		setState({ ...state, buttonText: "Saving" });
		setLoading(true);
		// console.log(...formData)
		try {
			const response = await axios.post(
				`${API}/staffDocument/${currentStaff._id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getStaff();
			setLoading(false);
			setState({
				...state,
				title: "",
				docType: "",
				description: "",
				formData: process.browser && new FormData(),
				buttonText: "Saved",
				documentUploadText: "Choose a PDF Document",
				// success: response.data.message,
			});
		} catch (error) {
			setState({
				...state,
				buttonText: "Save",
				error: error.response.data.error,
			});
			setLoading(false);
		}
	};

	const goBack = () => {
		// if(currentStaff.empCode){
		// 	router.push(`/staff/profile/${currentStaff.empCode}`)
		// }else{
		// 	router.push(`/dashboard/`)
		// }
		window.history.back();
	};

	const addDocumentForm = () => (
		<React.Fragment>
			<div className="row">
				<div className="form-group col-md-8">
					<label className="text-muted">Document Name</label>
					<input
						onChange={handleChange("title")}
						value={title}
						type="text"
						className="form-control"
						required
					/>
				</div>
				<div className="form-group col-md-4">
					<label className="text-muted ">Document Type:</label>
					<select
						className="form-control"
						onChange={handleChange("docType")}
						value={docType}
					>
						<option className="text-info font-italic"></option>
						<option key="PHD" value="Education">
							Education
						</option>
						<option key="Masters" value="Work Experience">
							Work Experience
						</option>
						<option key="Masters" value="Other">
							Other
						</option>
					</select>
				</div>
			</div>

			<div className="form-group">
				<label className="text-muted">Document Description</label>
				<textarea
					onChange={handleChange("description")}
					value={description}
					className="form-control"
					rows="3"
				/>
			</div>
			<div className="form-group">
				<label className="btn btn-outline-secondary btn-block">
					{documentUploadText}
					<input
						onChange={handleChange("document")}
						type="file"
						accept="application/pdf"
						className="form-control"
						hidden
					/>
				</label>
			</div>
			<div className="row">
				<div className="col-md-4">
					<button onClick={goBack} className="btn btn-info btn-block">
						Back
					</button>
				</div>
				<div className="col-md-4">
					<button
						onClick={handleNewDocument}
						className="btn btn-success btn-block"
					>
						Clear
					</button>
				</div>
				<div className="col-md-4">
					<button
						onClick={handleSubmit}
						className="btn btn-outline-warning btn-block"
					>
						{buttonText}{" "}
					</button>
				</div>
			</div>
		</React.Fragment>
	);

	const listExpDocument = () =>
		expDocuments &&
		expDocuments.map((doc, i) => (
			<div key={i} className="row alert alert-secondary p-1">
				<div className="col">
					{doc.content ? (
						<a
							href={doc.content.url}
							target="_blank"
							className="text-info"
							rel="noopener noreferrer"
						>
							{doc.title.length <= 67
								? doc.title
								: doc.title.substring(0, 67) + "..."}
						</a>
					) : (
						""
					)}
					<span
						onClick={() => displayDocData(doc._id)}
						className="btn btn-sm float-right"
						title="Display document data"
					>
						<EyeOutlined className="text-info" />
					</span>
					<span
						onClick={() => toggle(doc)}
						className="btn btn-sm float-right"
						title="Remove document permanently"
					>
						<CloseCircleOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	const listEduDocument = () =>
		eduDocuments &&
		eduDocuments.map((doc, i) => (
			<div key={i} className="row alert alert-secondary p-1">
				<div className="col">
					{doc.content ? (
						<a
							href={doc.content.url}
							target="_blank"
							className="text-info"
						>
							{doc.title.length <= 67
								? doc.title
								: doc.title.substring(0, 67) + "..."}
						</a>
					) : (
						""
					)}
					<span
						onClick={() => displayDocData(doc._id)}
						className="btn btn-sm float-right"
						title="Display document data"
					>
						<EyeOutlined className="text-info" />
					</span>
					<span
						onClick={() => toggle(doc)}
						className="btn btn-sm float-right"
						title="Remove document permanently"
					>
						<CloseCircleOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	const listOtherDocument = () =>
		otherDocuments &&
		otherDocuments.map((doc, i) => (
			<div key={i} className="row alert alert-secondary p-1">
				<div className="col">
					{doc.content ? (
						<a
							href={doc.content.url}
							target="_blank"
							className="text-info"
						>
							{doc.title.length <= 67
								? doc.title
								: doc.title.substring(0, 67) + "..."}
						</a>
					) : (
						""
					)}
					<span
						onClick={() => displayDocData(doc._id)}
						className="btn btn-sm float-right"
						title="Display document data"
					>
						<EyeOutlined className="text-info" />
					</span>
					<span
						onClick={() => toggle(doc)}
						className="btn btn-sm float-right"
						title="Remove document permanently"
					>
						<CloseCircleOutlined className="text-danger" />
					</span>
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Official Documents</h4>
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
				<div className="row alert bg-light">
					<div className="col">
						<h5 className="text-primary font-weight-bold">
							{currentStaff.empNames}
						</h5>
					</div>
					<div className="row">
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff.empCode ? currentStaff.empCode : ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff.phone ? currentStaff.phone : ""}
						</h6>
						&emsp;
						<h6 style={{ fontSize: "12px", color: "black" }}>
							{currentStaff.email ? currentStaff.email : ""}
						</h6>
						&emsp;
					</div>
				</div>

				<div className="row alert alert-secondary">
					<div className="col-md-12">{addDocumentForm()}</div>
				</div>
				{expDocuments && expDocuments.length > 0 && (
					<h6
						style={{
							fontSize: "16px",
							color: "purple",
							fontWeight: "bold",
						}}
					>
						EXPERIENCE
					</h6>
				)}
				{expDocuments && expDocuments.length > 0 && listExpDocument()}

				{eduDocuments && eduDocuments.length > 0 && (
					<h6
						style={{
							fontSize: "16px",
							color: "purple",
							fontWeight: "bold",
						}}
					>
						EDUCATION
					</h6>
				)}
				{eduDocuments && eduDocuments.length > 0 && listEduDocument()}

				{otherDocuments && otherDocuments.length > 0 && (
					<h6
						style={{
							fontSize: "16px",
							color: "purple",
							fontWeight: "bold",
						}}
					>
						OTHER DOCUMENTS
					</h6>
				)}
				{otherDocuments &&
					otherDocuments.length > 0 &&
					listOtherDocument()}
			</div>
			{modalDialog()}
			{/* {JSON.stringify(router)} */}
		</Layout>
	);
};
export default withStaff(StaffDocuments);
