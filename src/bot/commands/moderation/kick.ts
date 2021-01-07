import { Command } from 'discord-akairo';
import { GuildMember, Message, Permissions, User, TextChannel } from 'discord.js';

export default class KickCommand extends Command {

	public constructor() {
		super('kick', {
			aliases: ['kick'],
			category: 'moderation',
			description: {
				content: 'Kicks a member!',
				usage: '<member>',
				examples: ['@Bruce', '@Ayush dumb', '@Ayush']
			},
			channel: 'guild',
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			ratelimit: 2,
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: 'Whom do you want to kick?',
						retry: 'Please enter a valid guild member.'
					}
				},
				{
					id: 'reason',
					match: 'rest',
					type: 'string',
					default: 'No reason specified'
				}
			]
		});
	}

	public async exec(message: Message, { member, reason }: { member: GuildMember; reason: string }) {

		try {
			await member.kick(`Kicked by ${message.author.tag} | ${reason}`);
		} catch (error) {
			return message.reply({
				embed: { description: '<:MItoCross:769434647234347009> I couldn\'t kick that user!', color: 'RED' }
			});
		}

		const modLogChannel: string | undefined = this.client.settings.get(message.guild!, 'mod');

		if (modLogChannel) {
			const embed = this.client.util.embed()
				.setColor('RED')

				.setAuthor(`${member?.user.tag}`, member?.user.displayAvatarURL())
				.setTitle(`Case | Kick | ${member instanceof User ? member.tag : member.user.tag}`)
				.addField('User', `${member instanceof User ? member.tag : member.user.tag}`, true)
				.addField('Moderator', `${message.member}`, true)
				.addField('Reason', `${reason}`, true)
				.setFooter(`ID: ${member.id}`)

				.setTimestamp();
			await (this.client.channels.cache.get(modLogChannel) as TextChannel)?.send({ embed });
		}

		return message.util?.send({
			embed: { description: `<:MitoTick:769434647590731786> ***Successfully kicked*** ***${member.user.tag}*** | ${reason}`, color: '#43b582' }
		});
	}

}
