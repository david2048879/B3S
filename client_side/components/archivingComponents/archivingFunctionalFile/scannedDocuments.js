import axios from "axios";
import { useState, useEffect } from "react";
import { API } from '../../../config';

const ScannedDocuments = ({ token }) => {
    const [loading, setLoading] = useState(false);
    const [scannedDocuments, setScannedDocuments] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadPublicDocs();
    }, []);

    const loadScanned = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${token}`
                }
            }
            setLoading(true);
            const response = await axios.get(`${API}/archive/admin/alldocs`, config)
            setScannedDocuments(response.data.alldocs);
            setLoading(false);
        }
        catch (error) {
            console.log(error);
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
    const listPublicDocument = () =>
        scannedDocuments &&
        scannedDocuments.map((doc, i) => (
            <div key={i} className="row alert alert-light shadow-sm rounded-lg p-4 mb-4">
                <div className="col-md-9">
                    {/* Document Title */}
                    {doc.content ? (
                        <h5 className="mb-2">
                            <a
                                href={doc.content.url}
                                target="_blank"
                                className="text-primary font-weight-bold"
                                style={{ fontSize: '20px', textDecoration: 'none' }}
                                rel="noopener noreferrer"
                            >
                                {doc.title.length <= 67
                                    ? doc.title
                                    : doc.title.substring(0, 67) + "..."}
                            </a>
                        </h5>
                    ) : (
                        <h5 className="text-muted">No title available</h5>
                    )}

                    {/* Document Info */}
                    <div className="d-flex flex-wrap align-items-center mt-2">
                        <div className="mr-4">
                            <span className="text-secondary"><strong>Type: </strong></span>
                            <span className="text-dark">{doc.docType}</span>
                        </div>
                        <div className="mr-4">
                            <span className="text-secondary"><strong>Department: </strong></span>
                            <span className="text-dark">{doc.department}</span>
                        </div>
                    </div>
                </div>

                <div className="col-md-3 text-md-right text-center">
                    {/* Scanned Date */}
                    <div className="text-muted mb-2">
                        <i className="fa-regular fa-clock mr-1"></i>
                        <span>{new Date(doc.scannedOn).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}</span>
                    </div>
                    {/* Business Badge */}
                    <span className="badge badge-pill badge-info py-2 px-3" style={{ fontSize: '14px' }}>
                        {doc.business || "N/A"}
                    </span>
                </div>
            </div>
        ));

    return (
        <div className="col-md-10 offset-md-1 pt-2">
            <div className="row">
                <h4>Scanned Documents</h4>
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

            <div className="row">
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

            {scannedDocuments && scannedDocuments.length > 0 && listPublicDocument()}
        </div>
    );
};
export default ScannedDocuments