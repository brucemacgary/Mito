/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Listener } from 'discord-akairo';
import { Collection, Message, MessageEmbed } from 'discord.js';
import * as moment from 'moment';
import 'moment-duration-format';

export default class MessageDeleteBulkGuildLogListener extends Listener {

	public constructor() {
		super('messageDeleteBulkGuildLog', {
			emitter: 'client',
			event: 'messageDeleteBulk',
			category: 'client'
		});
	}

	public async exec(messages: Collection<string, Message>) {
		if (messages.first()?.author.bot) return;
		const guildLogs: string | undefined = this.client.settings.get(messages.first()?.guild!, 'logs');

		if (guildLogs) {
			const webhook = await this.client.fetchWebhook(guildLogs).catch(() => null);
			if (!webhook) return;
			const output = messages.reduce((out, msg) => {
				const attachment = msg.attachments.first();
				out += `[${moment.utc(msg.createdTimestamp).format('YYYY/MM/DD hh:mm:ss')}] ${msg.author.tag} (${msg.author.id
				}): ${msg.cleanContent ? msg.cleanContent.replace(/\n/g, '\r\n') : ''}${attachment ? `\r\n${attachment.url}` : ''
				}\r\n`;
				return out;
			}, '');
			const embed = new MessageEmbed()
				.setColor(0x824aee)
				.setAuthor(`${messages.first()?.author.tag} (${messages.first()?.author.id})`, messages.first()?.author.displayAvatarURL())
				.addField('<:channel:790128589034356747> Channel', messages.first()?.channel)
				.addField('<:rich_presence:790128525533249566> Logs', 'See attachment file for full logs (possibly above this embed)')
				.setTimestamp(new Date())
				.setFooter('Bulk Deleted');

			return webhook.send({
				embeds: [embed],
				files: [{ attachment: Buffer.from(output, 'utf8'), name: 'logs.txt' }],
				username: 'Mito - Logs',
				avatarURL: 'https://cdn.discordapp.com/avatars/761469922563063818/b0d2a2c6c2715736c9e344774b5bbc5e.png?size=2048'
			});
		}
	}

}
