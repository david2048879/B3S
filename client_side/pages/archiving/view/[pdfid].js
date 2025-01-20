import { useState, useEffect } from "react";
import { withRouter } from "next/router";
import axios from "axios";
import { API } from "../../../config";
import withArchive from "../withArchive";


const ViewPDF = ({ router, token }) => {
    const [fileData, setFileData] = useState(null)
    useEffect(async () => {
        const id = router.query.pdfid;
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
        }
        try {
            const response = await axios.get(`${API}/archive/scanned/file/get/${id}`, config);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(blob);
            setFileData(fileURL);
        } catch (error) {
            // console.log(error);
        }
    }, [router]);
    
    return (
        <>
            <div>
                {fileData ? (
                    <iframe title="File Viewer" src={fileData} width="100%" height="600"></iframe>
                ) : (
                    <p>Loading file...</p>
                )}
            </div>

        </>
    )
}

export default withArchive(withRouter(ViewPDF));