const DashboardCard = ({ color, message, icon, number }) => {
    return (
        <>
            <div className="col-4">
                <div className="card shadow-sm" style={{ border: "1px solid #ccc", borderRadius: '10px' }}>
                    <div className="d-flex flex-row">
                        <div className={`card rounded-3 shadow ${color}`} style={{ height: "50px", marginRight: '20px',border: "1px solid #ccc", borderRadius: '10px', marginLeft: '5px', marginBottom: "40px" }}>
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
                                <div className="mx-4">
                                    {icon}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex flex-column mt-2">
                            <p className="font-monospace text-dark">{message}</p>
                            <p className="font-monospace d-flex justify-content-end mx-4"><strong>{number} document(s)</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardCard;
