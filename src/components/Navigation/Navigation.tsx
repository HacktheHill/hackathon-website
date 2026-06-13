import { useEffect, useState } from "react";
import Navbar from "./NavBar";
import Sidebar from "./Sidebar";
import style from "./Navigation.module.css";

const Navigation = () => {
	const [pageScroll, setPageScroll] = useState(0);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setPageScroll(window.scrollY);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<div className={style["navigation"]}>
			<Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} pageScroll={pageScroll} />
			<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
		</div>
	);
};

export default Navigation;
