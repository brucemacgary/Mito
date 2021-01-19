/* eslint-disable no-mixed-operators */
import { Command } from 'discord-akairo';
import { Message, Guild } from 'discord.js';
import progressbar from '../../util/progressbar';
import timeString from '../../util/timeString';

export default class SeekCommand extends Command {

	public constructor() {
		super('seek', {
			aliases: ['seek'],
			category: 'music',
			channel: 'guild',
			clientPermissions: ['USE_EXTERNAL_EMOJIS'],
			description: {
				content: 'Seeks to a certain point in the current track',
				examples: ['1:2']
			},
			args: [
				{
					id: 'position',
					type: 'string',
					default: '0'
				}
			]
		});
	}

	public async exec(message: Message, { position }: { position: string }) {
		if (!message.member?.voice.channel) {
			return message.util?.send({
				embed: { description: '<:MItoCross:769434647234347009> You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get((message.guild as Guild).id);
		const current = await queue.current();
		if (!current) return;

		const ms = position.replace('.', ':').split(':');
		let point = 0;

		switch (ms.length) {
			case 1:
				point = Number(ms[0]) * 1000 * 60;
				break;
			case 2:
				point = Number(ms[0]) * 60 * 1000 + Number(ms[1].padEnd(2, '0')) * 1000;
				break;
			case 3:
				point = Number(ms[0]) * 60 * 60 * 1000 + Number(ms[1]) * 60 * 1000 + Number(ms[2]) * 1000;
				break;
			default:
				break;
		}

		await queue.player.seek(point);
		const decoded = await this.client.music.decode(current.track);
		const duration = Number(decoded.length);
		const embed = this.client.util.embed()

			.setColor('#ffa053')
			.setAuthor('Seeked')
			.setTitle(`${decoded.title}`)
			.setURL(`${decoded.uri}`)
			.setThumbnail(`https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`)
			.setDescription([
				`(${timeString(point)}/${decoded.isStream ? '∞' : timeString(decoded.length)})`,
				'\n',
				`${progressbar(point, duration, 15)}`
			]);
		return message.util?.send({ embed });
	}

}
