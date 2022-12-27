import React from "react";
import "./Schedule.css";

function Schedule() {
	const styles = {
		card: {
			minWidth: "150px",
			maxWidth: "150px",
			backgroundColor: "#3b477a",
			border: "3px solid white",
			borderRadius: "10px",
			maxHeight: "140px",
			marginTop: /* innerWidth > 800 ? */ "10px" /* : "0px" */,
			boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
			transition: "transform 330ms ease-in-out",
			"&:hover": {
				transform: "scale(1.05)",
				transition: "transform 330ms ease-in-out",
			},
		},
	};

	return (
		<div id="Schedule" className="Schedule">
			<h1 className="scheduleTitle">The Hacker Series</h1>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
			<div
				style={{
					width: /* innerWidth > 800 ? */ "75%" /* : "70%" */,
					margin: "auto",
					marginTop: /* innerWidth < 800 ? */ "15%" /* : "auto" */,
				}}
			>
				<div
					style={{ display: "flex", flexDirection: "column", gap: 10 }}
					id="eventStack"
					className="eventStack"
				>
					<div
						style={{
							display: "flex",
							flexDirection: /* innerWidth < 800 ? */ "column" /*  : "row" */,
							width: "100%",
							gap: /* innerWidth > 800 ? */ 5 /* : 10 */,
						}}
					>
						<div className="Center">
							<div className="Card" style={styles.card}>
								<div style={{ display: "flex", flexDirection: "column" }} direction={"column"}>
									<div className="eventMonth">November</div>
									<div className="eventDay">16</div>
								</div>
							</div>
						</div>
						<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
							<div className="eventTitle">
								Resume Roast
								<button
									target="_blank"
									href="https://youtu.be/zpixm4xz_K4"
									style={{
										background: "linear-gradient(90deg, #ABEFFB, transparent) #E9D9F2",
										borderRadius: "100px",
										color: "#3B4779",
										marginTop:
											/* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										marginBottom:
											/* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										padding: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: /* innerWidth < 800 ? */ "50%" /* : innerWidth > 1024 ? "25%" : "0%" */,
										transition: "1s",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="ButtonText">View Video</p>
								</button>
							</div>
							<div className="subTitle">7 p.m. - 9 p.m. @ STM 117</div>
							<p className="eventDesc" align="left">
								Need resume advice on the spot? Hang out with some developers from Ciena and Microsoft
								as they review and evaluate resumes submitted by students, all while filling yourself up
								with some fresh pizza.
							</p>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: /* innerWidth < 800 ? */ "column" /* : "row" */,
							width: "100%",
							gap: /* innerWidth > 800 ? */ 5 /* : 10 */,
						}}
					>
						<div className="Center">
							<div className="Card" style={styles.card}>
								<div style={{ display: "flex", flexDirection: "column" }} direction={"column"}>
									<div className="eventMonth">November</div>
									<div className="eventDay">30</div>
								</div>
							</div>
						</div>
						<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
							<div className="eventTitle">
								Coffee, Code, and Cram
								<button
									disabled
									target="_blank"
									href="https://forms.gle/WUgn5g8XTjNf9Eq39"
									style={{
										background: "linear-gradient(90deg, #ABEFFB, transparent) #E9D9F2",
										borderRadius: "100px",
										color: "#3B4779",
										marginTop:
											/* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										mb: /* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: /* innerWidth < 800 ? */ "50%" /*  : innerWidth > 1024 ? "25%" : "0%" */,
										transition: "1s",
										boxShadow:
											"rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="ButtonText">Completed</p>
								</button>
							</div>
							<div className="subTitle">7 p.m. - 9 p.m. @ STM 117</div>
							<p className="eventDesc" align="left">
								Unwind and take a break from school. Join us alongside the uOttawa Computer Science Club
								for an evening of socializing and coding with coffee, tea, and snacks.
							</p>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: /* innerWidth < 800 ? */ "column" /* : "row" */,
							width: "100%",
							gap: /* innerWidth > 800 ? */ 5 /* : 10 */,
						}}
					>
						<div className="Center">
							<div className="Card" style={styles.card}>
								<div style={{ display: "flex", flexDirection: "column" }} direction={"column"}>
									<div className="eventMonth">January</div>
									<div className="eventDay">11</div>
								</div>
							</div>
						</div>
						<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
							<div className="eventTitle">
								Wicked Web Work
								<button
									disabled
									style={{
										background: "linear-gradient(90deg, #ABEFFB, transparent) #E9D9F2",
										borderRadius: "100px",
										color: "#3B4779",
										marginTop:
											/* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										mb: /* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: /* innerWidth < 800 ? */ "50%" /*  : innerWidth > 1024 ? "25%" : "0%" */,
										transition: "1s",
										boxShadow:
											"rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="ButtonText">
										Sign Up <b>→</b>
									</p>
								</button>
							</div>
							<div className="subTitle">6 p.m. - 10 p.m. @ STM 117</div>
							<p className="eventDesc" align="left">
								Explore the wonders of front-end development! Learn the basics through workshops and
								participate in a one-hour challenge to build a website according to provided guidelines.
							</p>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: /* innerWidth < 800 ? */ "column" /* : "row" */,
							width: "100%",
							gap: /* innerWidth > 800 ? */ 5 /* : 10 */,
						}}
					>
						<div className="Center">
							<div className="Card" style={styles.card}>
								<div style={{ display: "flex", flexDirection: "column" }} direction={"column"}>
									<div className="eventMonth">January</div>
									<div className="eventDay">25</div>
								</div>
							</div>
						</div>
						<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
							<div className="eventTitle">
								Got Games?
								<button
									disabled
									style={{
										background: "linear-gradient(90deg, #ABEFFB, transparent) #E9D9F2",
										borderRadius: "100px",
										color: "#3B4779",
										marginTop:
											/* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										mb: /* innerWidth < 800 ? */ "7vw" /* : innerWidth > 800 ? "3vw" : "0vw" */,
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: /* innerWidth < 800 ? */ "50%" /*  : innerWidth > 1024 ? "25%" : "0%" */,
										transition: "1s",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="ButtonText">
										Sign up <b>→</b>
									</p>
								</button>
							</div>
							<div className="subTitle">7 p.m. - 9 p.m. @ STM 117</div>
							<p className="eventDesc" align="left">
								Discover the best that game development has to offer! Join us along side the uOttawa
								Game Development Club for an introduction to Unity workshop, presented by Propel VR.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Schedule;
