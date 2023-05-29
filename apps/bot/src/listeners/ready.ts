import { Dlist } from "../lib/util/wrappers/dlist";
import { ApplyOptions } from "@sapphire/decorators";
import { Listener, Piece, type PieceOptions, Store } from "@sapphire/framework";
import { blue, blueBright, gray, red, yellow } from "colorette";

const dev = process.env.NODE_ENV !== "production";

@ApplyOptions<Listener.Options>({ once: true })
export class UserEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	public async run() {
		this.printStoreDebugInformation();
		this.printBanner();

		if (!dev) {
			await this.postGuildCount();
		}
	}

	private dlist = new Dlist(
		"1095425642159407165",
		process.env.DLIST_KEY as string,
	);

	private printBanner() {
		this.container.logger.info(this.logo.join("\n"));
	}

	private logo = [
		red(String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠞⢳⠀⠀⠀⠀⠀`),
		red(String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⠋⠀⢰⠎⠀⠀⠀⠀⠀`),
		red(String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⢆⣤⡞⠃⠀⠀⠀⠀⠀⠀`),
		red(String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⢠⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀`),
		red(String.raw`⠀⠀⠀⠀⢀⣀⣾⢳⠀⠀⠀⠀⢸⢠⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`),
		red(String.raw`⣀⡤⠴⠊⠉⠀⠀⠈⠳⡀⠀⠀⠘⢎⠢⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀`),
		red(String.raw`⠳⣄⠀⠀⡠⡤⡀⠀⠘⣇⡀⠀⠀⠀⠉⠓⠒⠺⠭⢵⣦⡀⠀⠀⠀`),
		red(String.raw`⠀⢹⡆⠀⢷⡇⠁⠀⠀⣸⠇⠀⠀⠀⠀⠀⢠⢤⠀⠀⠘⢷⣆⡀⠀`),
		red(String.raw`⠀⠀⠘⠒⢤⡄⠖⢾⣭⣤⣄⠀⡔⢢⠀⡀⠎⣸⠀⠀⠀⠀⠹⣿⡀`),
		red(String.raw`⠀⠀⢀⡤⠜⠃⠀⠀⠘⠛⣿⢸⠀⡼⢠⠃⣤⡟⠀⠀⠀⠀⠀⣿⡇`),
		red(String.raw`⠀⠀⠸⠶⠖⢏⠀⠀⢀⡤⠤⠇⣴⠏⡾⢱⡏⠁⠀⠀⠀⠀⢠⣿⠃`),
		red(String.raw`⠀⠀⠀⠀⠀⠈⣇⡀⠿⠀⠀⠀⡽⣰⢶⡼⠇⠀⠀⠀⠀⣠⣿⠟⠀`),
		red(String.raw`⠀⠀⠀⠀⠀⠀⠈⠳⢤⣀⡶⠤⣷⣅⡀⠀⠀⠀⣀⡠⢔⠕⠁⠀⠀`),
		red(String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠫⠿⠿⠿⠛⠋⠁⠀⠀⠀⠀`),
	];

	private async postGuildCount() {
		this.dlist
			.postGuildCount(this.container.client.guilds.cache.size)
			.then(() =>
				this.container.logger.info(`${blueBright("")} Posted guild count`),
			);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;

		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: Store<Piece<PieceOptions>>, last: boolean) {
		return gray(
			`${last ? "└─" : "├─"} Loaded ${this.style(
				store.size.toString().padEnd(3, " "),
			)} ${store.name}.`,
		);
	}
}
