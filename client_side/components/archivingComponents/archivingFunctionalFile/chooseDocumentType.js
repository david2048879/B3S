import Image from "next/image";
import QuitChooseDocumentTypeModal from "../modal/quitChooseDocument";
import { useState } from "react";


const ChooseDocumentType = () => {
    const [quitModal,setQuitModal]=useState(false)
    const toggleQuitModal=()=>{
        setQuitModal(!quitModal)
    }
    return (
        <>
            <div style={{ width: "100vw",backgroundColor:"#f1f4f6",height:"100vh", fontFamily: "monospace" }}>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card mt-4 shadow" style={{ height: "80vh", borderRadius: "8px" }}>
                            <div className="row mt-3">
                                <div className="col-6">
                                    <p style={{ color: "#083156", fontSize: "25px", fontWeight: "bold" }} className="mx-4">Choose document type</p>
                                </div>
                                <div className="col-6">
                                    <div className="d-flex justify-content-end mx-5">
                                        <button className="btn btn-dark" style={{ backgroundColor: "#FFFFFF", borderColor: "#cacfd3" }}><span style={{ fontWeight: "bold", color: "#67737e" }} onClick={toggleQuitModal}>QUIT</span></button>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-0">
                                <hr style={{ borderTop: '2px solid #eaeaea', width: '100%' }} className="mx-5 mt-0" />
                            </div>
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
                                        <div className="d-flex flex-column">
                                            <div class="form-group mx-3 mt-2">
                                                <label for="department" style={{ color: "#3d4d5c", fontSize: "19px" }}>* Choose department</label>
                                                <select className="form-control" id="department">
                                                    <option>Choose</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <div class="form-group mx-3 mt-2">
                                                <label for="doctype" style={{ color: "#3d4d5c", fontSize: "19px" }}>* Choose document type</label>
                                                <select className="form-control" id="doctype">
                                                    <option>Choose document type</option>
                                                </select>
                                            </div>
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
                                <div className="col-12">
                                    <div className="d-flex justify-content-end mx-5">
                                        <button className="btn btn-dark" style={{ backgroundColor: "#3f628e", borderColor: "#3f628e" }}><span style={{ fontWeight: "bold" }}>START SCANNING</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <QuitChooseDocumentTypeModal modalIsOpen={quitModal} toggleModal={toggleQuitModal}/>
                </div>
            </div>
        </>
    )
}


export default ChooseDocumentType;