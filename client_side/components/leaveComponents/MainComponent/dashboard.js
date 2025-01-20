import { useState, useEffect } from "react";
import DashboardCard from "../statisticsComponent/LeaveDashboardCard"
import axios from "axios";
import { ClockCircleFilled, BuildOutlined, CarryOutOutlined } from "@ant-design/icons";
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import DoughnutChart from "../statisticsComponent/dognut";
import AnnualLeaveDoughnutChart from "../statisticsComponent/annualLeaveDognut";


const Dashboard = ({ token }) => {
    const [data, setData] = useState({
        total: "",
        number_of_leaves: "",
        other_leaves: "",
        annual_leave_days_remaining:""
    })
    const [leaveStats, setLeaveStats] = useState({
        dataPresent: false,
        data: {}
    })
    const [annualLeaveStats, setAnnualLeaveStats] = useState({
        dataPresent: false,
        data: {}
    })
    useEffect(async () => {
        const config = {
            headers: {
                'Content-Type': "multipart/form-data",
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const staffInfo = await axios.get(`${API}/staff_email/${isAuth().email}`, config);
            const response = await axios.get(`${API}/leave/leavestats/${staffInfo.data.staffProfile._id}`, config);
            const responseLeavePerStat = await axios.get(`${API}/leave/statsperleave/${staffInfo.data.staffProfile._id}`, config);
            const responseAnnualLeaveStats = await axios.get(`${API}/leave/annualleavestats/${staffInfo.data.staffProfile._id}`, config);
            if (responseLeavePerStat.data.dataPresent === false) {
                setLeaveStats({ dataPresent: false })
            }
            else {
                if(responseLeavePerStat.data.annualLeave===0&&responseLeavePerStat.data.sickLeave===0&&responseLeavePerStat.data.circumstantialLeave===0){
                    setLeaveStats({ dataPresent: false })
                }
                else{
                setLeaveStats({ dataPresent: true, data: { "annualLeave": responseLeavePerStat.data.annualLeave, "sickLeave": responseLeavePerStat.data.sickLeave, "circumstantialLeave": responseLeavePerStat.data.circumstantialLeave } })
                }
            }
            if (responseAnnualLeaveStats.data.dataPresent === false) {
                setAnnualLeaveStats({ dataPresent: false })
            }
            else {
                setAnnualLeaveStats({ dataPresent: true ,percentage: responseAnnualLeaveStats.data.percentage })
            }
            setData({
                total: response.data.total_annual_leave,
                number_of_leaves: response.data.all_leave_taken,
                other_leaves: response.data.other_leaves,
                annual_leave_days_remaining:response.data.remaining_days
            })
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <>
            <div className="row mt-5 mx-2" >
                <DashboardCard color="bg-warning" message="Annual leave days" icon={<ClockCircleFilled />} number={data.total} />
                <DashboardCard color="bg-success" message="All leave(s) taken" icon={<BuildOutlined />} number={data.number_of_leaves} />
                <DashboardCard color="bg-primary" message="Other leave day(s)" icon={<CarryOutOutlined />} number={data.other_leaves} />
                <DashboardCard color="bg-secondary" message="Annual leave days remaining" icon={<CarryOutOutlined />} number={data.annual_leave_days_remaining} />
            </div>
            <div className="row mt-3 mx-3">
                <div className="col-6 mt-5 ">
                    <DoughnutChart statsdata={leaveStats} />
                </div>
                <div className="col-6 mt-5">
                    <div className="d-flex justify-content-end">
                    <AnnualLeaveDoughnutChart annualLeaveStats={annualLeaveStats} />
                    </div>
                </div>
            </div>
        </>
    )
}



export default Dashboard;