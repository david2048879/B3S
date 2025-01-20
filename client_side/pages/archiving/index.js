import { useState, useEffect } from "react";
import Navigation from "../../components/archivingComponents/Navigation/topNavigation";
import Layout from "../../components/Layout";
import ScanPage from "../../components/archivingComponents/archivingFunctionalFile/scanPage";
import DocumentType from "../../components/archivingComponents/archivingFunctionalFile/documentType";
import InitiateScan from "../../components/archivingComponents/archivingFunctionalFile/InitiateScan";
import ChooseDocumentType from "../../components/archivingComponents/archivingFunctionalFile/chooseDocumentType";
import LoanDocument from "../../components/archivingComponents/archivingFunctionalFile/loanDocument";
import AddNewDocumentType from "../../components/archivingComponents/archivingFunctionalFile/addNewDocumentType";
import ViewDocumentType from "../../components/archivingComponents/archivingFunctionalFile/viewDocumentType";
import withArchive from "./withArchive";
import ScanDocument from "../../components/archivingComponents/archivingFunctionalFile/scanDocument";
import ViewScannedDocument from "../../components/archivingComponents/archivingFunctionalFile/viewScannedDocuments";
import ViewDepartmentalScannedDocument from "../../components/archivingComponents/archivingFunctionalFile/viewDepartmentalScannedDocuments";
import ViewMyScannedDocument from "../../components/archivingComponents/archivingFunctionalFile/viewMyScannedDocuments";
import StatisticsDashboard from "../../components/archivingComponents/archivingFunctionalFile/statisticsComponent";
import ManageRoles from "../../components/archivingComponents/archivingFunctionalFile/manageSupervisor";
import ScannedDocuments from "../../components/archivingComponents/archivingFunctionalFile/scannedDocuments";
import ViewAllDocuments from "../../components/archivingComponents/archivingFunctionalFile/viewAllDocuments";


const Index = ({ token, userDetails }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [navigation, setNavigation] = useState("PERFORMANCE");
    useEffect(() => {
        if(userDetails.empRole==="STAFF"){
            setNavigation("ALL SCANNED COPIES")
        }
    }, [navigation]);
    return (
        <>
            <style>
                {`
                    body {
                        background-color: white;
                    }
                `}
            </style>
            <Layout />
            <div >
                <Navigation setNavigation={setNavigation} userDetails={userDetails} />
                {/* <DocumentType/> */}
                {/* <ScanPage/>  */}
                {/* <InitiateScan/> */}
                {/* <ChooseDocumentType/> */}
                {/* <LoanDocument/>  */}
                {navigation === "ADD NEW DOCUMENT TYPE" && <AddNewDocumentType token={token} setNavigation={setNavigation}/>}
                {navigation === "DOCUMENT TYPE" && <ViewDocumentType token={token} setNavigation={setNavigation}/>}
                {navigation === "SCAN" && <ScanDocument token={token} setNavigation={setNavigation}/>}
                {navigation === "ORGANIZATION SCANNED COPIES" && <ViewAllDocuments token={token} setNavigation={setNavigation}/>}
                {navigation === "ALL SCANNED COPIES" && <ViewDepartmentalScannedDocument token={token} department={userDetails.department} setNavigation={setNavigation}/>}
                {navigation === "SCANNED COPIES" && <ViewMyScannedDocument token={token} empCode={userDetails.empCode} setNavigation={setNavigation}/>}
                {navigation === "PERFORMANCE" && <StatisticsDashboard token={token} empCode={userDetails.empCode} />}
                {navigation === "USER MANAGEMENT"&&<ManageRoles token={token} />}
            </div>
        </>
    );
};

export default withArchive(Index);
