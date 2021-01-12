/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Command } from 'discord-akairo';
import { TextChannel, Message } from 'discord.js';

class Suggestions extends Command {

	public constructor() {
		super('suggestions', {
			description: {
				content: ''
			}
		});
	}

	public *args(message: Message) {
		const logs = this.client.settings.get(message.guild?.id!, 'suggestions');

		if (!logs) {
			const channel = yield {
				match: 'phrase',
				type: 'string',
				default: message.channel
			};
			return { channel };
		}
		return { channel: undefined };

	}

	public async exec(message: Message, { channel }: { channel: TextChannel | undefined }) {
		if (!channel) {
			await this.client.settings.delete(message.guild?.id!, 'suggestions');
			return message.util?.send({
				embed: {
					description: 'Suggestions channel has been successfully deleted',
					color: 0xFF0000
				}
			});
		}

		await this.client.settings.set(message.guild?.id!, 'suggestions', channel.id);
		// eslint-disable-next-line @typescript-eslint/no-base-to-string
		return message.util?.send(`Activated logs in ${channel}`);
	}

}

export default Suggestions;
