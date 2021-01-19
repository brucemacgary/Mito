import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('truth', {
			aliases: ['truth'],
			category: 'games',
			description: {
				content: 'Truth or Dare game',
				usage: '',
				example: []
			}
		});
	}

	public async exec(message: Message) {
		const replies: Array<string> = [
			'If you could broadcast one thing to the world for 30 seconds, what would it be?',
			'What would be the first thing you do if you woke up as the opposite gender?',
			'What\'s the most illegal thing you\'ve ever done?',
			'What\'s your most useless skill?',
			'Who do you secretly think is hot?',
			'Can you see yourself marrying your high school sweetheart?',
			'Have you ever snuck out of the house at night?',
			'If you could only pick one swear word to use for the rest of your life, what would it be?',
			'Would you ever get back with an ex?',
			'Tell everyone about your first kiss.',
			'If you could change one thing about your childhood, what would it be?',
			'If you had one week to live and had to marry someone here, who would it be?',
			'If you could make out with one Disney character, who would it be?',
			'What\'s something that everyone else likes, but you don\'t?',
			'What\'s the most embarassing thing in your room?',
			'What\'s the most embarassing thing that\'s happened when you asked someone out?',
			'What\'s your trick for getting attention from a crush?',
			'What has been one of your most embarassing moments?',
			'If you were allowed to marry more than one person, would you?'


		];
		const reply: string = replies[Math.floor(Math.random() * replies.length)];

		return message.util?.send(`${reply}`);

	}

}
