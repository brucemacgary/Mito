import { Command } from 'discord-akairo';
import { User, Message, MessageEmbed } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('gayrate', {
			aliases: ['gayrate'],
			category: 'fun',
			description: {
				content: 'what is the percentage of your gayness?',
				usage: '',
				example: ['Ayush is 100% gay!']
			},
			args: [
				{
					id: 'user',
					type: 'user',
					default: (m: Message) => m.author
				}
			]
		});
	}

	public async exec(message: Message, { user }: { user: User }) {
        const min = Math.ceil(1);
        const max = Math.floor(100);
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        const embed = new MessageEmbed()
        .setTitle("Gayr8 machine")
        .setDescription(`${message.mentions.users.first()} is ${num}% gay 🏳️‍🌈`)
        .setColor("ORANGE")
        .setFooter(message.author.username)
        .setTimestamp();

		return message.util?.send(embed);

	}

}
