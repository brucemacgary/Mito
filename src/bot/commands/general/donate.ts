import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('donate', {
			aliases: ['donate'],
			category: 'general',
			description: {
				content: 'Donate the bot developers to keep the bot running!',
				usage: '',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
		const embed = this.client.util.embed()
			.setAuthor('Mito - Donate & Support', this.client.user?.displayAvatarURL())
			.setColor('#ffa053')
			.setDescription('Donate us on different platforms to get premium access of the bot!')
			.addField('Patreon', 'Donate us on [Patreon](https://patreon.com/mitobot) Monthly!')
			.setFooter(`Tysm For Donating me! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.util!.send(embed);
	}

}
