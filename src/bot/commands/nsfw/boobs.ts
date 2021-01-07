import { Command } from 'discord-akairo';
import { Message, TextChannel, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('boobs', {
			aliases: ['boobs'],
			category: 'nsfw',
			description: {
				content: 'nsfw image',
				example: '.boobs',
				usage: []
			}
		});
	}

	public async exec(message: Message) {
		const embed = new MessageEmbed()
			.setImage('https://i.imgur.com/oe4iK5i.gif')
			.setAuthor('This Channel isn\'t NSFW')
			.setColor('#ffa053')
			.setDescription('Turn on NSFW in order to use this command');
		if (!(message.channel as TextChannel).nsfw) return message.util?.send({ embed });

		const data = await fetch(
			'http://api.oboobs.ru/boobs/0/1/random'
		).then(res => res.json());

		const bembed = new MessageEmbed()
			.setTitle('here, take some pics')
			.setColor('#ffa053')
			.setImage(`http://media.oboobs.ru/${data[0].preview}`);

		return message.util?.send(bembed);

	}

}
