import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class extends Command {

	public constructor() {
		super('cookie', {
			aliases: ['cookie'],
			category: 'image',
			description: {
				content: 'Give a cookie to your friend or foe.',
				usage: '',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
        const replies: Array<string>  = ["http://i.imgur.com/SLwEY66.gif", "http://i.imgur.com/K6VoNp3.gif", "http://i.imgur.com/knVM6Lb.gif",
    "http://i.imgur.com/P1BMly5.gif", "http://i.imgur.com/I8CrTUT.gif", "https://i.imgur.com/0XTueQR.png",
    "https://i.imgur.com/u9k8x4J.png", "https://i.imgur.com/AUtfHnK.png", "https://i.imgur.com/XjTbrKc.png",
    "https://i.imgur.com/A3mgqEh.png", "https://i.imgur.com/YnkdGZd.png", "https://i.imgur.com/FJsOnOE.png",
    "https://i.imgur.com/RQFPwDg.png", "https://i.imgur.com/vyCTGr0.png", "https://i.imgur.com/kkXToc8.png",
    "https://i.imgur.com/ctHwqVL.png", "https://i.imgur.com/yUaCPvC.png", "https://i.imgur.com/IUM6Z8F.png"
];
const reply: string = replies[Math.floor(Math.random() * replies.length)];
const embed = new MessageEmbed()
.setTitle('🍪 | Cookie Machine')
.setImage(reply)
.setColor('#ffa053')

return message.util?.send(embed);
	}

}
