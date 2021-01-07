import { Command } from 'discord-akairo';
import { Message, TextChannel, MessageEmbed, MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('porn', {
			aliases: ['porn'],
			category: 'nsfw',
			description: {
				content: '',
				example: '',
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

		const data = await fetch(encodeURI('https://nekobot.xyz/api/image?type=pgif')).then(d => d.json());

		const attachment = new MessageAttachment(data.message, 'porn.gif');

		return message.util?.send(attachment);

	}

}
