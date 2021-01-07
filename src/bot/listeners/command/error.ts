import { Command, Listener } from 'discord-akairo';
import { Message } from 'discord.js';

class ErrorListener extends Listener {

	public constructor() {
		super('error', {
			emitter: 'commandHandler',
			event: 'error',
			category: 'commandHandler'
		});
	}

	public async exec(error: Error, message: Message, command: Command) {

		const label = message.guild ? `${message.guild.name} - ${message.guild.id}/${message.author.tag} - ${message.author.id}` : `${message.author.tag}`;

		this.client.logger.error(`${command.id} ~ ${error.message} ${error.stack}`, { label });

		const embed = this.client.util.embed()
			.setColor(0xFF0000)
			.setAuthor('Something went wrong', 'https://cdn.discordapp.com/emojis/769434647234347009.png', 'https://discord.gg/WxYJFQR')
			.setDescription([
				'<:user_dnd:790130468539859005> An error has occured while executing that command. Please report the error in the support server of the bot.',
				'',
				`\`\`\`js\n${error.message}\`\`\``
			]);
		return message.util?.send('https://discord.gg/WxYJFQR', { embed });
	}

}

module.exports = ErrorListener;
