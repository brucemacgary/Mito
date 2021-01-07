import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

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

	public async exec(message: Message) {
		const embed = this.client.util.embed()
			.setAuthor('Mito - Stats', this.client.user?.displayAvatarURL())

			.setColor('#ffa053')
			.addField('Owner', '[BruceMacGary](https://discord.gg/etEquR5)', true)
			.addField('Developers', '[BruceMacGary](https://discord.gg/etEquR5), [Ayush](https://ayushkr.me)', true)
			.addField('Commands', `\`${this.handler.modules.size}\``, true)
			.addField('Creation Date', '`2 OCT, 2020`', true)
			.addField('Guilds', `<a:MitoGuilds:773065181227515919> \`${this.client.guilds.cache.size}\``, true)
			.addField('Users', `\`${this.client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\``, true)
			.addField('Channels', `<:Search:790130542837628938> Total \`${this.client.channels.cache.size}\`\n<:MitoText:786531726356381706> \`${this.client.channels.cache.filter(ch => ch.type === 'text').size}\`\n<:MitoVoice:786531777644724224> \`${this.client.channels.cache.filter(ch => ch.type === 'voice').size}\``, true)

			.addField('Discord.js', '`v12.4.1`', true)
			.addField('Framework', '`Discord Akairo`', true)
			.addField('Node', '`v15.3.0`', true)
			.addField('Ping', `\`${Math.round(this.client.ws.ping).toString()}\`ms`, true)
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		return message.util!.send(embed);
	}

}
