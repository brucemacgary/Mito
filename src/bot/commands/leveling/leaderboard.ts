/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Command } from 'discord-akairo';
import { Message, Guild } from 'discord.js';
import paginate from '../../util/paginate';

class LeaderBoard extends Command {

	public constructor() {
		super('leaderboard', {
			aliases: ['leaderboard', 'lb'],
			category: 'levelling',
			description: {
				content: 'leaderboard'
			}
		});
	}

	public async exec(message: Message) {
		let page = 1;
		const leaderboard = await this.client.levels.getLeaderboard(message.guild!.id);
		let paginated = paginate([...leaderboard], page, 20);

		let rank = (paginated.page - 1) * 20;

		let str = '\`\u200e RANK \`  \`\u200e   USER                 \u200e\`  \`\u200eLEVEL\`\n';

		for (const items of paginated.items) {
			const user = await this.client.users.fetch(items.user);
			const currentLevel = this.client.levels.getLevelFromExp(items.exp);
			if (user.id === message.author.id) {
				str += `**\`\u200e  ${String(++rank).padStart(2, '0')}  \u200e\` \`\u200e   ${user.username.substring(0, 20).padEnd(21, ' ')}\u200e\` \`\u200e${String(currentLevel).padStart(3, ' ')}  \u200e\`**\n`;
				continue;
			}
			str += `\`\u200e  ${String(++rank).padStart(2, '0')}  \u200e\` \`\u200e   ${user.username.substring(0, 20).padEnd(21, ' ')}\u200e\` \`\u200e${String(currentLevel).padStart(3, ' ')}  \u200e\`\n`;
		}
		const embed = this.client.util.embed()
			.setColor(11642864)
			.setAuthor(`Leaderboard for ${message.guild!.name}`, (message.guild as Guild).iconURL({ dynamic: true })!)
			.setDescription(str)
			.setFooter(paginated.page > 1 ? `Page ${paginated.page}` : '');

		const msg = await message.util?.send({ embed });
		if (paginated.maxPage <= 1) return;

		for (const emoji of ['⬅', '➡']) {
			await msg?.react(emoji);
		}
		const collector = msg?.createReactionCollector(
			(reaction, user) => ['⬅', '➡'].includes(reaction.emoji.name) && user.id === message.author.id,
			{ time: 45000, max: 10 }
		);

		collector?.on('collect', async reaction => {
			if (reaction.emoji.name === '➡') {
				page += 1;
				paginated = paginate(leaderboard, page, 20);
				rank = (paginated.page - 1) * 20;
				str = '\`## LEVEL USER                      \`\n';
				for (const items of paginated.items) {
					const user = await this.client.users.fetch(items.user);
					const currentLevel = this.client.levels.getLevelFromExp(items.exp);
					++rank;
					str += `\`\u200e${String(rank).padStart(2, ' ')} \u200e${String(currentLevel).padStart(5, ' ')} ${user.username.substring(0, 25).padEnd(26, ' ')}\u200e\`\n`;
				}
				await msg?.edit({
					embed: this.client.util.embed()
						.setColor('#ffa053')
						.setAuthor(`Leaderboard for ${message.guild!.name}`, message.guild?.iconURL({ dynamic: true })!)
						.setDescription(str)
						.setFooter(paginated.page > 1 ? `Page ${paginated.page}` : '')
				});
				await reaction.users.remove(message.author.id);
				return message;
			}

			if (reaction.emoji.name === '⬅') {
				page -= 1;
				paginated = paginate(leaderboard, page, 20);
				rank = (paginated.page - 1) * 20;
				str = '\`## LEVEL USER                      \`\n';
				for (const items of paginated.items) {
					const user = await this.client.users.fetch(items.user);
					const currentLevel = this.client.levels.getLevelFromExp(items.exp);
					++rank;
					str += `\`\u200e${String(rank).padStart(2, ' ')} \u200e${String(currentLevel).padStart(5, ' ')} ${user.username.substring(0, 25).padEnd(26, ' ')}\u200e\`\n`;
				}
				await msg?.edit({
					embed: this.client.util.embed()
						.setColor('#ffa053')
						.setAuthor(`Leaderboard for ${message.guild?.name}`, message.guild?.iconURL({ dynamic: true })!)
						.setDescription(str)
						.setFooter(paginated.page > 1 ? `Page ${paginated.page}` : '')

				});
				await reaction.users.remove(message.author.id);
				return message;
			}
		});

		collector?.on('end', async () => {
			await msg?.reactions.removeAll();
			return message;
		});
		return message;
	}

}

export default LeaderBoard;
