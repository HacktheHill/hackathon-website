import {
	add,
	eachDayOfInterval,
	endOfMonth,
	format,
	getDay,
	isEqual,
	isSameDay,
	isSameMonth,
	isToday,
	parse,
	parseISO,
	startOfToday,
} from "date-fns";
import React, { useState, useEffect } from "react";
import chevron from "/src/assets/icons/chevron_white.svg";
import { t, locale } from "../../i18n";
import calendar from "/src/assets/icons/calendar.svg";
import location from "/src/assets/icons/location.svg";
import Button from "../Button/Button";
import beaver3 from "/src/assets/beavar/Beaver3.svg";

const events = [
	{
		title: "Event1",
		description:
			"This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. ",
		startDatetime: "2024-05-11T13:00",
		endDatetime: "2024-05-11T14:30",
		location: "SITE4026, uOttawa",
		link: "https://www.google.com",
		status: "Register",
		disabled: true,
	},
	{
		title: "Event2",
		description:
			"This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. ",
		startDatetime: "2024-05-20T09:00",
		endDatetime: "2024-05-20T11:30",
		location: "SITE4026, uOttawa",
		link: "https://www.google.com",
		status: "Register",
		disabled: false,
	},
	{
		title: "Event3",
		description:
			"This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. ",
		startDatetime: "2024-05-20T17:00",
		endDatetime: "2024-05-20T18:30",
		location: "SITE4026, uOttawa",
		link: "https://www.google.com",
		status: "More info",
		disabled: false,
	},
	{
		title: "Event4",
		description:
			"This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. ",
		startDatetime: "2024-06-09T13:00",
		endDatetime: "2024-06-09T14:30",
		location: "SITE4026, uOttawa",
		link: "https://www.google.com",
		status: "More info",
		disabled: false,
	},
	{
		title: "Event5",
		description:
			"This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. It can be as long as you want. It can also include links. This is a description of the event. ",
		startDatetime: "2024-05-13T14:00",
		endDatetime: "2024-05-13T14:30",
		location: "SITE4026, uOttawa",
		link: "https://www.google.com",
		status: "More info",
		disabled: false,
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
	let today = startOfToday();
	let [selectedDay, setSelectedDay] = useState(today);
	let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
	let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
	let displayMonth = currentMonth.split("-")[0];
	let displayYear = currentMonth.split("-")[1];
	let displayDay = selectedDay.toString().slice(8, 10);
	const [showUpcomingEvents, setShowUpcomingEvents] = useState(1);
	let colStartClasses = [
		"",
		"col-start-2",
		"col-start-3",
		"col-start-4",
		"col-start-5",
		"col-start-6",
		"col-start-7",
	];

	let days = eachDayOfInterval({
		start: firstDayCurrentMonth,
		end: endOfMonth(firstDayCurrentMonth),
	});

	function previousMonth() {
		let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
		setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
	}

	function nextMonth() {
		let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
		setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
	}

	let selectedDayEvents = events.filter(event => isSameDay(parseISO(event.startDatetime), selectedDay));

	return (
		<div className="grid grid-cols-5 gap-8 lg:flex lg:flex-wrap">
			<div
				className="rounded-3xl p-8 bg-blur-svg aspect-square h-[28.5rem] w-full col-start-1 col-end-3"
				data-aos="fade-right"
			>
				<div className="flex items-center">
					<h2 className="flex-auto font-semibold">{`${
						t("events.months")[displayMonth] || displayMonth
					} ${displayYear}`}</h2>
					<button
						type="button"
						onClick={previousMonth}
						className="p-1.5 mr-4 transition-all duration-200 opacity-75 hover:opacity-100"
					>
						<img src={chevron.src} alt="Previous month" className="-scale-x-100" width="8px" />
					</button>
					<button
						onClick={nextMonth}
						type="button"
						className="p-1.5 transition-all duration-200 opacity-75 hover:opacity-100"
					>
						<img src={chevron.src} alt="Previous month" width="8px" />
					</button>
				</div>
				<div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center">
					{t("events.weekdayInitials").map((day, i) => (
						<div key={i}>{day}</div>
					))}
				</div>
				<div className="grid grid-cols-7 mt-2 text-sm">
					{days.map((day, dayIdx) => (
						<div
							key={day.toString()}
							className={classNames(dayIdx === 0 && colStartClasses[getDay(day)], "py-1.5")}
						>
							<button
								type="button"
								onClick={() => {
									setSelectedDay(day);
									setShowUpcomingEvents(0);
								}}
								className={classNames(
									"transition-all duration-200",
									isEqual(day, selectedDay) && "text-white",
									!isEqual(day, selectedDay) && isToday(day) && "text-white",
									!isEqual(day, selectedDay) &&
										!isToday(day) &&
										isSameMonth(day, firstDayCurrentMonth) &&
										"text-shade-5",
									!isEqual(day, selectedDay) &&
										!isToday(day) &&
										!isSameMonth(day, firstDayCurrentMonth) &&
										"text-white",
									isEqual(day, selectedDay) && isToday(day) && "bg-primary",
									isEqual(day, selectedDay) && !isToday(day) && "bg-shade-9",
									!isEqual(day, selectedDay) && " hover:text-white",
									(isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
									"mx-auto flex h-8 w-8 items-center justify-center rounded-full",
								)}
							>
								<time dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
							</button>

							<div className="w-1 h-1 mx-auto mt-1">
								{events.some(event => isSameDay(parseISO(event.startDatetime), day)) && (
									<div className="w-1 h-1 rounded-full bg-white"></div>
								)}
							</div>
						</div>
					))}
				</div>
				<img src={beaver3.src} alt="Beaver" className="h-24 absolute -top-16 left-0 -scale-x-100" />
			</div>
			<div
				className="rounded-3xl p-8 bg-black w-full col-start-3 col-end-6 h-[35rem] overflow-hidden"
				data-aos="fade-left"
			>
				<div className="flex flex-col gap-8">
					<div className="flex items-center justify-between gap-4 flex-wrap">
						<h2 className="font-semibold">
							{showUpcomingEvents === -1 ? (
								t("events.previous")
							) : showUpcomingEvents === 1 ? (
								t("events.upcoming")
							) : locale.get() === "fr" ? (
								<span>
									{displayDay} {t("events.months")[displayMonth] || displayMonth}, {displayYear}
								</span>
							) : (
								<span>
									{t("events.months")[displayMonth] || displayMonth} {displayDay}, {displayYear}
								</span>
							)}
						</h2>
						<div className="flex flex-row justify-center items-center shadow-glow">
							<button
								type="button"
								onClick={() => setShowUpcomingEvents(-1)}
								className={`border border-r-[0.5px] border-shade-2 px-3 py-1 transition-all duration-200 rounded-l-md
                                    ${showUpcomingEvents !== -1 ? "text-white" : "text-black bg-shade-2"}`}
							>
								{t("events.previous")}
							</button>
							<button
								type="button"
								onClick={() => setShowUpcomingEvents(0)}
								className={`border border-l-[0.5px] border-r-[0.5px] border-shade-2 px-3 py-1 transition-all duration-200
                                    ${showUpcomingEvents !== 0 ? "text-white" : "text-black bg-shade-2"}`}
							>
								{t("events.day")}
							</button>
							<button
								type="button"
								onClick={() => setShowUpcomingEvents(1)}
								className={`border border-l-[0.5px] border-shade-2 px-3 py-1 transition-all duration-200 rounded-r-md
                                    ${showUpcomingEvents !== 1 ? "text-white" : "text-black bg-shade-2"}`}
							>
								{t("events.upcoming")}
							</button>
						</div>
					</div>
					<hr className="border-shade-7" />
					<div className=" h-[25rem] overflow-auto w-full pr-4">
						<ol className="flex flex-col gap-2">
							{showUpcomingEvents === -1 ? (
								events
									.filter(event => parseISO(event.startDatetime) < today)
									.map((event, i) => <Event event={event} i={i} key={i} />)
							) : showUpcomingEvents === 1 ? (
								events
									.filter(event => parseISO(event.startDatetime) >= today)
									.map((event, i) => <Event event={event} i={i} key={i} />)
							) : selectedDayEvents.length > 0 ? (
								selectedDayEvents.map((event, i) => <Event event={event} i={i} key={i} />)
							) : locale.get() === "fr" ? (
								<>Aucuns évenements</>
							) : (
								<>No events</>
							)}
						</ol>
					</div>
				</div>
			</div>
		</div>
	);
}

function Event({ event, i }) {
	let startDateTime = parseISO(event.startDatetime);
	let endDateTime = parseISO(event.endDatetime);

	let displayDay = startDateTime.toString().slice(8, 10);
	let displayMonth = startDateTime.toString().slice(4, 7);
	let displayYear = startDateTime.toString().slice(11, 15);

	return (
		<li
			className={`flex items-center px-4 py-4 space-x-4 group rounded-xl border ${
				i % 2 !== 0 ? "bg-blur-svg" : "bg-black"
			}`}
		>
			<div className="flex-col gap-4">
				<h4 className="font-semibold">{event.title}</h4>
				<p className="text-sm italic mb-4 items-center flex flex-row flex-wrap">
					{locale.get() === "fr" ? (
						<span>
							{displayDay} {t("events.months")[displayMonth] || displayMonth}, {displayYear}
						</span>
					) : (
						<span>
							{t("events.months")[displayMonth] || displayMonth} {displayDay}, {displayYear}
						</span>
					)}
					<img src={calendar.src} alt="Location" className="h-4 w-4 mx-3 inline-block not-italic" />
					<time dateTime={event.startDatetime}>{format(startDateTime, "h:mm a").toLowerCase()}</time> -{" "}
					<time dateTime={event.endDatetime}>{format(endDateTime, "h:mm a").toLowerCase()}</time>
					<img src={location.src} alt="Location" className="h-4 w-4 mx-2 inline-block not-italic" />
					<span className="text-normal">{event.location}</span>
				</p>
				<p className="text-sm">{event.description}</p>
				<div className="flex justify-end mt-1">
					<Button disabled={event.disabled} onClick={() => window.open(event.link, "_blank")} fill={true}>
						{event.status}
					</Button>
				</div>
			</div>
		</li>
	);
}
