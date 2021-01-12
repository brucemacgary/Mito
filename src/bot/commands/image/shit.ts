import { Command } from 'discord-akairo';
import { Message, User, MessageAttachment } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('shit', {
			aliases: ['shit'],
			category: 'image',
			description: {
				content: 'A random of you being shit',
				example: '',
				usage: []
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

	public exec(message: Message, { user }: { user: User }) {
		const avatar = user.displayAvatarURL({ format: 'png', size: 2048 });
		const image = new MessageAttachment(`https://api.no-api-key.com/api/v2/crap?stepped=${avatar}`, 'shit.png');
		return message.util?.send(image);
	}

}
