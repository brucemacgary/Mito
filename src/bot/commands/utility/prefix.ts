import { Command, Argument, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('prefix', {
			aliases: ['prefix'],
			category: 'utility',
			channel: 'guild',
			quoted: false,
			description: {
				content: 'Displays or changes the prefix of the guild.',
				usage: '<prefix>',
				examples: ['!', '?']
			}
		});
	}

	public *args() {
		const prefix = yield {
			type: Argument.validate('string', (msg: Message, p) => !/\s/.test(p) && p.length <= 3),
			prompt: {
				retry: 'Please provide a prefix without spaces and less than 3 characters.',
				optional: true
			}
		};

		return { prefix };
	}

	public async exec(message: Message, { prefix }: { prefix: string }) {
		if (!prefix) {
			return message.util?.send({
				embed: { title: 'Prefixes', description: `**1.** <@761469922563063818>\n**2.** ${(this.handler.prefix as PrefixSupplier)(message) as string}`, color: '#ffa053' }
			});
		}
		if (prefix && !message.member?.permissions.has('MANAGE_GUILD')) {
			return message.util?.send({
				embed: { description: `<:MItoCross:769434647234347009> You are missing \`MANAGE SERVER\` permissions!\nCurrent Prefix: \`${(this.handler.prefix as PrefixSupplier)(message) as string}\``, color: 'RED' }
			});
		}
		await this.client.settings.set(message.guild!, 'prefix', prefix);
		if (prefix === 'm!') {
			return message.util?.send({
				embed: { description: `<:MitoTick:769434647590731786> The prefix has been re-set to \`${prefix}\``, color: '#43b582' }
			});
		}
		return message.util?.send({
			embed: { description: `<:MitoTick:769434647590731786> The prefix has been set to \`${prefix}\``, color: '#43b582' }
		});
	}

}
