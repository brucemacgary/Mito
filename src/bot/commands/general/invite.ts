import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('invite', {
			aliases: ['invite', 'in'],
			category: 'general',
			description: {
				content: 'Invite me to your servers!',
				usage: '',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
		const embed = this.client.util.embed()
			.setAuthor('Mito - Invite', this.client.user?.displayAvatarURL())
			.setColor('#ffa053')
			.setDescription('<a:BMG_Arrow:750994876992323614>Click [here](https://discord.com/api/oauth2/authorize?client_id=761469922563063818&permissions=8&scope=bot) to invite me to your server.\n<a:BMG_Arrow:750994876992323614>Click [here](https://discord.gg/mDF5QPG) to join the support server.')
			.setFooter(`Tysm For Adding me! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.util!.send(embed);
	}

}
