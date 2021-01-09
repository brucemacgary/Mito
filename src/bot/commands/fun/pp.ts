import { Command } from 'discord-akairo';
import { User, Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('pp', {
			aliases: ['pp', 'penis'],
			category: 'fun',
			description: {
				content: 'Shows your pp size',
				usage: 'pp @Aysuh',
				example: ['ayush has a smol pp.']
			},
			args: [
				{
					id: 'user',
					type: 'user',
					default: (m: Message) => m.author
				}
			]
		});
	}

	public async exec(message: Message, { user }: { user: User }) {

		const replies: Array<string> = [
			'8D',
			'8=D',
			'8==D',
			'8===D',
			'8====D',
			'8=====D',
			'8======D',
			'8=======D',
			'8========D',
			'8=========D',
			'8==========D',
			'8===========D',
			'8============D'
		];
		const reply: string = replies[Math.floor(Math.random() * replies.length)];
		const embed = this.client.util.embed()
			.setTitle('peepee size machine')
			.setDescription(`${user}'s pp\n${reply}`)
			.setColor('#ffa053')
			.setFooter('yes, i stole this machine from dank memer');

		return message.util?.send(embed);

	}

}
