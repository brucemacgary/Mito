/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Command, PrefixSupplier } from 'discord-akairo';
import { GuildMember, Message, MessageAttachment } from 'discord.js';
import fetch from 'node-fetch';

class RankCommand extends Command {

	public constructor() {
		super('rank', {
			aliases: ['rank'],
			category: 'leveling',
			description: {
				content: 'rank command'
			},
			args: [
				{
					id: 'member',
					type: 'member',
					default: (m: Message) => m.member
				}
			]
		});
	}

	public async exec(message: Message, { member }: { member: GuildMember }) {
		const level = this.client.settings.get(message.guild?.id!, 'level', false);
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		if (!level) return message.util?.send(`Levelling is disabled. Do \`${(this.handler.prefix as PrefixSupplier)(message)}toggle levelling\` to enable it.`);
		const { user } = member;
		const userData = await this.client.mongo.db('mito').collection('levels').findOne({ user: user.id, guild: message.guild!.id });

		if (!userData && !user.bot) {
			return message.util?.send({
				embed: {
					color: 'RED',
					description: `<:MItoCross:769434647234347009> **${user.tag}** does not have any exp. Start chatting to earn them.`
				}
			});
		} else if (user.bot) {
			return message.util?.send({
				embed: {
					color: 'RED',
					description: `<:MItoCross:769434647234347009> **${user.tag}** is a bot. What will bots do by earning exp?`
				}
			});
		}
		const currentLevel = this.client.levels.getLevelFromExp(userData.exp);
		const levelExp = this.client.levels.getLevelExp(currentLevel);
		const currentLevelExp = this.client.levels.getLevelProgress(userData.exp);
		const leaderboard = await this.client.levels.getLeaderboard(member.guild!.id);

		const rank = leaderboard.findIndex(item => item.user === user.id) + 1;


		const res = await fetch('https://level-api.herokuapp.com/', {
			method: 'POST',
			body: JSON.stringify({
				avatar: user.displayAvatarURL({ format: 'png', size: 2048 }),
				exp: currentLevelExp,
				level: currentLevel,
				nextLevelXp: levelExp,
				rank,
				presence: user.presence.status,
				username: user.username,
				displayHexColor: member.displayHexColor,
				discriminator: user.discriminator
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const buffer = await res.buffer();

		const attachment = new MessageAttachment(buffer, 'rank.png');
		return message.util?.send(attachment);

		// const embed = this.client.util.embed()
		// 	.setColor('#ffa053')

		// 	.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
		// 	.setThumbnail(user.displayAvatarURL({ dynamic: true }))
		// 	.setDescription(`
		// 		<:MitoRank:782611836243542066> **|** **Rank:** \`#${rank}\`
		// 		<:MitoLevel:782612642794962976> **|** **Level:** \`${currentLevel}\`
		// 		<:MitoGrowth:782613256095268874> **|** **Exp:** \`${currentLevelExp} / ${levelExp}\`
		// 		<:MitoTarget:782615490438758410> **|** **Total Exp:** \`${userData.exp}\`
		// 		${progressbar(currentLevelExp, levelExp, 15)}
		// 	`);

		// return message.util?.send({ embed });
	}

}

export default RankCommand;
