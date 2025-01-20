import Image from "next/image";


const InitiateScan = () => {
    return (
        <>
            <div style={{ width: "100vw", fontFamily: "monospace" }}>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card mt-4 shadow" style={{ height: "80vh",borderRadius:"8px" }}>
                            <h5 className="text-center mt-4" style={{ color: "#001836", fontWeight: "bold", fontSize: "26px" }}>Notice before scanning, pay attention to this</h5>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <div className="d-flex justify-content-end">
                                        <Image
                                            src="/static/e-filing/scanpage.svg"
                                            width={300}
                                            height={300}
                                        />
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex flex-column mx-3" style={{ marginTop: "60px" }}>
                                        <div className="d-flex flex-row">
                                            <Image
                                                src="/static/e-filing/noticeicons.svg"
                                                width={22}
                                                height={22}
                                            />
                                            <p className="mx-3 mt-2" style={{ color: "#3d4d5c", fontSize: "19px" }}>Verify the document</p>
                                        </div>
                                        <div className="d-flex flex-row ">
                                            <Image
                                                src="/static/e-filing/noticeicons.svg"
                                                width={22}
                                                height={22}
                                            />
                                            <p className="mx-3 mt-2" style={{ color: "#3d4d5c", fontSize: "19px" }}>Verify the document</p>
                                        </div>
                                        <div className="d-flex flex-row">
                                            <Image
                                                src="/static/e-filing/noticeicons.svg"
                                                width={22}
                                                height={22}
                                            />
                                            <p className="mx-3 mt-2" style={{ color: "#3d4d5c", fontSize: "19px" }}>Identify search field criterias</p>
                                        </div>
                                        <div className="d-flex flex-row">
                                            <Image
                                                src="/static/e-filing/noticeicons.svg"
                                                width={22}
                                                height={22}
                                            />
                                            <p className="mx-3 mt-2" style={{ color: "#3d4d5c", fontSize: "19px" }}>Fill  the following forms</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-0">
                                <p style={{ color: "#3d4d5c", fontSize: "16px", marginLeft: "150px" }}>* Please be careful as performance will be evaluated</p>
                            </div>
                            <div className="row mt-0">
                                <hr style={{ borderTop: '2.5px solid #eaeaea', width: '100%' }} className="mx-5 mt-0" />
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <button className="btn btn-primary mx-5" style={{ backgroundColor: "#fcffff", borderColor: "#248cda", }}><span style={{ fontWeight: "bold", color: "#3c5d87" }}>CANCEL</span></button>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex justify-content-end mx-5">
                                    <button className="btn btn-dark" style={{ backgroundColor: "#3f628e", borderColor: "#3f628e" }}><span style={{ fontWeight: "bold" }}>START SCANNING</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default InitiateScan;