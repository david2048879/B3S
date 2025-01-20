import { useState, useEffect } from "react";
import DashboardCard from "../statisticsComponent/LeaveDashboardCard"
import axios from "axios";
import { ClockCircleFilled, BuildOutlined, CarryOutOutlined } from "@ant-design/icons";
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import AnnualLeaveDoughnutChart from "../statisticsComponent/annualLeaveDognut";
import BarchartAnalytics from "../statisticsComponent/supervisorBarchart";


const StatisticsDashboard = ({ token }) => {
    const [data, setData] = useState({
        total: "",
        number_of_leaves: "",
        number_of_staff: ""
    })
    const [changeStatistics, setChangeStatistics] = useState("supervision")
    const [leaveStats, setLeaveStats] = useState({
        dataPresent: false,
        data: {}
    })
    const [annualLeaveStats, setAnnualLeaveStats] = useState({
        dataPresent: false,
        data: {}
    })
    const [monthPerformance, setMonthPerformance] = useState([])
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const staffInfo = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
            const response = await axios.get(`${API}/leave/supervisorstatistics/${staffInfo.data.staffProfile.empCode}`, config);
            const responseAnnualLeaveReport = await axios.get(`${API}/leave/supervisormonthlyreport/${staffInfo.data.staffProfile.empCode}`, config);
            const responseAnnualLeaveStats = await axios.get(`${API}/leave/supervisorstats/${staffInfo.data.staffProfile.empCode}`, config);
            setMonthPerformance(responseAnnualLeaveReport.data.countsPerMonth)
            if (responseAnnualLeaveStats.data.dataPresent === false) {
                setAnnualLeaveStats({ dataPresent: false })
            }
            else {
                setAnnualLeaveStats({ dataPresent: true, percentage: responseAnnualLeaveStats.data.percentage })
            }
            setData({
                total: response.data.total_annual_leave,
                number_of_leaves: response.data.all_leave_taken,
                number_of_staff: response.data.number_of_staff
            })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <div className="row mt-5 mx-2" >
                <DashboardCard color="bg-warning" message="Total planned annual leave days" icon={<ClockCircleFilled />} number={data.total} />
                <DashboardCard color="bg-success" message="Total annual leave taken" icon={<BuildOutlined />} number={data.number_of_leaves} />
                <DashboardCard color="bg-primary" message="Number of staff " icon={<CarryOutOutlined />} number={data.number_of_staff} />
            </div>
            <div className="row mt-3 mx-3">
                <div className="col-4 mt-5">
                    <div className="d-flex flex-column">
                        <div className="">
                            {/* <div className="form-group">
                                <select className="form-select" onChange={(e) => setChangeStatistics(e.target.value)}>
                                    <option value="supervision">Supervision</option>
                                    <option value="department">Department</option>
                                </select>
                            </div> */}
                        </div>
                        <div className="mt-2">
                            <div className="d-flex justify-content-start">
                                <AnnualLeaveDoughnutChart annualLeaveStats={annualLeaveStats} />
                            </div>
                            <div className="mt-2 d-flex justify-content-center">
                                <p>staff under supervision</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-8 mt-5">
                    <div className="">
                        <BarchartAnalytics data={monthPerformance} />
                    </div>
                </div>
            </div>
        </>
    )
}



export default StatisticsDashboard;