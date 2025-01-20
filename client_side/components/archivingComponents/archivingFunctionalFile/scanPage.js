import Image from "next/image";


const ScanPage = () => {
    return (
        <>
            <div className="row" style={{ fontFamily: "monospace" }}>
                <div className="col-8 d-flex justify-content-center" >
                    <div className="d-flex flex-column justify-content-end" >
                        <p className="mt-4" style={{ fontSize: "30px", color: "#083156", fontWeight: "bolder" }}>Your performance</p>
                        <p className="mt-4" style={{ fontSize: "17px", color: "#3d4d5c", fontWeight: "bold" }}>You have scanned <span style={{ fontSize: "20px", color: "black" }}>0</span> documents</p>
                        <p className="mt-4" style={{ fontSize: "17px", color: "#3d4d5c", fontWeight: "bold" }}>You have an average of <span style={{ fontSize: "20px", color: "black" }}>0</span> document perday</p>
                        <div className="mt-5">
                            <button className="btn btn-dark" style={{ backgroundColor: "#3f628e", borderColor: "#3f628e" }}><span style={{ fontWeight: "bold" }}>SCAN DOCUMENT</span></button>
                        </div>
                    </div>
                </div>
                <div className="col-4">
                    <div className="mt-2">
                        <Image
                            src="/static/e-filing/scanpage.svg"
                            width={300}
                            height={300}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}


export default ScanPage;