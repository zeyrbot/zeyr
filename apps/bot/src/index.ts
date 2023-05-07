import "./lib/setup";

import { CLIENT_OPTIONS } from "./lib/util";
import { ZeyrClient } from "./lib/structures/ZeyrClient";
import { Result } from "@sapphire/framework";

const client = new ZeyrClient(CLIENT_OPTIONS);

async function init() {
	const resultClient = await Result.fromAsync(async () => await client.start());

	return resultClient.unwrapOrElse((error) => {
		return client.panic(error);
	});
}

init();
