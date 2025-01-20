import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../../components/Layout";
import withStaff from "../../staff/withStaff";
import { API } from "../../../config";
import { showErrorMessage, showSuccessMessage } from "../../../helpers/alerts";

const tripDocuments = ({ token }) => {
	const router = useRouter();
	const { document_tripid } = router.query;
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [docTitle, setDocTitle] = useState("");
	const [docKey, setDocKey] = useState("");
	const [tripDocuments, setTripDocuments] = useState([]);
	const [currentTrip, setCurrentTrip] = useState({});

	const [state, setState] = useState({
		title: "",
		error: "",
		success: "",
		formData: process.browser && new FormData(),
		buttonText: "Save",
		documentUploadText: "Choose a PDF Document",
	});
	const { title, success, error, formData, buttonText, documentUploadText } =
		state;

	useEffect(() => {
		getTrip();
	}, [router]);

	const getTrip = async () => {
		const response = await axios.get(
			`${API}/oneTripRequest/${document_tripid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentTrip(response.data.tripRequest);
		setTripDocuments(response.data.tripRequest.tripDocuments);
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
			docType: "",
			formData: process.browser && new FormData(),
			buttonText: "Save",
			documentUploadText: "Choose a PDF Document",
			success: "",
			error: "",
		});
		const docIndex = tripDocuments.findIndex((doc) => doc._id === docID);
		if (docIndex !== -1) {
			setState({
				...state,
				title: tripDocuments[docIndex].title,
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
		setTripDocuments(currentTrip.tripDocuments);

		const docIndex = tripDocuments.findIndex(
			(doc) => doc.content.key === docKey
		);
		if (docIndex !== -1) tripDocuments.splice(docIndex, 1);
		try {
			const response = await axios.put(
				`${API}/delTripDocument/${document_tripid}`,
				{
					tripDocuments,
					documentKey: docKey,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getTrip();
			setLoading(false);
			setState({
				...state,
				title: "",
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
				`${API}/tripDocument/${currentTrip._id}`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getTrip();
			setLoading(false);
			setState({
				...state,
				title: "",
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
		window.history.back();
	};

	const addDocumentForm = () => (
		<React.Fragment>
			<div className="row">
				<div className="form-group col-md-12">
					<label className="text-muted">Document Title</label>
					<input
						onChange={handleChange("title")}
						value={title}
						type="text"
						className="form-control"
						required
					/>
				</div>
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

	const listTripDocument = () =>
		tripDocuments &&
		tripDocuments.map((doc, i) => (
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

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Trip Documents</h4>
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
					<div className="col-md-12">{addDocumentForm()}</div>
				</div>
				{tripDocuments &&
					tripDocuments.length > 0 &&
					listTripDocument()}
			</div>
			{modalDialog()}
			{/* {JSON.stringify(router)} */}
		</Layout>
	);
};
export default withStaff(tripDocuments);
