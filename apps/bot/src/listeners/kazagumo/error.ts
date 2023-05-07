import { ApplyOptions } from "@sapphire/decorators";
import { Listener, container } from "@sapphire/framework";

@ApplyOptions<Listener.Options>({
	emitter: container.kazagumo
})
export class UserEvent extends Listener {
	public override run(name: string, error: Error) {
		this.container.logger.fatal(name, error);
	}
}
