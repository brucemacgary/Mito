import { Listener } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class MessageDeleteGuildLogListener extends Listener {

	public constructor() {
		super('messageDeleteGuildLog', {
			emitter: 'client',
			event: 'messageDelete',
			category: 'client'
		});
	}

	public async exec(message: Message) {
		if (message.author.bot) return;
		if (!message.guild) return;
		if (!message.content) return;

		const guildLogs: string | undefined = this.client.settings.get(message.guild!, 'logs');
		this.client.snipe.set(`${message.guild.id}#${message.channel.id}`, {
			msg: message.content.substring(0, 2000),
			user: message.author.id
		});

		if (guildLogs) {
			const webhook = await this.client.fetchWebhook(guildLogs).catch(() => null);
			if (!webhook) return;
			const attachment = message.attachments.first();
			const embed = new MessageEmbed()
				.setColor(0xFF0000)
				.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL())
				.addField('<:channel:790128589034356747> Channel', message.channel)
				.addField('<:rich_presence:790128525533249566> Message', `${message.content.substring(0, 1020)}`)
				.addField('<:rich_presence:790128525533249566> Message', `[Jump To](${message.url})`, true);
			if (attachment) embed.addField('<:pin:790128546764423198> Attachment(s)', attachment.url);
			embed.setTimestamp(new Date());
			embed.setFooter('Message Deleted');

			return webhook.send({
				embeds: [embed],
				username: 'Mito - Logs',
				avatarURL: 'https://cdn.discordapp.com/avatars/761469922563063818/b0d2a2c6c2715736c9e344774b5bbc5e.png?size=2048'
			});
		}
	}

}
