import { Argument, Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import paginate from '../../util/paginate';
import timeString from '../../util/timeString';

export default class QueueCommand extends Command {

	public constructor() {
		super('queue', {
			aliases: ['queue', 'q'],
			description: {
				content: 'Shows you the current queue.',
				usage: '[page]',
				examples: ['1', '3']
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'page',
					'match': 'content',
					type: Argument.compose(
						(_, str) => str.replace(/\s/g, ''),
						Argument.range(Argument.union('number', 'emojint'), 1, Infinity)
					),
					default: 1
				}
			]
		});
	}

	public async exec(message: Message, { page }: { page: number }) {
		const queue = this.client.music.queues.get(message.guild!.id);
		const current = await queue.current();
		const tracks = [(current || { track: null }).track].concat(await queue.tracks()).filter(track => track);
		if (!tracks.length) return message.util!.send({
			embed: { description: '<:MItoCross:769434647234347009> Got nothing in queue!', color: 'RED' }
		});
		const decoded = await this.client.music.decode(tracks as any[]);
		const totalLength = decoded.reduce((prev, song) => prev + song.info.length, 0);
		const paginated = paginate(decoded.slice(1), page);
		let index = (paginated.page - 1) * 10;
		let halo = this.client.music.queues.get(message.guild!.id).tracks().length;
		const embed = new MessageEmbed()
				.setColor('#ffa053')
				.setTitle('Music Queue')
				.addField('Now Playing', `**[${decoded[0].info.title}](${decoded[0].info.uri})**\`(${timeString(current?.position ?? 0)} / ${timeString(decoded[0].info.length)})\``, true)
				.setDescription(`There are currently \`${halo}\` songs in the queue with a total duration of \`${timeString(totalLength)}\`\n**Song queue${paginated.page > 1 ? `, page ${paginated.page}` : ''}:**
				${
	paginated.items.length
		? paginated.items
			.map(song => `\`${++index}\` **[${song.info.title}](${song.info.uri})** \`(${timeString(song.info.length)})\``)
			.join('\n')
		: 'The queue is currently empty.'
}`);
		if (paginated.maxPage > 1) embed.setFooter('Use queue <page> to view a specific page.');

		return message.util!.send(embed);
	}

}
