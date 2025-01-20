import { useState, useEffect } from "react";
import DashboardCard from "../statisticsComponent/statisticsReportingCard"
import axios from "axios";
import { ClockCircleFilled, BuildOutlined, CarryOutOutlined, CopyOutlined } from "@ant-design/icons";
import { API } from "../../../config";
import { isAuth } from "../../../helpers/authToken";
import AnnualLeaveDoughnutChart from "../statisticsComponent/annualLeaveDognut";
import DepartmentLeaveTakingPercentage from "../statisticsComponent/departmentLeaveDognut";
import BarchartAnalytics from "../statisticsComponent/supervisorBarchart";


const EXecStatisticsDashboard = ({ token, userDetails }) => {
    const [changeStatistics, setChangeStatistics] = useState("supervision");
    const [category, setCategory] = useState("")
    const [showPercentage, setShowPercentage] = useState(false)
    const [data, setData] = useState({
        total: "",
        number_of_leaves: "",
        number_of_staff: "",
        number_of_employees: ""
    })
    const departmentData = [
        { value: "Finance", label: "Finance" },
        { value: "Executive", label: "Executive" },
        { value: "Retail banking", label: "Retail Banking" },
        { value: "Operations", label: "Operations" },
        { value: "Sales team", label: "Sales Team" },
        { value: "Branch leadership", label: "Branch Leadership" },
        { value: "Credit", label: "Credit" },
        { value: "Business", label: "Business" },
        { value: "Recovery", label: "Recovery" },
        { value: "Marketing", label: "Marketing" },
        { value: "Digital channel", label: "Digital Channel" },
        { value: "Compliance", label: "Compliance" },
        { value: "Internal audit", label: "Internal Audit" },
        { value: "Legal", label: "Legal" },
        { value: "Human Resources", label: "Human Resources" },
        { value: "IT", label: "IT" },
        { value: "Security", label: "Security" },
        { value: "Risk management", label: "Risk Management" },
    ];
    const division = [
        { value: "Audit", label: "Audit" },
        { value: "Business", label: "Business" },
        { value: "Executive", label: "Executive" },
        { value: "Finance", label: "Finance" },
        { value: "Operations", label: "Operations" },
        { value: "People", label: "People" },
    ]
    const messages = {
        supervision: {
            total: "Total planned annual leave days",
            number_of_leaves: "Total annual leave taken",
            number_of_staff: "Number of staff"
        },
        department: {
            total: "Department planned annual leave days",
            number_of_leaves: "Department annual leave days taken",
            number_of_staff: "Department staff who took their leave",
            number_of_employees: "Department total number of staff"
        },
        division: {
            total: "Division planned annual leave days",
            number_of_leaves: "Division annual leave days taken",
            number_of_staff: "Division staff who took their leave",
            number_of_employees: "Division total number of staff"
        }
    };
    const [peopleStats, setPeopleStats] = useState({
        dataPresent: false,
        data: {}
    })
    const [annualLeaveStats, setAnnualLeaveStats] = useState({
        dataPresent: false,
        data: {}
    })
    const [monthPerformance, setMonthPerformance] = useState([])
    const fetchData = async () => {
        console.log(userDetails);
        const config = {
            headers: {
                'Content-Type': "application/json",
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            if (changeStatistics === "supervision") {
                const response = await axios.get(`${API}/leave/supervisorstatistics/${userDetails.empCode}`, config);
                const responseAnnualLeaveReport = await axios.get(`${API}/leave/supervisormonthlyreport/${userDetails.empCode}`, config);
                const responseAnnualLeaveStats = await axios.get(`${API}/leave/supervisorstats/${userDetails.empCode}`, config);
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
            }
            else {
                if (changeStatistics === "department" || changeStatistics === "division") {
                    const response = await axios.post(`${API}/leave/department/leaveperformance`, { "role": changeStatistics, "category": category }, config);
                    const responseAnnualLeaveReport = await axios.post(`${API}/leave/department/monthlystatistics`, { "category": category, "role": changeStatistics }, config);
                    setMonthPerformance(responseAnnualLeaveReport.data.countsPerMonth)
                    if (response.data.dataPresent === false) {
                        setAnnualLeaveStats({ dataPresent: false })
                    }
                    else {
                        setAnnualLeaveStats({ dataPresent: true, percentage: response.data.percentage })
                    }

                    if (response.data.departmentDataPresent === false) {
                        setPeopleStats({ dataPresent: false })
                    }
                    else {
                        setPeopleStats({ dataPresent: true, percentage: response.data.percentagePeoplePlan })
                    }
                    setData({
                        total: response.data.totalPlannedDays,
                        number_of_leaves: response.data.totalDaysTaken,
                        number_of_staff: response.data.numberOfWhoTookLeave,
                        number_of_employees: response.data.numberOfEmployees
                    })
                }
            }
        } catch (error) {
            console.log(error)
        }
    }
    const changeStatisticsHandler = (e) => {
        if (e.target.value === "division") {
            setCategory("Operations")
        }
        else {
            if (e.target.value === "department") {
                setCategory("IT")
            }
        }
        setChangeStatistics(e.target.value)
        setShowPercentage(false)
    }
    useEffect(() => {
        fetchData()
    }, [changeStatistics, category])
    return (
        <>
            <div className="row mt-5" style={{ marginLeft: "20px" }}>
                <DashboardCard color="bg-warning" message={messages[changeStatistics].total} icon={<ClockCircleFilled />} number={data.total} colNum={changeStatistics === `supervision` ? '4' : '3'} display={changeStatistics} caption="days" />
                <DashboardCard color="bg-success" message={messages[changeStatistics].number_of_leaves} icon={<BuildOutlined />} number={data.number_of_leaves} colNum={changeStatistics === `supervision` ? '4' : '3'} display={changeStatistics} caption="days" />
                <DashboardCard color="bg-primary" message={messages[changeStatistics].number_of_staff} icon={<CarryOutOutlined />} number={data.number_of_staff} colNum={changeStatistics === `supervision` ? '4' : '3'} providedMargin={changeStatistics === `supervision` ? '23px' : ''} display={changeStatistics} caption="staff" />
                {(changeStatistics === "department" || changeStatistics === "division") && <DashboardCard color="bg-info" message={messages[changeStatistics].number_of_employees} icon={<CopyOutlined />} number={data.number_of_employees} colNum={changeStatistics === `supervision` ? '4' : '3'} display={changeStatistics} caption="staff" />}
            </div>
            <div className="row mt-1 mx-3 font-monospace" >
                <div className="col-6 mt-4">
                    <div className="d-flex flex-column">
                        <div>
                            <div className="form-group">
                                <select className="form-select" onChange={changeStatisticsHandler}>
                                    <option value="supervision">Supervision</option>
                                    <option value="department">Department</option>
                                    <option value="division">division</option>
                                </select>
                            </div>
                        </div>
                        {changeStatistics === "department" && <div className="form-group">
                            <label htmlFor="departments">Departments:</label>
                            <select
                                className="form-select"
                                id="departments"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select department</option>
                                {departmentData.map((dept) => (
                                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                                ))}
                            </select>
                        </div>}
                        {changeStatistics === "division" && <div className="form-group">
                            <label htmlFor="division">Division:</label>
                            <select
                                className="form-select"
                                id="division"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select department</option>
                                {division.map((div) => (
                                    <option key={div.value} value={div.value}>{div.label}</option>
                                ))}
                            </select>
                        </div>}
                        <div className="mt-2">
                            <div className="d-flex justify-content-start">
                                <AnnualLeaveDoughnutChart annualLeaveStats={annualLeaveStats} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 mt-4 font-monospace">
                    <div>
                        {(changeStatistics === "department" || changeStatistics === "division") && <div className="form-group">
                            <select className="form-select" onChange={(e) => setShowPercentage(!showPercentage)}>
                                <option value="supervision">Department performance</option>
                                <option value="department">People in the department/how they are taking leave</option>
                            </select>
                        </div>}
                    </div>
                    <div className="">
                        {showPercentage === false ? <BarchartAnalytics data={monthPerformance} />
                            :
                            <>
                                <div className="card">
                                    <div className="row">
                                        <div className="col-6" style={{ borderRight: "1px solid yellow" }}>
                                            <p className="mx-2">Total staff the department: <span className="badge rounded-pill bg-primary" style={{ fontSize: "1.2em" }}>{data.number_of_employees}</span></p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mx-2">Staff took annual leave: <span className="badge rounded-pill bg-danger" style={{ fontSize: "1.2em" }}>{data.number_of_staff}</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center">
                                    <DepartmentLeaveTakingPercentage annualLeaveStats={peopleStats} />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}



export default EXecStatisticsDashboard;