// eslint-disable-next-line import/no-anonymous-default-export
export default {
	async fetch(request, env) {
		return await handleRequest(request, env);
	},
};

async function handleRequest(request, env) {
	const url = new URL(request.url);

	const headers = new Headers();
	headers.append("Content-Type", "application/json");
	headers.append("Access-Control-Allow-Origin", "*");
	headers.append("Access-Control-Allow-Headers", "*");
	headers.append("Access-Control-Allow-Methods", "GET");

	if (url.pathname !== "/unsubscribe") {
		return new Response("Not Found", { status: 404, headers });
	}

	const email = url.searchParams.get("email");
	if (!email) {
		return new Response("Missing email address", { status: 400, headers });
	}

	const response = await (
		await fetch(
			`https://script.google.com/macros/s/${env.SHEETS_MACRO_ID}/exec?email=${email}&spreadsheetId=${env.SHEETS_ID}`
		)
	).text();

	if (response === "OK") {
		return new Response("OK", { status: 200, headers });
	} else if (response === "NOT_FOUND") {
		return new Response("Email address not found", { status: 404, headers });
	} else {
		return new Response("An error occurred while unsubscribing", { status: 500, headers });
	}
}
