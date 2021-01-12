import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message } from 'discord.js';

class MemeCommand extends Command {

	public constructor() {
		super('aita', {
			aliases: ['aita', 'amitheasshole'],
			category: 'fun',
			description: {
				content: 'reddit Command',
				usage: '',
				example: []
			}
		});
	}

	public async exec(message: Message) {
		const data = await fetch('https://www.reddit.com/r/AmItheAsshole/random/.json').then(res => res.json());
		const children = data.data.children[0];

		const embed = this.client.util.embed()
			.setColor('ORANGE')
			.setTitle(children.data.title)
			.setDescription(children.data.selftext)
			.setURL(`https://reddit.com${children.data.permalink}`);
		return message.util?.send(embed);
	}

}

export default MemeCommand;
