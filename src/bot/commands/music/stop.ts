import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class StopCommand extends Command {

	public constructor() {
		super('stop', {
			aliases: ['stop', '🛑', '⏹'],
			description: {
				content: 'Stops and clears the queue.'
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2
		});
	}

	public async exec(message: Message) {
		if (!message.member?.voice?.channel) {
			return message.util!.send({
				embed: { description: '<:MItoCross:769434647234347009> You Need to be in voice channel to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild!.id);
		await queue.clear();
		await queue.stop();
		await queue.player.pause();

		return message.util!.send({
			embed: { description: '<:MitoStop:781826615318806538> Stopped the queue.', color: '#F04438' }
		});
	}

}
