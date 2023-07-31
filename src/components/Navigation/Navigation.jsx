import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import "./Navigation.css";
import Sidebar from "./Sidebar";

const Navigation = ({ pageScroll }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		if (sidebarOpen) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [sidebarOpen]);

	return (
		<div className="navigation">
			<Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} pageScroll={pageScroll} />
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
		</div>
	);
};

export default Navigation;
