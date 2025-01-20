import React from "react";
import Link from "next/link";
import Router from "next/router";
import { isAuth, logout } from "../helpers/authToken";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
	// npm install –save react@17.0.2 react-dom@17.0.2
	// downgrade React to the above version (17) from (18) to avoid hydrate error:
	//Hydration failed because the initial UI does not match what was rendered on the server

	// const head = () => (
	//     <React.Fragment>
	//         <link
	//             rel="stylesheet"
	//             href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
	//             integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
	//             crossOrigin="anonymous"
	//         />
	//         <link rel="stylesheet" href="/static/css/styles.css" />
	//     </React.Fragment>
	// ); bg-warning

	const nav = () => (
		<ul
			className="nav nav-tabs fixed-top"
			style={{ background: "darkblue" }}
		>
			<li className="nav-item">
				<Link href="/">
					<a
						className="nav-link font-weight-bold mr-auto"
						title="Bank Support Services System"
						style={{ color: "white" }}
					>
						B3S - Bank Support Services System
					</a>
				</Link>
			</li>

			{!isAuth() && (
				<React.Fragment>
					<li className="nav-item ml-auto">
						<Link href="/login">
							<a className="nav-link" style={{ color: "white" }}>
								Login
							</a>
						</Link>
					</li>
					<li className="nav-item">
						<Link href="/register">
							<a
								className="nav-link"
								title="Activate my user account"
								style={{ color: "white" }}
							>
								Activate
							</a>
						</Link>
					</li>
				</React.Fragment>
			)}

			{isAuth() && isAuth().fullName !== "" && isAuth().fullName && (
				<React.Fragment>
					<li className="nav-item ml-auto">
						<Link href="/dashboard">
							<a className="nav-link" style={{ color: "white" }}>
								{isAuth().fullName.split(" ")[0]}
							</a>
						</Link>
					</li>
					<li className="nav-item">
						<a
							onClick={logout}
							className="nav-link"
							style={{ cursor: "pointer", color: "white" }}
						>
							Logout
						</a>
					</li>
				</React.Fragment>
			)}
			{/* 
            {isAuth() && isAuth().role === 'System Administrator' && (
                <li className="nav-item ml-auto">
                    <Link href="/admin">
                        <a className="nav-link text-success font-weight-bold" >{isAuth().fullName.split(' ')[0]}</a>
                    </Link>
                </li>
            )}

            {isAuth() && isAuth().role === 'Staff' && (
                <li className="nav-item ml-auto">
                    <Link href="/staff">
                        <a className="nav-link text-success font-weight-bold" >{isAuth().fullName.split(' ')[0]}</a>
                    </Link>
                </li>
            )} */}

			{/* {isAuth() && (
				<li className="nav-item">
					<a
						onClick={logout}
						className="nav-link text-dark"
						style={{ cursor: "pointer" }}
					>
						Logout
					</a>
				</li>
			)} */}
		</ul>
	);
	// {head()}
	return (
		<React.Fragment>
			{nav()} <div className="container-fluid pt-3 pb-3">{children}</div>
		</React.Fragment>
	);
};

export default Layout;
