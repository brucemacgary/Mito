import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class LeaveCommand extends Command {

	public constructor() {
		super('leave', {
			aliases: ['leave', 'dc', 'disconnect'],
			description: {
				content: 'Leaves the voice channel (`--clear` to clear the queue before leaving)',
				usage: '[--clear/-c]',
				examples: ['--clear', '-c']
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
		await queue.player.destroy();
		if (message.guild?.me?.voice.channel) await queue.player.leave();


		return message.util!.send({
			embed: { description: '<:MitoTick:769434647590731786> Left the voice channel!', color: '#43b582' }
		});
	}

}
