import "./lib/setup";

import { CLIENT_OPTIONS } from "./lib/util";
import { ZeyrClient } from "./lib/structures/ZeyrClient";

const client = new ZeyrClient(CLIENT_OPTIONS);

async function init() {
	try {
		await client.start();
	} catch (error) {
		client.panic(error);
	}
}

init();
