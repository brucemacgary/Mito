import { Listener } from 'discord-akairo';
import { Message, Guild } from 'discord.js';

class MessageEvent extends Listener {

	public constructor() {
		super('message', {
			event: 'message',
			emitter: 'client',
			category: 'client'
		});
	}

	public async exec(message: Message) {
		const level = this.client.settings.get((message.guild as Guild).id, 'level', false);

		if (!level || message.author.bot) return;
		await this.client.levels.giveGuildUserExp(message.author?.id, message);
	}

}

export default MessageEvent;
