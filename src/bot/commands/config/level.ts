/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

class LevelCommand extends Command {

	public constructor() {
		super('levelling', {
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
				void message.util?.send('<:MitoTick:769434647590731786> Levelling has been enabled');
				break;
			case true:
				void this.client.settings.set(message.guild?.id!, 'level', false);
				void message.util?.send('<:MitoStop:781826615318806538> Levelling has been disabled');
				break;
			default:
				break;
		}
	}

}

export default LevelCommand;
