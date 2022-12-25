/* global ContentService, SpreadsheetApp */

// eslint-disable-next-line no-unused-vars
function doGet(e) {
	if (!e.parameter.email) {
		return ContentService.createTextOutput("Missing email address");
	}
	if (!e.parameter.spreadsheetId) {
		return ContentService.createTextOutput("Missing spreadsheetId");
	}

	const ss = SpreadsheetApp.openById(e.parameter.spreadsheetId);
	const ranges = ss.createTextFinder(e.parameter.email).findAll();
	if (ranges.length === 0) {
		return ContentService.createTextOutput("NOT_FOUND");
	}

	ranges.forEach(range => {
		range.setValue("Unsubscribed");
		range.setBackground("red");
	});

	return ContentService.createTextOutput("OK");
}
