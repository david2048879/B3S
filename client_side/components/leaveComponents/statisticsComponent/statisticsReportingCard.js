const ReportingCard = ({ color, message, icon, number, providedMargin, colNum, display,caption }) => {
    return (
        <>
            <div className={`col-${colNum}`}>
                <div className="card rounded-3">
                    <div className="d-flex flex-row">
                        <div className={`card rounded-3 shadow ${color}`} style={{ height: "50px", marginRight: '5px', marginLeft: '5px', marginBottom: providedMargin }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                <div className={display === "supervision" ? "mx-3" : "mx-5"}>
                                    {icon}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-row mt-2">
                            <p className="font-monospace text-dark"><span style={{ fontSize: "1em" }}>{message}</span></p>
                            <p className="font-monospace d-flex justify-content-end mx-4"><strong><em>
                                <div className="d-flex flex-column">
                                    <span>{number} </span>
                                    <span style={{fontSize:"0.5em"}}>{caption}</span>
                                </div>
                            </em></strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportingCard;
