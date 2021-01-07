import { Command } from 'discord-akairo';
import { Message, TextChannel } from 'discord.js';

export default class SetModChannelCommand extends Command {

	public constructor() {
		super('set-modlog', {
			aliases: ['set-modlog', 'modchan', 'mod-channel'],
			category: 'config',
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			ratelimit: 2,
			args: [
				{
					id: 'channel',
					match: 'content',
					type: 'textChannel',
					default: (m: Message) => m.channel
				}
			],
			description: {
				content: 'Sets the mod log many of the commands use to log moderation actions.',
				usage: '<channel>',
				examples: ['#mod-log', 'mog-log']
			}
		});
	}

	public exec(message: Message, { channel }: { channel: TextChannel }) {
		void this.client.settings.set(message.guild!, 'mod', channel.id);
		return message.util?.send(`Set moderation log channel to **${channel.name}**`);
	}

}
