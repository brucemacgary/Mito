import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('snipe', {
			aliases: ['snipe'],
			category: 'utility',
			description: {
				content: 'Snipe Command',
				usage: '',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
		const snipeData = this.client.snipe.get(`${message.guild?.id}#${message.channel.id}`);

		if (!snipeData) return message.util?.send('There is nothing to snipe');

		const user = await this.client.users.fetch(snipeData?.user);

		const embed = this.client.util.embed()
			.setColor(0xffa053)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setDescription(snipeData.msg)
			.setTimestamp();

		return message.util?.send({ embed });
	}

}
