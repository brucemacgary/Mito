import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ShuffleCommand extends Command {

	public constructor() {
		super('shuffle', {
			aliases: ['shuffle', '🔀'],
			description: {
				content: 'Shuffles the queue.'
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2
		});
	}

	public async exec(message: Message) {
		if (!message.member?.voice?.channel) {
			return message.util!.send({
				embed: { description: '<:MItoCross:769434647234347009> You have to be in a voice channel first.', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild!.id);
		await queue.shuffle();

		return message.util!.send({
			embed: { description: '<:MitoShuffle:781825691355709480> Shuffled the queue.', color: '#F04438' }
		});
	}

}
