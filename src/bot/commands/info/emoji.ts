import { stripIndents } from 'common-tags';
import { Command } from 'discord-akairo';
import { GuildEmoji, Message, Permissions } from 'discord.js';
import * as moment from 'moment';
import * as emojis from 'node-emoji';
import * as punycode from 'punycode';

const EMOJI_REGEX = /<(?:a)?:(?:\w{2,32}):(\d{17,19})>?/;

export default class EmojiInfoCommand extends Command {

	public constructor() {
		super('emoji', {
			aliases: ['emoji', 'emoji-info'],
			description: {
				content: 'Get information about an emoji.',
				usage: '<emoji>',
				examples: ['🤔', 'thinking_face', '264701195573133315', '<:Thonk:264701195573133315>']
			},
			category: 'info',
			channel: 'guild',
			clientPermissions: [Permissions.FLAGS.EMBED_LINKS],
			ratelimit: 2,
			args: [
				{
					id: 'emoji',
					match: 'content',
					type: (message, content) => {
						if (EMOJI_REGEX.test(content)) [, content] = EMOJI_REGEX.exec(content)!;
						const guild = message.guild!;
						if (!isNaN((content as unknown) as number)) return guild.emojis.cache.get(content);
						return guild.emojis.cache.find(e => e.name === content) || emojis.find(content);
					},
					prompt: {
						start: 'What emoji would you like information about?',
						retry: 'Please provide a valid emoji!'
					}
				}
			]
		});
	}

	public async exec(message: Message, { emoji }: { emoji: GuildEmoji | emojis.Emoji }) {
		const embed = this.client.util.embed().setColor(0xffa053);

		if (emoji instanceof GuildEmoji) {
			embed.setAuthor(`Infomation of ${emoji.name}`, `${emoji.url}`);
			embed.setThumbnail(emoji.url ?? '');
			embed.setDescription(`→ **ID**:\n${emoji.id}\n→ **Identifier**:\n\`<${emoji.identifier}>\`\n→ **Creation Date**:\n${moment.utc(emoji.createdAt ?? 0).format('YYYY/MM/DD hh:mm:ss')}\n→ **URL**:\n${emoji.url}`);
			embed.setTimestamp();
			embed.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`);
		} else {
			embed.setAuthor(`Info about ${emoji.emoji}`);
			embed.setDescription(`→  **Name**:\n${emoji.key}\n→  **Raw**:\n\`${emoji.emoji}\`\n→  **Unicode**:\n\`${punycode.ucs2.decode(emoji.emoji).map((e: any) => `\\u${e.toString(16).toUpperCase().padStart(4, '0')}`).join('')}\``);
			embed.setTimestamp();
			embed.setFooter(`Requested by ${message.author.tag}`, `${message.author.displayAvatarURL({ dynamic: true })}`);
		}

		return message.util?.send(embed);
	}

}
