import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('panda', {
			aliases: ['panda'],
			category: 'animals',
			description: {
				content: 'A random image and fact of panda.',
				example: '',
				usage: []
			}
		});
	}

	public async exec(message: Message) {
		const data = await fetch('https://no-api-key.com/api/v1/animals/panda').then(d => d.json());

		const embed = this.client.util.embed()
			.setColor('ORANGE')
			.setTitle(data.fact)
			.setURL(data.image)
			.setImage(data.image);

		return message.util?.send({ embed });

	}

}
