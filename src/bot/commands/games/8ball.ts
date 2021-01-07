import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('8ball', {
			aliases: ['8ball'],
			category: 'games',
			args: [
				{
					id: 'question',
					type: 'string',
					match: 'content',
					prompt: {
						start: 'What is your question?'
					}
				}
			],
			description: {
				content: 'Ask the magical 8ball a question!',
				usage: '<question>',
				example: ['Will Ayush die single?']
			}
		});
	}

	public async exec(message: Message) {
		const replies: Array<string> = [
			'Maybe.', 'Certainly not.', 'I hope so.', 'Not in your wildest dreams.',
			'There is a good chance.', 'Quite likely.', 'I think so.',
			'I hope not.', 'I hope so.', 'Never!', 'Fuhgeddaboudit.',
			'Ahaha! Really?!?', 'Pfft.', 'Sorry, bucko.',
			'Hell, yes.', 'Hell to the no.', 'The future is bleak.',
			'The future is uncertain.', 'I would rather not say.', 'Who cares?',
			'Possibly.', 'Never, ever, ever.', 'There is a small chance.', 'Yes!'
		];
		const reply: string = replies[Math.floor(Math.random() * replies.length)];

		return message.util?.send(`🎱 ${reply}`);

	}

}
