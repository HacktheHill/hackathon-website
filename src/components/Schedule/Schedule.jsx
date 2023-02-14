import { Box, Button, Card, Stack, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import "./Schedule.css";

function Schedule() {
	const theme = useTheme();
	const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
	const matchesMD = useMediaQuery(theme.breakpoints.down("md"));
	const matchesLG = useMediaQuery(theme.breakpoints.down("lg"));

	const styles = {
		card: {
			minWidth: "150px",
			maxWidth: "150px",
			backgroundColor: "#3b477a",
			border: "3px solid white",
			borderRadius: "10px",
			maxHeight: "140px",
			mt: matchesMD ? "10px" : "0px",
			boxShadow: "rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
			transition: "transform 330ms ease-in-out",
			"&:hover": {
				transform: "scale(1.05)",
				transition: "transform 330ms ease-in-out",
			},
		},
	};

	return (
		<div id="schedule" className="schedule">
			<h1 className="schedule-title">The Hacker Series</h1>
			<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
			<Box
				sx={{
					width: matchesMD ? "75%" : "70%",
					margin: "auto",
					mt: matchesSM ? "15%" : "auto",
				}}
			>
				<Stack spacing={10} id="eventStack" className="event-stack">
					<Stack direction={{ xs: "column", md: "row" }} spacing={matchesMD ? 5 : 10} sx={{ width: "100%" }}>
						<div className="center">
							<Card
								variant="outlined"
								style={styles.card}
								sx={{
									"&:hover": {
										transform: "scale(1.05)",
										transition: "transform 330ms ease-in-out",
									},
								}}
							>
								<Stack direction={"column"}>
									<div className="event-month">November</div>
									<div className="event-day">16</div>
								</Stack>
							</Card>
						</div>
						<Stack sx={{ width: "100%" }}>
							<div className="event-title">
								Resume Roast
								<Button
									target="_blank"
									href="https://youtu.be/zpixm4xz_K4"
									sx={{
										background: "var(--button-gradient)",
										borderRadius: "100px",
										color: "var(--medium-primary-color)",
										mt: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										mb: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: matchesSM ? "50%" : matchesLG ? "25%" : undefined,
										transition: "1s",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="button-text">View Video</p>
								</Button>
							</div>
							<div className="sub-title">7 p.m. - 9 p.m. @ STM 117</div>
							<p className="event-desc" align="left">
								Need resume advice on the spot? Hang out with some developers from Ciena and Microsoft
								as they review and evaluate resumes submitted by students, all while filling yourself up
								with some fresh pizza.
							</p>
						</Stack>
					</Stack>

					<Stack direction={{ xs: "column", md: "row" }} spacing={matchesMD ? 5 : 10} sx={{ width: "100%" }}>
						<div className="center">
							<Card
								variant="outlined"
								style={styles.card}
								sx={{
									"&:hover": {
										transform: "scale(1.05)",
										transition: "transform 330ms ease-in-out",
									},
								}}
							>
								<Stack direction={"column"}>
									<div className="event-month">November</div>
									<div className="event-day">30</div>
								</Stack>
							</Card>
						</div>
						<Stack sx={{ width: "100%" }}>
							<div className="event-title">
								Coffee, Code, and Cram
								<Button
									disabled
									target="_blank"
									href="https://forms.gle/WUgn5g8XTjNf9Eq39"
									sx={{
										background: "var(--button-gradient)",
										borderRadius: "100px",
										color: "var(--medium-primary-color)",
										mt: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										mb: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: matchesSM ? "50%" : matchesLG ? "25%" : undefined,
										transition: "1s",
										boxShadow:
											"rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="button-text">Completed</p>
								</Button>
							</div>
							<div className="sub-title">7 p.m. - 9 p.m. @ STM 117</div>
							<p className="event-desc" align="left">
								Unwind and take a break from school. Join us alongside the uOttawa Computer Science Club
								for an evening of socializing and coding with coffee, tea, and snacks.
							</p>
						</Stack>
					</Stack>

					<Stack direction={{ xs: "column", md: "row" }} spacing={matchesMD ? 5 : 10} sx={{ width: "100%" }}>
						<div className="center">
							<Card
								variant="outlined"
								style={styles.card}
								sx={{
									"&:hover": {
										transform: "scale(1.05)",
										transition: "transform 330ms ease-in-out",
									},
								}}
							>
								<Stack direction={"column"}>
									<div className="event-month">January</div>
									<div className="event-day">11</div>
								</Stack>
							</Card>
						</div>
						<Stack sx={{ width: "100%" }}>
							<div className="event-title">
								Wicked Web Work
								<Button
									disabled
									sx={{
										background: "var(--button-gradient)",
										borderRadius: "100px",
										color: "var(--medium-primary-color)",
										mt: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										mb: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: matchesSM ? "50%" : matchesLG ? "25%" : undefined,
										transition: "1s",
										boxShadow:
											"rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="button-text">Completed</p>
								</Button>
							</div>
							<div className="sub-title">6 p.m. - 10 p.m. @ STM 117</div>
							<p className="event-desc" align="left">
								Explore the wonders of front-end development! Learn the basics through workshops and
								participate in a one-hour challenge to build a website according to provided guidelines.
							</p>
						</Stack>
					</Stack>

					<Stack direction={{ xs: "column", md: "row" }} spacing={matchesMD ? 5 : 10} sx={{ width: "100%" }}>
						<div className="center">
							<Card
								variant="outlined"
								style={styles.card}
								sx={{
									"&:hover": {
										transform: "scale(1.05)",
										transition: "transform 330ms ease-in-out",
									},
								}}
							>
								<Stack direction={"column"}>
									<div className="event-month">January</div>
									<div className="event-day">25</div>
								</Stack>
							</Card>
						</div>
						<Stack sx={{ width: "100%" }}>
							<div className="event-title">
								Got Games?
								<Button
									href="https://youtu.be/mbr4ZmXtx0k"
									target={"_blank"}
									sx={{
										background: "var(--button-gradient)",
										borderRadius: "100px",
										color: "var(--medium-primary-color)",
										mt: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										mb: matchesSM ? "7vw" : matchesMD ? "3vw" : "0vw",
										p: "7px",
										textTransform: "none",
										minWidth: "16%",
										width: matchesSM ? "50%" : matchesLG ? "25%" : undefined,
										transition: "1s",
										"&:hover": {
											backgroundColor: "#f094bc",
										},
									}}
								>
									<p className="button-text">View Video</p>
								</Button>
							</div>
							<div className="sub-title">7 p.m. - 9 p.m. @ STM 117</div>
							<p className="event-desc" align="left">
								Discover the best that game development has to offer! Join us along side the uOttawa
								Game Development Club for an introduction to Unity workshop.
							</p>
						</Stack>
					</Stack>
				</Stack>
			</Box>
		</div>
	);
}

export default Schedule;
