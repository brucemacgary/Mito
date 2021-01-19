import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import 'moment-duration-format';
import moment from 'moment';
import os from 'os';

export default class extends Command {

	public constructor() {
		super('stats', {
			aliases: ['stats'],
			category: 'general',
			description: {
				content: 'Get the bot\'s stats!',
				usage: 'stats',
				example: ['stats']
			}
		});
	}

	public exec(message: Message) {
		const embed = this.client.util.embed()
			.setAuthor('Mito - Stats', this.client.user?.displayAvatarURL())
			.setColor('#ffa053')
			.addField('Owners', '[BruceMacGary](https://discord.gg/etEquR5)\n[Ayush](https://ayushkr.me)', true)
			.addField('Commands', `${this.handler.modules.size}`, true)
			.addField('Memory Used', `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true)
			.addField('Free Memory', `${(os.freemem() / (1024 * 1024)).toFixed(2)} MB`, true)
			.addField('Uptime', `${moment.duration(process.uptime() * 1000).format('D[d], H[h], m[m], s[s]', { trim: 'both mid' })}`, true)
			.addField('Creation Date', '2/10/2020', true)
			.addField('Guilds', `${this.client.guilds.cache.size}`, true)
			.addField('Users', `${this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`, true)
			.addField('Channels', `${this.client.channels.cache.size}`, true)
			.addField('Emojis', `${this.client.emojis.cache.size}`, true)
			.addField('Bot Version', '2.0.1', true)
			.addField('Versions', '<:MitoDiscordjs:774160552506163242>: 12.4.1\n<:MitoNodeJS:774160552293302292>: 14.15.4\n<:MitoDiscordakairo:798432508618342420>: 8.1.0', true)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.util!.send(embed);
	}

}
