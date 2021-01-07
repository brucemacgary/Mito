import { Command, Argument } from 'discord-akairo';
import { User, Message, TextChannel, Collection } from 'discord.js';

export default class PruneCommand extends Command {

	public constructor() {
		super('prune', {
			aliases: ['clear', 'prune', 'purge'],
			category: 'moderation',
			args: [
				{
					id: 'amount',
					type: Argument.range('integer', 0, 100, true),
					prompt: {
						start: 'How many messages do you want to clear?',
						retry: 'Please enter a valid number from 1 -100.'
					}
				},
				{
					id: 'user',
					type: 'user',
					prompt: {
						retry: 'Please specify a valid user.',
						optional: true
					}
				}
			],
			description: {
				content: 'Clears messages in a bulk.',
				usage: '<amount> [user]',
				examples: ['10', '15 @Bruce']
			},
			userPermissions: ['MANAGE_MESSAGES'],
			clientPermissions: ['MANAGE_MESSAGES']
		});
	}

	public async exec(message: Message, { user, amount }: { user: User; amount: number}) {
		let messages: Collection<string, Message> | Message[] = await message.channel.messages.fetch({
			limit: 100
		});
		if (user) {
			messages = messages.filter((msg: Message) => msg.author.id === user.id).array().slice(0, amount);
		} else if (!user) {
			messages = messages.array().slice(0, amount);
		}
		await message.delete();
		await (message.channel as TextChannel).bulkDelete(messages).catch(error => {
			if (error) {
				return message.util!.send({
					embe: { description: '<:MItoCross:769434647234347009> You can only bulk delete messages that are under 14 days old.', color: 'RED' }
				});
			}
		});
		return message.util!.send({
			embed: { description: `<:MitoTick:769434647590731786> Successfully purged \`${(messages as []).length}\` Messages!`, color: '#43b582' }
		})
			.then((msg: Message) => msg.delete({ timeout: 3000 }));
	}

}
