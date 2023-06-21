import { config } from "./lib/config";
import "./lib/setup";
import { ZeyrClient } from "./lib/structures/extended/client";

import { Result } from "@sapphire/framework";

const client = new ZeyrClient(config.client);

async function init() {
	const resultClient = await Result.fromAsync(async () => await client.start());

	return resultClient.unwrapOrElse((error) => {
		return client.panic(error);
	});
}

init();
