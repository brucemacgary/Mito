import { Command } from 'discord-akairo';
import { TextChannel, Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('bug', {
			aliases: ['bug'],
			category: 'general',
			description: {
				content: 'Bug Command <a:wtflul:781761267010371626>',
				usage: '',
				example: ['']
			},
			cooldown: 1000 * 60 * 60,
			args: [
				{
					id: 'msg',
					type: 'string',
					match: 'rest',
					prompt: {
						start: 'What is the issue?'
					}
				}
			]
		});
	}

	public async exec(message: Message, { msg }: { msg: string }) {
		const channel = this.client.channels.cache.get('771307243290492928') as TextChannel;

		const embed = this.client.util.embed()
			.setAuthor(`${message.member?.user.tag}`, message.member?.user.displayAvatarURL({ dynamic: true, format: 'png' }))
			.setColor('ORANGE')
			.setTimestamp()
			.addField('Guild Name:', message.guild?.name)
			.addField('Channel ID:', message.channel.id)
			.addField('Issue:', msg);

		await (channel as TextChannel).send(embed);

		await message.util?.send(`You issue **${msg}** has been sent to the support server`);

		return null;
	}

}
