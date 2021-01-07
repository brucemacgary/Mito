import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('ping', {
			aliases: ['ping'],
			category: 'general',
			description: {
				content: 'Ping Command',
				usage: '',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
		const msg = await message.util!.send('Pinging...');
		const ping = (msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp);
		return message.util!.send(`Pong! (Roundtrip took: ${ping.toString()}ms. Heartbeat: ${Math.round(this.client.ws.ping).toString()}ms.)`);
	}

}
