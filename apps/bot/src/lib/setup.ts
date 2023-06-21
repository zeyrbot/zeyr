import {
	ApplicationCommandRegistries,
	RegisterBehavior
} from "@sapphire/framework";
import { setup } from "@skyra/env-utilities";
import * as colorette from "colorette";

import "@kaname-png/plugin-subcommands-advanced/register";
import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-utilities-store/register";

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
	RegisterBehavior.BulkOverwrite
);

// Read env var
setup();

// Enable colorette
colorette.createColors({ useColor: true });
