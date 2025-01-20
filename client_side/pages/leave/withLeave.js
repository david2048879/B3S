import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/authToken";

const withLeave = (Page) => {
	const WithAuthStaff = (props) => <Page {...props} />;
	WithAuthStaff.getInitialProps = async (context) => {
		const token = getCookie("token", context.req);
		let user = null;
		let userDetails = null
		if (token) {
			try {
				const config = {
					headers: {
						'Content-Type': "application/json",
						'Authorization': `Bearer ${token}`
					}
				}
				const response = await axios.get(`${API}/staff`, config)
				user = response.data;
				let responseDetails;
				responseDetails = await axios.get(`${API}/staff_email/${user.email}`, config);
				if (responseDetails.status === 200 && responseDetails.data.message === 'Employee not found!') {
					const responseCEODetails = await axios.post(`${API}/leave/CEO/getdetails`, { "role": user.role, "email": user.email }, config);
					if (responseCEODetails.status === 200) {
						responseDetails = responseCEODetails
					}
					else {
						if (responseCEODetails.status === 304) {
							throw error;
						}
					}
				}
				const responseRole = await axios.post(`${API}/leave/admin/getsupervisordetails`, { "staff": responseDetails.data.staffProfile.empCode }, config);
				let role;
				let roleDetails;
				if (responseRole.data.dataPresent === true) {
					if (responseRole.data.supervisor.state === "ACTIVE") {
						role = responseRole.data.supervisor.role
					}
					else {
						role = "STAFF";
					}
				}
				else {
					role = "STAFF";
				}
				userDetails = {
					empCode: responseDetails.data.staffProfile.empCode,
					empRole: role,
					roleDetails,
					department: responseDetails.data.staffProfile.currentAppointment.department,
					jobTitle: responseDetails.data.staffProfile.currentAppointment.jobTitle
				}
			} catch (error) {
				const config = {
					headers: {
						'Content-Type': "application/json",
						'Authorization': `Bearer ${token}`
					}
				}
				const responseCEODetails = await axios.post(`${API}/leave/CEO/getdetails`, { "role": user.role, "email": user.email }, config);
				console.log(responseCEODetails.data);
				if (responseCEODetails.status === 200) {
					let role="CEO";
					let roleDetails;
					userDetails = {
						empCode: responseCEODetails.data.CEO.empCode,
						empRole: role,
						roleDetails,
						department: responseCEODetails.data.CEO.currentAppointment.department,
						jobTitle: responseCEODetails.data.CEO.currentAppointment.jobTitle
					}
				}
				else {
					if (responseCEODetails.status === 304) {
						user = null;
					}
				}
			}
		}
		if (user === null) {
			context.res &&
				context.res.writeHead(302, {
					Location: "/",
				});
			context.res.end();
		} else {
			return {
				...(Page.getInitialProps
					? await Page.getInitialProps(context)
					: {}),
				user,
				token,
				userDetails
			};
		}
	};
	return WithAuthStaff;
};

export default withLeave;
