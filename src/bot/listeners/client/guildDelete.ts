import { stripIndents } from 'common-tags';
import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';

export default class extends Listener {

	public constructor() {
		super('guildDelete', {
			emitter: 'client',
			event: 'guildDelete',
			category: 'client'
		});
	}

	public async exec(guild: Guild) {
		const channel = this.client.channels.cache.get('793380044684132362') as TextChannel;
		const owner = await this.client.users.fetch(guild.ownerID);

		const embed = this.client.util.embed()
			.setColor('RED')
			.setAuthor('Left a server!', 'https://cdn.discordapp.com/emojis/738078326937223169.png?v=1')
			.addField('Server', `**Name:** ${guild.name}\n**ID:** ${guild.id}`, true)
			.addField('Owner', `**Name:** ${owner.tag}\n**ID:** ${owner.id}`, true)
			.addField('Members', `${guild.memberCount}`, true)
			.setFooter(`I am now in ${this.client.guilds.cache.size} servers!`, 'https://cdn.discordapp.com/emojis/738077962733092874.png?v=1');
		return channel.send({ embed });

	}

}
