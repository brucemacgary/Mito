import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('roast', {
			aliases: ['roast'],
			category: 'fun',
			description: {
				content: 'Roast someone using this command.',
				usage: '',
				example: []
			}
		});
	}

	public async exec(message: Message) {
		const replies: Array<string> = [
			"I'd offer you some gum but your smiles got plenty of it.", "Which sexual position produces the ugliest children? Ask your mother.", "I thought of you today. It reminded me to take the garbage out.",
	"You\'re so ugly when you look in the mirror, your reflection looks away." ,
	"Gay? I\'m straighter than the pole your mom dances on." ,
    "I just stepped in something that was smarter than you and smelled better too.",
	"I can\'t help imagining how much awesomer the world would be if your dad had just pulled out." ,
	"Good story, but in what chapter do you shut the fuck up?" ,
	"I was pro life. Then I met you." ,
	"I\'d tell you to go fuck yourself, but that would be cruel and unusual punishment." ,
    "You stare at frozen juice cans because they say, \"concentrate\".",
	"You have the perfect face for radio.",
	"You\'re so ugly you make blind kids cry.",
	"Nice shirt, what brand is it? Clearance?",
	"Don\'t you need a license to be that ugly?",
	"One more wrinkle and you\'d pass for a prune.",
	"You\'re so dumb, your dog teaches you tricks.",
	"You\'re the reason they invented double doors!",
	"Hold on, I\'ll go find you a tampon.",
	"You prefer three left turns to one right turn.",
	"You conserve toilet paper by using both sides.",
	"What did you have for breakfast? Bitch Flakes?",
	"You're so stupid you tried to wake a sleeping bag.",
	"You're so stupid, you'd trip over a cordless phone.",
	"I called your boyfriend gay and he hit me with his purse!",
	"You're so stupid, it takes you an hour to cook minute rice.",
	"Don't feel sad, don't feel blue, Frankenstein was ugly too.",
	"If I wanted a bitch I'd have bought a dog.",
	"You shouldn't play hide and seek, no one would look for you.",
	"You're so ugly, when you threw a boomerang it didn't come back.",
	"The clothes you wear are so ugly even a scarecrow wouldn't wear them.",
    "You're so ugly, when you got robbed, the robbers made you wear their masks.",
    "You're not completely useless, you can always serve as a bad example.",
    "What makes you think I can listen to you?",
	"Well u pissin' me off. Suck it, BITCH!",
	"Hehe. I only serve those who respect me.",
	"You think you so powerful? Wait til you get your boot!",
	"Who came up with the idea to listen to you?"
		];
		const reply: string = replies[Math.floor(Math.random() * replies.length)];

		return message.reply(`${reply}`);

	}

}
