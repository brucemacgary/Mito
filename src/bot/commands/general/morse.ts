import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('morse', {
			aliases: ['morse'],
			category: 'general',
			description: {
				content: 'Morse Command <a:wtflul:781761267010371626>',
				usage: '',
				example: ['']
			},
			args: [
				{
					id: 'text',
					type: 'uppercase',
					match: 'content',
					prompt: {
						start: 'Enter a text or a morse code to be encoded or decoded.'
					}
				}
			]
		});
	}

	public async exec(message: Message, { text }: { text: string | Array<string> }) {
		let alpha = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
		let morse = '/,.-,-...,-.-.,-..,.,..-.,--.,....,..,.---,-.-,.-..,--,-.,---,.--.,--.-,.-.,...,-,..-,...-,.--,-..-,-.--,--..,.----,..---,...--,....-,.....,-....,--...,---..,----.,-----'.split(',');

		while (text.includes('Ä') || text.includes('Ö') || text.includes('Ü')) {
			text = (text as string).replace('Ä', 'AE').replace('Ö', 'OE').replace('Ü', 'UE');
		}
		if ((text as string).startsWith('.') || (text as string).startsWith('-')) {
			text = (text as string).split(' ');
			let length = text.length;
			for (let i = 0; i < length; i++) {
				text[i] = alpha[morse.indexOf(text[i])];
			}
			text = text.join('');
		} else {
			text = (text as string).split('');
			let length = text.length;
			for (let i = 0; i < length; i++) {
				text[i] = morse[alpha.indexOf(text[i])];
			}
			text = text.join(' ');
		}
		return message.util?.send(text, { code: true });
	}

}
