import { Command, Flag, PrefixSupplier } from 'discord-akairo';
import { Message } from 'discord.js';
import { stripIndents } from 'common-tags';

export default class ToggleCommand extends Command {

	public constructor() {
		super('toggle', {
			aliases: ['toggle'],
			description: {
				content: stripIndents`Available keys:
					• logs \`<webhook id>\`
					• levelling
                Required: \`<>\` | Optional: \`[]\`
                `,
				usage: '<method> <...arguments>'
			},
			category: 'config',
			channel: 'guild',
			userPermissions: ['MANAGE_GUILD'],
			ratelimit: 2
		});
	}

	public *args() {
		const method = yield {
			type: [
				['logs', 'log'],
				['levelling', 'ranking', 'level']
			],
			otherwise: async (msg: Message): Promise<string> => {
				const prefix = await (this.handler.prefix as PrefixSupplier)(msg);
				return stripIndents`
                    **Invalid Key Provided!**
                    Try using \`${prefix}help toggle\` for help.`;
			}
		};

		return Flag.continue(method);
	}

}
