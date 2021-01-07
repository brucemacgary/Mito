import { Command } from 'discord-akairo';
import { Guild, Message } from 'discord.js';

export default class LoopCommand extends Command {

	public constructor() {
		super('loop', {
			aliases: ['loop', 'repeat'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['USE_EXTERNAL_EMOJIS', 'EMBED_LINKS'],
			description: {
				content: 'Loops the current song in the queue.'
			}
		});
	}

	public exec(message: Message) {
		if (!message.member?.voice.channel) {
			return message.util?.send({
				embed: { description: '<:MItoCross:769434647234347009> You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}

		let enabled = '<:MitoLoop:781826858299424799> **Enabled**';

		let disabled = '<:MitoLoop:781826858299424799> **Disabled**';

		const queue = this.client.music.queues.get((message.guild as Guild).id);
		const looping: boolean = queue.looping() ? queue.looping(false) : queue.looping(true);
		return message.util?.send({
			embed: {
				description: looping ? `${enabled}` : `${disabled}`,
				color: '#F04438'
			}
		});
	}

}
