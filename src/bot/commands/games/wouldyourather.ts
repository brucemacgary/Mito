import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message, MessageEmbed } from 'discord.js';

class WouldCommand extends Command {

	public constructor() {
		super('wouldyourather', {
			aliases: ['wouldyourather', 'wyr'],
			category: 'games',
			description: {
				content: 'Would you rather questions from r/wouldyourather',
				usage: '',
				example: []
			}
		});
	}

	public async exec(message: Message) {
		const data = await fetch('https://www.reddit.com/r/wouldyourather/random/.json').then(res => res.json());
		const children = data[0].data.children[0];
		return message.util?.send(children.data.title);
	}

}

export default WouldCommand;
