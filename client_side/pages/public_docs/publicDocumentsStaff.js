import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import Layout from "../../components/Layout";
import withStaff from "../staff/withStaff";
import { API } from "../../config";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const publicDocumentStaff = ({ token }) => {
	const [loading, setLoading] = useState(false);
	const [publicDocs, setPublicDocs] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [state, setState] = useState({
		error: "",
		success: "",
	});
	const { success, error } = state;

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
		setLoading(true);
		const response = await axios.get(`${API}/listPublicDocuments`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setPublicDocs(response.data.myPublicDocs);
		setLoading(false);
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
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Circulated Documents</h4>
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
					<button
						className="btn btn-info btn-sm ml-1 form-group"
						onClick={goBack}
					>
						Back
					</button>
				</div>

				{publicDocs && publicDocs.length > 0 && listPublicDocument()}
			</div>
			{/* {JSON.stringify(publicDocs)} */}
		</Layout>
	);
};
export default withStaff(publicDocumentStaff);
