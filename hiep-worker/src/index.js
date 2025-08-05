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
		const EMAIL = request.headers.get("cf-access-authenticated-user-email") || "Unknown";
		const TIMESTAMP = new Date().toISOString();
		const TEST_PARAM = request.cf.timezone  ;
		const COUNTRY = request.cf.country;
		return new Response(`${EMAIL} authenticated at ${TIMESTAMP} from ${COUNTRY}`);
	},
};
