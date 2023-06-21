import { cdn, format, formatBytes } from "../../lib/util";
import { Colors } from "@discord-factory/colorize";
import {
	Command,
	RegisterSubCommand
} from "@kaname-png/plugin-subcommands-advanced";
import { codeBlock, objectEntries } from "@sapphire/utilities";
import { version as discordjs_version, EmbedBuilder } from "discord.js";
import { version as sapphire_version } from "@sapphire/framework";
import { version as ts_version } from "typescript";
import sharp from "sharp";
import os from "node:os";

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
		const memoryUsage = this.memoryUsage;
		const host = this.host;
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
			.setFooter({
				text: `${this.container.client.guilds.cache.size} guilds`
			})
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
					name: "Bot uptime",
					value: codeBlock(
						format(
							"{}d {}h {}m {}s",
							uptime.day,
							uptime.hour,
							uptime.minute,
							uptime.second
						)
					)
				},
				{
					name: "Host uptime",
					value: codeBlock(
						format(
							"{}d {}h {}m {}s",
							host.uptime.day,
							host.uptime.hour,
							host.uptime.minute,
							host.uptime.second
						)
					)
				},
				{
					name: "Host",
					value: codeBlock(host.name)
				},
				{
					name: "Memory usage",
					value: codeBlock(
						format(
							"Heap: {} (Total: {})",
							memoryUsage.ramUsed,
							memoryUsage.ramTotal
						)
					)
				},
				{
					name: "Memory",
					value: codeBlock(format("{}/{}", memory.ramUsed, memory.ramTotal))
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
		} as unknown as Record<string, string>;
	}

	private get versions() {
		return {
			node: process.version,
			typescript: ts_version,
			sapphire: sapphire_version,
			discordjs: discordjs_version,
			imagescript: "latest",
			sharp: sharp.versions.sharp
		};
	}

	private get memoryUsage() {
		const usage = process.memoryUsage();

		return {
			ramTotal: formatBytes(usage.heapTotal),
			ramUsed: formatBytes(usage.heapUsed)
		};
	}

	private get memory() {
		const free = os.freemem();
		const total = os.totalmem();

		return {
			ramTotal: formatBytes(total),
			ramUsed: formatBytes(free)
		};
	}

	private get host() {
		const name = os.hostname();
		const uptime = os.uptime();

		return {
			name,
			uptime: {
				day: Math.floor(uptime / 86400),
				hour: Math.floor(uptime / 3600) % 24,
				minute: Math.floor(uptime / 60) % 60,
				second: Math.floor(uptime % 60)
			} as unknown as Record<string, string>
		};
	}
}
