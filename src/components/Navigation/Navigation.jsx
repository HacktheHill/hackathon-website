import { useState } from "react";
import Navbar from "./NavBar";
import "./Navigation.css";
import Sidebar from "./Sidebar";

const Navigation = ({ pageScroll }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="navigation">
			<Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} pageScroll={pageScroll} />
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
		</div>
	);
};

export default Navigation;
