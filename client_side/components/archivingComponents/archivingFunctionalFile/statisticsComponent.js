import { useState, useEffect } from "react";
import DashboardCard from "../statisticsComponents/dashboardCard";
import axios from "axios";
import { ClockCircleFilled, BuildOutlined, CarryOutOutlined } from "@ant-design/icons";
import { API } from "../../../config";
import PercentageDoghnutCompletion from "../statisticsComponents/contributionPercentageDoghnutChart";
import ScannedDocumentLineChart from "../statisticsComponents/scannedDocumentsLineChart";


const StatisticsDashboard = ({ token, empCode }) => {
    const [data, setData] = useState({
        totalScannedDocuments: "",
        average_daily_scanned_documents: "",
        myScannedDocuments: ""
    })
    const [completionPercentage, setCompletionPercentage] = useState({
        dataPresent: false,
        percentage: 0
    })
    const [countsPerMonth, setCountsPerMonth] = useState(Array(12).fill(0));
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const response = await axios.post(`${API}/archive/stats/mystats`, { "empCode": empCode }, config);
            const responseCountsPerMonth = await axios.post(`${API}/archive/stats/scanpermonth`, { "empCode": empCode }, config);
            setData({
                totalScannedDocuments: response.data.allScannedDocuments,
                average_daily_scanned_documents: response.data.averageDocumentsPerDay,
                myScannedDocuments: response.data.userScannedDocuments
            })
            if (response.data.allScannedDocuments && response.data.allScannedDocuments !== 0) {
                const percentage = (response.data.userScannedDocuments / response.data.allScannedDocuments) * 100;
                setCompletionPercentage({
                    dataPresent: true,
                    percentage: percentage.toFixed(0)
                })
            } else {
                setCompletionPercentage({
                    dataPresent: false,
                    percentage: 0
                })
            }
            setCountsPerMonth(responseCountsPerMonth.data.countsPerMonth.map(scanned => scanned.count));
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <>
            <div className="row mx-2" >
                <DashboardCard color="bg-warning" message="Scanned documents" icon={<ClockCircleFilled />} number={data.myScannedDocuments} />
                <DashboardCard color="bg-success" message="Average daily scan" icon={<BuildOutlined />} number={data.average_daily_scanned_documents} />
                <DashboardCard color="bg-primary" message="All scanned documents" icon={<CarryOutOutlined />} number={data.totalScannedDocuments} />
            </div>
            <div className="row mt-3 mx-3">
                <div className="col-6 mt-2">
                    <span className="text-xs">Scan contribution over total scanned documents</span>
                    <PercentageDoghnutCompletion percentage={completionPercentage} />
                </div>
                <div className="col-6 mt-5">
                    <div className="d-flex justify-content-end">
                        <ScannedDocumentLineChart statspermonth={countsPerMonth} />
                    </div>
                </div>
            </div>
        </>
    )
}



export default StatisticsDashboard;