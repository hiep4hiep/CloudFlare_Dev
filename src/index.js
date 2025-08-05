/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
		//return new Response('Hello World!');
		const url = new URL(request.url);
		console.log(url);
		const path = url.pathname;
		// Handle the root path
		if (path === "/secure" || path === "/") {
			const EMAIL = request.headers.get("cf-access-authenticated-user-email") || "Unknown";
			const TIMESTAMP = new Date().toISOString();
			const REQUEST_URL = request.url;
			const COUNTRY = request.cf.country;
			const COUNTRY_LINK = `${REQUEST_URL}/${COUNTRY}`
			const html = `
				<!DOCTYPE html>
				<html lang="en">
				<head>
					<meta charset="UTF-8">
					<title>Authentication Info</title>
				</head>
				<body>
					<p>
						${EMAIL} authenticated at ${TIMESTAMP} from <a href="${COUNTRY_LINK}">${COUNTRY}</a>
					</p>
				</body>
				</html>
			`;
			return new Response(html, {
				headers: { "Content-Type": "text/html; charset=UTF-8" }
			});
		}
		// Handle country code paths
		const match = path.match(/^\/secure\/([a-z]{2})$/);
		if (match) {
			const countryCode = match[1].toLowerCase();
			const object = await env.MY_BUCKET.get(`${countryCode}.png`);
			if (!object) return new Response("Not found", { status: 404 });

			return new Response(object.body, {
				headers: { "Content-Type": "image/png" },
				});
			} else {
			return new Response("Page error", { status: 404 });
			}
		} 
};
