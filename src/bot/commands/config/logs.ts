/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class MessageLog extends Command {

	public constructor() {
		super('toggle-logs', {
			description: {
				content: 'Enables or disables logs'
			}
		});
	}

	public *args(message: Message) {
		const logs = this.client.settings.get(message.guild?.id!, 'logs');

		if (!logs) {
			const id = yield {
				match: 'phrase',
				type: 'string',
				prompt: {
					start: 'Enter the webhook id'
				}
			};
			return { id };
		}
		return { id: undefined };

	}

	public async exec(message: Message, { id }: { id: string | undefined }) {
		if (!id) {
			await this.client.settings.delete(message.guild?.id!, 'logs');
			return message.util?.send({
				embed: {
					description: 'Logs has been successfully deleted',
					color: 0xFF0000
				}
			});
		}

		const webhook = await this.client.fetchWebhook(id).catch(() => null);
		if (!webhook || webhook?.guildID !== message.guild?.id) return message.util?.send({ embed: { description: 'Invalid Webhook, Please try again!', color: 0xFF0000 } });

		await this.client.settings.set(message.guild?.id!, 'logs', webhook.id);
		return message.util?.send(`Activated logs in <#${webhook.channelID}>`);
	}

}

export default MessageLog;
