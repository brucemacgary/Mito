import { Listener } from 'discord-akairo';
import { Message, MessageEmbed, Util } from 'discord.js';
const diff = require('diff'); // eslint-disable-line

export default class MessageUpdateGuildLogListener extends Listener {

	public constructor() {
		super('messageUpdateGuildLog', {
			emitter: 'client',
			event: 'messageUpdate',
			category: 'client'
		});
	}

	public async exec(oldMessage: Message, newMessage: Message) {
		if (oldMessage.author.bot || newMessage.author.bot) return;
		if (!newMessage.guild) return;
		if (Util.escapeMarkdown(oldMessage.content) === Util.escapeMarkdown(newMessage.content)) return;

		const guildLogs: string | undefined = this.client.settings.get(newMessage.guild!, 'logs');

		if (guildLogs) {
			const webhook = await this.client.fetchWebhook(guildLogs).catch(() => null);
			if (!webhook) return;
			if (!webhook) return;
			const embed = new MessageEmbed()
				.setColor(0xFFFF00)
				.setAuthor(`${newMessage.author.tag} (${newMessage.author.id})`, newMessage.author.displayAvatarURL())
				.addField('<:channel:790128589034356747> Channel', newMessage.channel);
			let msg = '';
			if (/```(.*?)```/s.test(oldMessage.content) && /```(.*?)```/s.test(newMessage.content)) {
				const strippedOldMessage = /```(?:(\S+)\n)?\s*([^]+?)\s*```/.exec(oldMessage.content);
				if (!strippedOldMessage || !strippedOldMessage[2]) return;
				const strippedNewMessage = /```(?:(\S+)\n)?\s*([^]+?)\s*```/.exec(newMessage.content);
				if (!strippedNewMessage || !strippedNewMessage[2]) return;
				if (strippedOldMessage[2] === strippedNewMessage[2]) return;
				const diffMessage = diff.diffLines(strippedOldMessage[2], strippedNewMessage[2], { newlineIsToken: true });
				for (const part of diffMessage) {
					if (part.value === '\n') continue;
					const d = part.added ? '+ ' : part.removed ? '- ' : '';
					msg += `${d}${part.value.replace(/\n/g, '')}\n`;
				}
				const prepend = '```diff\n';
				const append = '\n```';
				embed.addField('<:rich_presence:790128525533249566> Message', `${prepend}${msg.substring(0, 1000)}${append}`);
			} else {
				const diffMessage = diff.diffWords(
					Util.escapeMarkdown(oldMessage.content),
					Util.escapeMarkdown(newMessage.content)
				);
				for (const part of diffMessage) {
					const markdown = part.added ? '**' : part.removed ? '~~' : '';
					msg += `${markdown}${part.value}${markdown}`;
				}
				embed.addField('<:rich_presence:790128525533249566> Message', `${msg.substring(0, 1020)}` || '\u200b');
			}
			embed
				.addField('<:rich_presence:790128525533249566> Message', `[Jump To](${newMessage.url})`, true)
				.setTimestamp(oldMessage.editedAt || newMessage.editedAt || new Date())
				.setFooter('Message Edited');

			return webhook.send({
				embeds: [embed],
				username: 'Mito - Logs',
				avatarURL: 'https://cdn.discordapp.com/avatars/761469922563063818/b0d2a2c6c2715736c9e344774b5bbc5e.png?size=2048'
			});
		}
	}

}
