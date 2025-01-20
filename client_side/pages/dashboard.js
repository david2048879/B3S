import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { API } from "../config";
import { isAuth } from "../helpers/authToken";

const userDashboard = () => {
	const [staffID, setStaffID] = useState("");
	const [roleMenu, setRoleMenu] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!isAuth()) {
			Router.push("/login");
		} else {
			getStaff();
			getRoleMenus();
		}
	}, [Router]);

	const getStaff = async () => {		
		setLoading(true);
		try {			
			const response = await axios.get(
				`${API}/findStaff/${isAuth().email}`);
			setStaffID(response.data.foundStaff.empCode);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setStaffID("");
		}
	};

	const getRoleMenus = async () => {
		setLoading(true);
		try {
			const response = await axios.get(
				`${API}/roleMenus/${isAuth() && isAuth().role}`
			);
			setRoleMenu(response.data.roleMenus);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setRoleMenu([]);
		}
	};

	const displayMenu = () =>
		roleMenu.length > 0 &&
		roleMenu.map((rm, i) => (
			<div key={i} className="row alert alert-secondary p-2">
				<div className="col-md-12">
					<Link
						href={
							rm.linkParameter !== "none"
								? rm.linkTo + staffID.toString()
								: rm.linkTo
						}
					>
						<a>
							<span className="text-primary font-weight-bold float-left">
								{rm.roleAction}:&emsp;
							</span>
							{rm.roleSummary}
						</a>
					</Link>
				</div>
			</div>
			
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1">
				<div className="row">
					<h4>
						{isAuth() && isAuth().role ? isAuth().role : "Unknown user's role"}
					</h4>
				</div>
				{loading && (
					<div class="text-center">
						<div
							class="spinner-border spinner-border-sm text-primary"
							role="status"
						>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				)}

				{displayMenu()}
			</div>
		</Layout>
	);
};

export default userDashboard;
