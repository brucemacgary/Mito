import { Argument, Command } from 'discord-akairo';
import { Message, Guild } from 'discord.js';
import timeString from '../../util/timeString';

export default class SkipCommand extends Command {

	public constructor() {
		super('skip', {
			aliases: ['skip', 's', '🏃'],
			description: {
				content: 'Skips the amount of songs you specify (defaults to 1)',
				usage: '<num>',
				examples: ['3', '1']
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2,
			flags: ['-f']
		});
	}

	public *args() {
		const num = yield {
			'match': 'rest',
			type: Argument.compose((message: Message, str: string) => str.replace(/\s/g, ''), Argument.range(Argument.union('number', 'emojint'), 1, Infinity)),
			default: 1
		};

		return { num };
	}

	public async exec(message: Message, { num }: { num: number }) {
		if (!message.member?.voice || !message.member?.voice.channel) {
			return message.util?.send({
				embed: { description: '<:MItoCross:769434647234347009> You must be connected to a voice channel in order to use that command!', color: 'RED' }
			});
		}
		const queue = this.client.music.queues.get((message.guild as Guild).id);
		const queues = await queue.tracks();

		num = !queues.length || num > queues.length ? 1 : num;
		const skip = await queue.next(num);
		if (!skip) {
			await queue.stop();
			return message.util?.send({
				embed: { description: '<:MitoSkip:781827050380984341> Skipped the current song.', color: '#F04438' }
		});
		}

		const song = await this.decode(queues[num - 1]);

		const embed = this.client.util.embed()
		    .setColor('#ffa053')
			.setTitle('<a:MitoMusic:768806945720369182> Now Playing')
			.setThumbnail(`https://i.ytimg.com/vi/${song.identifier}/hqdefault.jpg`)
			.setDescription([
				`**[${song.title}](${song.uri})** \n\`[${song.isStream ? '∞' : timeString(song.length)}]\``
			]);

		return message.util?.send({ embed });
	}

	public async decode(track: string) {
		const decoded = await this.client.music.decode(track);
		return decoded;
	}

}
