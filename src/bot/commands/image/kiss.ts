import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('kiss', {
			aliases: ['kiss'],
			category: 'image',
			description: {
				content: 'Get naughty and kiss the person',
				example: '',
				usage: []
			}
		});
	}

	public async exec(message: Message) {
		const data = await fetch(encodeURI('https://nekos.life/api/kiss')).then(d => d.json());
		const user = message.mentions.users.first() || message.author;
		const kissed = message.author.id === user.id ? 'themselves' : user.username;
		const embed = new MessageEmbed()
			.setTitle(`💋 ${message.author.username} Kissed ${kissed}`)
			.setImage(`${data.url}`)
			.setColor('#ffa053');

		return message.util?.send(embed);
	}

}
