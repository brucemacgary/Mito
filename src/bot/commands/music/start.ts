import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class StartCommand extends Command {

	public constructor() {
		super('start', {
			aliases: ['start', '▶', '🎶', '🎵', '🎼', '🎹', '🎺', '🎻', '🎷', '🎸', '🎤', '🎧', '🥁'],
			description: {
				content: 'Joins and starts the queue.',
				usage: '[--force/-f]',
				examples: ['--force', '-f']
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'force',
					match: 'flag',
					flag: ['--force', '-f']
				}
			]
		});
	}

	public async exec(message: Message, { force }: { force: boolean }) {
		if (!message.member?.voice?.channel) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.joinable) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> I don\'t have permissions to enter the channel!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.speakable) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> I don\'t have permissions to speak in the voice channel!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get(message.guild!.id);
		if (!message.guild!.me!.voice || !message.guild!.me!.voice.channel || force) {
			await queue.player.join(message.member.voice.channel.id);
			await message.util!.send({
				embed: { description: '<a:MitoMusic:768806945720369182> Started playing the songs!', color: '#ffa053' }
			});
		}
		if ((!queue.player.playing && !queue.player.paused) || force) await queue.start();
	}

}
