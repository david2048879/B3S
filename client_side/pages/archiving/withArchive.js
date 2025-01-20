import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/authToken";

const withArchive = (Page) => {
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
				const response = await axios.get(`${API}/staff`, config);
				user = response.data;
				const responseDetails = await axios.get(`${API}/staff_email/${user.email}`, config);
				const responseRole = await axios.post(`${API}/archive/admin/getuserroledetails`, { "staff": responseDetails.data.staffProfile.empCode }, config);
				let role;
				if (responseRole.data.dataPresent === true) {
					if (responseRole.data.userRole.state === "ACTIVE") {
						role = responseRole.data.userRole.role
					}
					else {
						role = "STAFF";
					}
				}
				else {
					role = "STAFF";
				}
				userDetails = {
					empRole: role,
					department: responseDetails.data.staffProfile.currentAppointment.department,
					empCode:responseDetails.data.staffProfile.empCode,
					jobTitle: responseDetails.data.staffProfile.currentAppointment.jobTitle
				}
			} catch (error) {
				user = null;
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

export default withArchive;
