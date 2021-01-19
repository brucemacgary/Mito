
import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';
import progressbar from '../../util/progressbar';
import timeString from '../../util/timeString';

export default class QueueCommand extends Command {

	public constructor() {
		super('nowplaying', {
			aliases: ['nowplaying', 'np'],
			description: {
				content: 'Shows you the current song.'
			},
			category: 'music',
			channel: 'guild'
		});
	}

	public async exec(message: Message) {
		const queue = this.client.music.queues.get(message.guild!.id);
		const current = await queue.current();
		if (!current) {
			return message.util!.send({
				embed: { description: '<:MItoCross:769434647234347009> Got nothing in queue!', color: 'RED' }
			});
		}
		const decoded = await this.client.music.decode(current.track);

		const embed = new MessageEmbed()
			.setColor('#ffa053')
			.setTitle(`${decoded.title}`)
			.setURL(`${decoded.uri}`)
			.setThumbnail(`https://i.ytimg.com/vi/${decoded.identifier}/hqdefault.jpg`)
			.setDescription(`${progressbar(current.position, decoded.length, 15)}`)
			.addField('Time', `<:MitoTimer:786446116849582091> \`[${timeString(current?.position ?? 0)} / ${timeString(decoded.length)}]\``, true)
			.addField('Loop', '<:MitoEnabled:786446115381837889>`Enabled`\n<:MitoDisable:786446115511336990> `Disabled`', true)
			.addField('Bassboost', '<:MitoEnabled:786446115381837889>`Enabled`\n<:MitoDisable:786446115511336990> `Disabled`', true)
			.setTimestamp()
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
		return message.util!.send(embed);
	}

}
