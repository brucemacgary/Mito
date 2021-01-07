import { stripIndents } from 'common-tags';
import { Listener } from 'discord-akairo';
import { Guild, TextChannel } from 'discord.js';

export default class extends Listener {

	public constructor() {
		super('guildCreate', {
			emitter: 'client',
			event: 'guildCreate',
			category: 'client'
		});
	}

	public async exec(guild: Guild) {
		const channel = this.client.channels.cache.get('793380044684132362') as TextChannel;
		const owner = await this.client.users.fetch(guild.ownerID);

		const embed = this.client.util.embed()
			.setColor(0xffa053)
			.setTitle('Joined a new server')
			.setDescription(stripIndents`
				Guild: \`${guild.name} (${guild.id})\`
				Owner: \`${owner.tag} (${owner.id})\` 
				Members: \`${guild.memberCount}\`
			`);

		return channel.send({ embed });

	}

}
