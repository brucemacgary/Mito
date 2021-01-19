/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class LevelCommand extends Command {

	public constructor() {
		super('toggle-levelling', {
			description: {
				content: 'Enables or disables ranking system'
			}
		});
	}

	public exec(message: Message) {
		const level = this.client.settings.get(message.guild?.id!, 'level', false);

		switch (level) {
			case false:
				void this.client.settings.set(message.guild?.id!, 'level', true);
				void message.util?.send({
					embed: { description: '<:MitoEnabled:786446115381837889> Levelling has been enabled', color: '#43b582' }
				});
				break;
			case true:
				void this.client.settings.set(message.guild?.id!, 'level', false);
				void message.util?.send({
					embed: { description: '<:MitoDisable:786446115511336990> Levelling has been disabled', color: '#888888' }
				});
				break;
			default:
				break;
		}
	}

}

export default LevelCommand;
