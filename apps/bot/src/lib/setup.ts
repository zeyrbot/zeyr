// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= "development";

import "@kaname-png/plugin-subcommands-advanced/register";
import "@sapphire/plugin-i18next/register";
import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-utilities-store/register";

import {
	ApplicationCommandRegistries,
	RegisterBehavior,
} from "@sapphire/framework";
import { setup } from "@skyra/env-utilities";
import * as colorette from "colorette";

// Set default behavior to bulk overwrite
ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
	RegisterBehavior.BulkOverwrite,
);

// Read env var
setup();

// Enable colorette
colorette.createColors({ useColor: true });
