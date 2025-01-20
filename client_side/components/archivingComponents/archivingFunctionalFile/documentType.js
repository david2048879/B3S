import Image from "next/image";


const DocumentType = () => {
    return (
        <>
            <div className="row" style={{ fontFamily: "monospace" }}>
            <div className="mx-5">
                <p className="mx-5"><span style={{ fontSize: "24px", fontWeight: "bolder", color: "#083156" }}>Document operations</span></p>
            </div>
                <div className="col-12 d-flex justify-content-center" >
                    <div className="d-flex flex-column justify-content-end" >
                        <p className="mt-4" style={{ fontSize: "24px", color: "#083156", fontWeight: "bolder" }}>DOCUMENT TYPE</p>
                        <p className="mt-2" style={{ fontSize: "17px", color: "#3d4d5c", }}>
                            How we classify different files to be scanned, for retrieval the search criterias to base on<br /> searching a document.
                        </p>
                        <div className="row mt-2">
                            <div className="col-6">
                                <div style={{ border: "1px solid #ccc", borderRadius: '15px' }}>
                                    <div className="row">
                                        <div className="col-3">
                                            <Image
                                            className="mt-2"
                                                src="/static/e-filing/documenttype.svg"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <div className="col-9">
                                            <div className="d-flex justify-content-start">
                                                <div className="d-flex flex-column">
                                                    <p style={{ fontSize: "18px", color: "#083156", fontWeight: "bolder" }}>Add new document type</p>
                                                    <p style={{ fontSize: "15px", color: "#3d4d5c", fontWeight: "lighter" }}>Add new additional document to the collection</p>
                                                    <p style={{ fontSize: "14px", color: "#2285d0", fontWeight: "bolder", cursor: "pointer" }}>ADD NEW <i style={{ fontSize: "0.8em" }} className="fa-solid fa-greater-than"></i></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div style={{ border: "1px solid #ccc", borderRadius: '15px', }}>
                                    <div className="row" style={{paddinTop:"10px"}}>
                                        <div className="col-3">
                                            <Image
                                            className="mt-2"
                                                src="/static/e-filing/DOCTYPE.svg"
                                                width={100}
                                                height={100}
                                            />
                                        </div>
                                        <div className="col-9" style={{paddingTop:"5px"}}>
                                            <div className="d-flex justify-content-start">
                                                <div className="d-flex flex-column">
                                                    <p style={{ fontSize: "18px", color: "#083156", fontWeight: "bolder",paddingTop:"6px" }}>View document type</p>
                                                    <p style={{ fontSize: "15px", color: "#3d4d5c", fontWeight: "lighter",paddingBottom:"6px" }}>View document types and search criterias</p>
                                                    <p style={{ fontSize: "14px", color: "#2285d0", fontWeight: "bolder", cursor: "pointer",paddingTop:"6px" }}>VIEW <i style={{ fontSize: "0.8em" }} className="fa-solid fa-greater-than"></i></p>
                                                </div>
                                            </div>
                                        </div>
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


export default DocumentType;