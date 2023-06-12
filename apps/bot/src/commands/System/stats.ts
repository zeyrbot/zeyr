import { cdn } from "../../lib/util";
import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { version as sapphire_version } from "@sapphire/framework";
import { codeBlock, objectEntries } from "@sapphire/utilities";
import { EmbedBuilder, version as discordjs_version } from "discord.js";
import sharp from "sharp";

@RegisterSubCommand("system", (builder) =>
	builder
		.setName("stats")
		.setDescription("Display Zeyr general stats and memory usage")
)
export class UserCommand extends Command {
	public override async chatInputRun(
		interaction: Command.ChatInputInteraction<"cached">
	) {
		const versions = this.versions;
		const uptime = this.uptime;
		const memory = this.memory;

		const stats = new EmbedBuilder()
			.setColor(Colors.SKY_500)
			.setTitle("Zeyr stats")
			.setThumbnail(
				cdn(
					"https://raw.githubusercontent.com/zeyrbot/assets/main/images/79900070.png"
				)
			)
			.setImage(
				cdn(
					"https://raw.githubusercontent.com/zeyrbot/assets/main/images/banner.png"
				)
			)
			.addFields(
				{
					name: "Versions",
					value: codeBlock(
						objectEntries(versions)
							.map(([name, version]) => `${name}: ${version}`)
							.join("\n")
					),
					inline: true
				},
				{
					name: "Uptime",
					value: codeBlock(
						`${uptime.day}d ${uptime.hour}h ${uptime.minute}m ${uptime.second}s`
					)
				},
				{
					name: "Memory usage",
					value: codeBlock(
						`Heap: ${memory.ramUsed}mb (Total: ${memory.ramTotal}mb)`
					)
				},
				{
					name: "Build",
					value: codeBlock(`${process.env.BUILD} build`)
				}
			);

		return interaction.reply({
			embeds: [stats]
		});
	}

	private get uptime() {
		const uptime = process.uptime();

		return {
			day: Math.floor(uptime / 86400),
			hour: Math.floor(uptime / 3600) % 24,
			minute: Math.floor(uptime / 60) % 60,
			second: Math.floor(uptime % 60)
		};
	}

	private get versions() {
		return {
			sapphire: sapphire_version,
			"discord.js": discordjs_version,
			imagescript: "1.2.16",
			sharp: sharp.versions.sharp
		};
	}

	private get memory() {
		const usage = process.memoryUsage();

		return {
			ramTotal: `${(usage.heapTotal / 1048576).toFixed(2)}`,
			ramUsed: `${(usage.heapUsed / 1048576).toFixed(2)}`
		};
	}
}
