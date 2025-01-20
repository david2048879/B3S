import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { EyeOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import Layout from "../../components/Layout";
import withInfoSharing from "./withInfoSharing";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const publicDocumentInfoSharing = ({ token }) => {
	const [modal, setModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [docTitle, setDocTitle] = useState("");
	const [searchText, setSearchText] = useState("");
	const [docKey, setDocKey] = useState("");
	const [publicDocs, setPublicDocs] = useState([]);

	const [state, setState] = useState({
		title: "",
		description: "",
		error: "",
		success: "",
		formData: process.browser && new FormData(),
		buttonText: "Save",
		documentUploadText: "Choose a PDF Document",
	});
	const {
		title,
		description,
		success,
		error,
		formData,
		buttonText,
		documentUploadText,
	} = state;

	useEffect(() => {
		loadPublicDocs();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 14000);
		return () => clearTimeout(timer);
	}, [state]);

	const loadPublicDocs = async () => {
		const response = await axios.get(`${API}/listPublicDocuments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setPublicDocs(response.data.myPublicDocs);
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
			formData: process.browser && new FormData(),
			buttonText: "Save",
			documentUploadText: "Choose a PDF Document",
			success: "",
			error: "",
		});
		const docIndex = publicDocs.findIndex((doc) => doc._id === docID);
		if (docIndex !== -1) {
			setState({
				...state,
				title: publicDocs[docIndex].title,
				description: publicDocs[docIndex].description,
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
		try {
			const response = await axios.put(
				`${API}/delPublicDocumentInfoSharing/`,
				{
					publicDocs,
					documentKey: docKey,
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
				title: "",
				description: "",
				formData: process.browser && new FormData(),
				buttonText: "Save",
				documentUploadText: "Choose a PDF Document",
				success: response && response.data && response.data.message,
			});
			loadPublicDocs();
		} catch (error) {
			setState({
				...state,
				error:
					error &&
					error.response &&
					error.response.data &&
					error.response.data.error,
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
		setState({ ...state, buttonText: "Saving" });
		setLoading(true);
		try {
			const response = await axios.post(
				`${API}/addPublicDocumentInfoSharing`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			setLoading(false);
			setState({
				...state,
				title: "",
				description: "",
				formData: process.browser && new FormData(),
				buttonText: "Saved",
				documentUploadText: "Choose a PDF Document",
				success: response && response.data && response.data.message,
			});
			loadPublicDocs();
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				buttonText: "Save",
				error:
					error &&
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.put(
			`${API}/listSearchedPublicDocuments`,
			{ searchText },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setPublicDocs(response.data.myPublicDocs);
		setLoading(false);
		setSearchText("");
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const goBack = () => {
		window.history.back();
	};

	const addDocumentForm = () => (
		<React.Fragment>
			<div className="form-group">
				<label className="text-muted">Document Title</label>
				<input
					onChange={handleChange("title")}
					value={title}
					type="text"
					className="form-control"
					required
				/>
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

	const listPublicDocument = () =>
		publicDocs &&
		publicDocs.map((doc, i) => (
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
					<h4>Circulate Documents</h4>
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
							placeholder='Type here part of title of description of a document, then press "Enter" to search.'
							style={{ width: "100%" }}
							title='Type here part of title of description of a document, then press "Enter" to search.'
						/>
					</form>
				</div>

				{publicDocs && publicDocs.length > 0 && listPublicDocument()}
			</div>
			{modalDialog()}
			{/* {JSON.stringify(router)} */}
		</Layout>
	);
};
export default withInfoSharing(publicDocumentInfoSharing);
