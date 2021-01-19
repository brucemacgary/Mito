import { Argument, Command } from 'discord-akairo';
import { Message } from 'discord.js';
import * as path from 'path';
import * as url from 'url';
import timeString from '../../util/timeString';

export default class PlayCommand extends Command {

	public constructor() {
		super('play', {
			aliases: ['play', 'p', 'add', '📥', '➕'],
			description: {
				content: 'Play a song from literally any source you can think of.',
				usage: '<link/search>',
				examples: ['bye pewdiepie carryminati']
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'unshift',
					match: 'flag',
					flag: ['--next', '-n', '--start', '-s']
				},
				{
					id: 'query',
					'match': 'rest',
					type: Argument.compose('string', (_, str) => str?.replace(/<(.+)>/g, '$1')),
					default: ''
				}
			]
		});
	}

	public async exec(message: Message, { query, unshift }: { query: string; unshift: boolean }) {
		if (!message.member?.voice?.channel) {
			return message.util!.send({
				embed: { description: '<:MItoCross:769434647234347009> You Need to be in voice channel to use that command!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.joinable) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> I do not have permissions to connect to that channel!', color: 'RED' }
			});
		} else if (!message.member.voice.channel.speakable) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> I do not have permissions to speak in that channel!', color: 'RED' }
			});
		}

		if (!query && message.attachments.first()) {
			query = message.attachments.first()!.url;
			if (!['.mp3', '.ogg', '.flac', '.m4a'].includes(path.parse(url.parse(query).path!).ext)) return;
		}
		if (!query) return;


		if (!['http:', 'https:'].includes(url.parse(query).protocol!)) query = `ytsearch:${query}`;

		const res = await this.client.music.load(query);
		const queue = this.client.music.queues.get(message.guild!.id);

		if (!message.guild?.me?.voice.channel) await queue.player.join(message.member.voice.channel.id);

		// eslint-disable-next-line @typescript-eslint/init-declarations
		let msg;

		if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(res.loadType)) {
			if (unshift) await queue.unshift(res.tracks[0].track);
			else await queue.add(res.tracks[0].track);
			msg = this.client.util.embed()
		    .setColor('#ffa053')

				.setThumbnail(`https://i.ytimg.com/vi/${res.tracks[0].info.identifier}/hqdefault.jpg`)
				.setTitle(`**${res.tracks[0].info.title}**`)
				.setURL(`${res.tracks[0].info.uri}`)
				.addField('Length', `(${res.tracks[0].info.isStream ? '∞' : timeString(res.tracks[0].info.length)})`, true)
				.addField('Uploader', `${res.tracks[0].info.author}`, true)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
		} else if (res.loadType === 'PLAYLIST_LOADED') {
			await queue.add(...res.tracks.map(track => track.track));
			msg = res.playlistInfo.name;
		} else {
			return message.util!.send({
				embed: { description: '<:MItoCross:769434647234347009> I couldn\'nt look for the song you are trying to search for!', color: 'RED' }
			});
		}
		if (!queue.player.playing && !queue.player.paused) await queue.start();

		return message.util!.send(msg);
	}

}
