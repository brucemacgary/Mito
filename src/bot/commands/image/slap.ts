import { Command } from 'discord-akairo';
import { Message, MessageAttachment, User } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('slap', {
			aliases: ['slap', 'batslap'],
			category: 'image',
			description: {
				content: 'makes a brazzers poster out of your avatar',
				examples: ['@Bruce @Ayush'],
				usage: '[user 1] [user 2]'
			},
			args: [
				{
					id: 'user',
					type: 'user',
					default: (m: Message) => m.client.user
				}
			]
		});
	}

	public async exec(message: Message, { user }: { user: User }) {
		const msg = await message.util?.send('**Generating the image.**');
		const res = await fetch('https://v1.api.amethyste.moe/generate/batslap', {
			method: 'POST',
			body: JSON.stringify({
				avatar: message.author.displayAvatarURL({ format: 'png', size: 512 }),
				url: user.displayAvatarURL({ format: 'png', size: 512 })
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.AME_API}`
			}
		});
		const buffer = await res.buffer();
		const attachment = new MessageAttachment(buffer, 'slap.png');
		await message.util?.send(attachment);
		return msg?.delete();
	}

}
