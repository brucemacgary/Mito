// https://complimentr.com/api
import { Command } from 'discord-akairo';
import fetch from 'node-fetch';
import { Message } from 'discord.js';

class MemeCommand extends Command {

	public constructor() {
		super('compliment', {
			aliases: ['compliment'],
			category: 'fun',
			description: {
				content: 'Give a compliment to someone!',
				usage: '',
				example: []
			}
		});
	}

	public async exec(message: Message) {
		const { compliment } = await fetch('https://complimentr.com/api').then(res => res.json());

		return message.util?.send(compliment);
	}

}

export default MemeCommand;
