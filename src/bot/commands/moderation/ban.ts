import { Command } from 'discord-akairo';
import { GuildMember, Message, Permissions, User, TextChannel } from 'discord.js';

export default class BanCommand extends Command {

	public constructor() {
		super('ban', {
			aliases: ['ban'],
			category: 'moderation',
			description: {
				content: 'Use the ban hammer on someone!',
				usage: '<member>',
				examples: ['@Ayush', '@Ayush dumb', '@Bruce']
			},
			channel: 'guild',
			clientPermissions: [Permissions.FLAGS.MANAGE_ROLES],
			ratelimit: 2,
			args: [
				{
					id: 'member',
					type: 'member',
					prompt: {
						start: 'Whom do you want to ban?',
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
			await member.ban({ reason: `Banned by ${message.author.tag} | ${reason}` });
		} catch (error) {
			return message.reply({
				embed: { description: '<:MItoCross:769434647234347009> I couldn\'t ban that user!', color: 'RED' }
			});
		}

		const modLogChannel: string | undefined = this.client.settings.get(message.guild!, 'mod');

		if (modLogChannel) {
			const embed = this.client.util.embed()
				.setColor('RED')

				.setAuthor(`${member?.user.tag}`, member?.user.displayAvatarURL())
				.setTitle(`Case | Ban | ${member instanceof User ? member.tag : member.user.tag}`)
				.addField('User', `${member instanceof User ? member.tag : member.user.tag}`, true)
				.addField('Moderator', `${message.member}`, true)
				.addField('Reason', `${reason}`, true)
				.setFooter(`ID: ${member.id}`)

				.setTimestamp();
			await (this.client.channels.cache.get(modLogChannel) as TextChannel)?.send({ embed });
		}

		return message.util?.send({
			embed: { description: `<:MitoTick:769434647590731786> *Successfully banned ${member.user.tag}* | ${reason}`, color: '#43b582' }
		});
	}

}
