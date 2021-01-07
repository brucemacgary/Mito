import { Command } from 'discord-akairo';
import { Message, TextChannel, MessageEmbed, MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('hug', {
			aliases: ['hug'],
			category: 'image',
			description: {
				content: 'Hug someone',
				example: '',
				usage: []
			}
		});
	}

	public async exec(message: Message) {


		

        const data = await fetch(encodeURI('https://nekos.life/api/v2/img/hug')).then(d => d.json());
        const user = message.mentions.users.first() || message.author;
        const kissed = message.author.id === user.id ? "themselfs" : user.username;
        const embed = new MessageEmbed()
        .setTitle(`🫂 ${message.author.username} Hugged ${kissed}`)
        .setImage(`${data.url}`)
        .setColor('#ffa053')
        message.util?.send(embed)
		

	}

}
