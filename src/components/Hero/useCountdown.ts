import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { locale, useTranslations } from "@/i18n";
import { getCountdown, HACKING_START_DATE, HACKING_END_DATE } from "./countdown";

export function useCountdown() {
	const [time, setTime] = useState<number | null>(null);
	const currentLocale = useStore(locale);
	const t = useTranslations();

	useEffect(() => {
		const initialTime = Date.now();
		setTime(initialTime);
		if (initialTime >= HACKING_END_DATE) return;

		const interval = window.setInterval(() => {
			const now = Date.now();
			setTime(now);
			if (now >= HACKING_END_DATE) window.clearInterval(interval);
		}, 1000);

		return () => window.clearInterval(interval);
	}, []);

	const { targetDate, countdownAvailable, days, hours, minutes, seconds } = getCountdown(time);
	const formattedHours = hours.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedMinutes = minutes.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const formattedSeconds = seconds.toLocaleString("en-US", { minimumIntegerDigits: 2 });
	const eventStartLabel = t("hero.countdown.event_start");
	const hackingStartLabel = t("hero.countdown.hacking_start");
	const hackingEndLabel = t("hero.countdown.hacking_end");
	const countdownOpenLabel = t("hero.countdown.open");
	const countdownCloseLabel = t("hero.countdown.close");
	const countdownHeading =
		targetDate === HACKING_START_DATE
			? hackingStartLabel
			: targetDate === HACKING_END_DATE
			? hackingEndLabel
			: eventStartLabel;
	const pluralRules = new Intl.PluralRules(currentLocale);
	const countdownItems = [
		{
			key: "days",
			display: String(days),
			label: t(pluralRules.select(days) === "one" ? "hero.countdown.day" : "hero.countdown.days"),
		},
		{
			key: "hours",
			display: formattedHours,
			label: t(pluralRules.select(hours) === "one" ? "hero.countdown.hour" : "hero.countdown.hours"),
		},
		{
			key: "minutes",
			display: formattedMinutes,
			label: t(pluralRules.select(minutes) === "one" ? "hero.countdown.minute" : "hero.countdown.minutes"),
		},
		{
			key: "seconds",
			display: formattedSeconds,
			label: t(pluralRules.select(seconds) === "one" ? "hero.countdown.second" : "hero.countdown.seconds"),
		},
	];

	return { countdownAvailable, countdownHeading, countdownItems, countdownOpenLabel, countdownCloseLabel };
}
