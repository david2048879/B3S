import axios from "axios";
import { API } from "../../config";
import { getCookie } from "../../helpers/authToken";

const withAccountant = (Page) => {
	const WithAuthAccountant = (props) => <Page {...props} />;
	WithAuthAccountant.getInitialProps = async (context) => {
		const token = getCookie("token", context.req);
		let user = null;

		if (token) {
			try {
				const response = await axios.get(`${API}/accountant`, {
					headers: {
						authorization: `Bearer ${token}`,
						contentType: "application/json",
					},
				});
				user = response.data;
                // console.log("User: ", user)
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
			};
		}
	};
	return WithAuthAccountant;
};

export default withAccountant;
