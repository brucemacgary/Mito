import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PauseCommand extends Command {

	public constructor() {
		super('pause', {
			aliases: ['pause'],
			description: {
				content: 'Pauses the queue.'
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2
		});
	}

	public async exec(message: Message) {
		if (!message.member?.voice?.channel) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> You need to be in a voice channel to use this command.', color: 'RED' } 
			});
		}
		const queue = this.client.music.queues.get(message.guild!.id);
		await queue.player.pause();

		return message.util!.send({
				embed: { description: '<:MitoPause:781828381905256498> Paused the queue.', color: '#F04438'}
			});
	}

}
