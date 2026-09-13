export const EVENT_START_DATE = new Date("2026-09-25T17:00:00-04:00").getTime();
export const HACKING_START_DATE = new Date("2026-09-25T23:00:00-04:00").getTime();
export const HACKING_END_DATE = new Date("2026-09-27T11:00:00-04:00").getTime();

function getTargetDate(time: number | null) {
	if (time === null) return null;
	if (time < EVENT_START_DATE) return EVENT_START_DATE;
	if (time < HACKING_START_DATE) return HACKING_START_DATE;
	if (time < HACKING_END_DATE) return HACKING_END_DATE;
	return null;
}

export function getCountdown(time: number | null) {
	const targetDate = getTargetDate(time);
	const countdownAvailable = targetDate !== null;
	const remainingTime = targetDate === null || time === null ? 0 : Math.max(0, targetDate - time);
	const days = Math.floor(remainingTime / 1000 / 60 / 60 / 24);
	const hours = Math.floor(remainingTime / 1000 / 60 / 60) % 24;
	const minutes = Math.floor(remainingTime / 1000 / 60) % 60;
	const seconds = Math.floor(remainingTime / 1000) % 60;

	return { targetDate, countdownAvailable, days, hours, minutes, seconds };
}
