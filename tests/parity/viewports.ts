export const referenceViewports = [
	{ width: 320, height: 568 },
	{ width: 390, height: 844 },
	{ width: 768, height: 1024 },
	{ width: 1024, height: 900 },
	{ width: 1025, height: 900 },
	{ width: 1280, height: 720 },
	{ width: 1440, height: 900 },
	{ width: 1920, height: 1080 },
	{ width: 3440, height: 1440 },
];

// Both sides of every active scene width boundary, plus an intermediate desktop.
// 3049 is the artwork's maximum width rather than a CSS media query.
const boundaryWidths = [
	479, 480, 481, 509, 510, 511, 599, 600, 601, 767, 769, 999, 1000, 1001, 1023, 1199, 1200, 1201, 1279, 1281, 1332,
	1439, 1441, 1598, 1599, 1600, 1799, 1800, 1801, 3048, 3049, 3050,
];

export const parityViewports = [
	...referenceViewports,
	...boundaryWidths.map(width => ({ width, height: width <= 1024 ? 1024 : 900 })),
	{ width: 844, height: 390 },
	{ width: 844, height: 499 },
	{ width: 844, height: 500 },
	{ width: 844, height: 501 },
	{ width: 390, height: 539 },
	{ width: 390, height: 540 },
	{ width: 390, height: 541 },
];

export const interactionViewports = [
	{ width: 390, height: 844 },
	{ width: 768, height: 1024 },
	{ width: 1440, height: 900 },
];
