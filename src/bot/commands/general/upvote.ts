import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('upvote', {
			aliases: ['upvote'],
			category: 'general',
			description: {
				content: 'Upvote me on the popular bot lists to get rewards!',
				usage: '',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
		const embed = this.client.util.embed()
			.setAuthor('Mito - Upvote', this.client.user?.displayAvatarURL())
			.setColor('#ffa053')
			.setDescription('Upvote me on diffrent bot lists to get premium access of few commands!')
			.addField('Recommeded Bot Lists -', '[Top.gg](https://top.gg/bot/761469922563063818/vote)\n[Discord Bot List]()\n')
			.setFooter(`Tysm For Upvoting me! ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.util!.send(embed);
	}

}
