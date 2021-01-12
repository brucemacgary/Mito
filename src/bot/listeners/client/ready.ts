import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {

	public constructor() {
		super('ready', {
			event: 'ready',
			category: 'client',
			emitter: 'client'
		});
	}

	public exec() {
		this.client.logger.info(`Ready ${this.client.user!.tag}`, { label: 'READY' })
        this.client.user?.setPresence({ activity: { name: 'm!help', type: "LISTENING" }, status: "online"});
	}

}
