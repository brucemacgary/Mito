import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class ResumeCommand extends Command {

	public constructor() {
		super('resume', {
			aliases: ['resume'],
			description: {
				content: 'Resumes the queue.'
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
		await queue.player.pause(false);

		return message.util!.send({
			embed: { description: '<:MitoPlay:781827957005090856> Resumed the queue.', color: '#F04438' }
		});
	}

}
