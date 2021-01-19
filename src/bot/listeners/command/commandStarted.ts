import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';

export default class CommandStartedListener extends Listener {

	public constructor() {
		super('commandStarted', {
			emitter: 'commandHandler',
			event: 'commandStarted',
			category: 'commandHandler'
		});
	}

	public exec(message: Message, command: Command) {
		if (command.ownerOnly) return;

		const cmd: number = this.client.settings.get('commands', command.id, 0);
		const total = cmd + 1;

		return this.client.settings.set('commands', command.id, total);
	}

}
