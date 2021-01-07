import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import moment from 'moment';
interface T {
	[key: string]: string;
}

const HUMAN_LEVELS: T = {
	NONE: '`None`',
	LOW: '<:security:790130538656301106> Low',
	MEDIUM: '<:security:790130538656301106>  Medium',
	HIGH: '<:security:790130538656301106>  (╯°□°）╯︵ ┻━┻',
	VERY_HIGH: '<:security:790130538656301106>  ┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};

const REGION: T = {
	'brazil': ':flag_br: Brazil',
	'eu-central': ':flag_eu: Central Europe',
	'singapore': ':flag_sg: Singapore',
	'us-central': ':flag_us: U.S. Central',
	'sydney': ':flag_au: Sydne`',
	'us-east': ':flag_us: U.S. East',
	'us-south': ':flag_us: U.S. South',
	'us-west': ':flag_us: U.S. West',
	'eu-west': ':flag_eu: Western Europe',
	'vip-us-east': ':flag_us: VIP U.S. East',
	'london': ':flag_gb: London',
	'amsterdam': ':flag_nl: Amsterdam',
	'hongkong': ':flag_hk: Hong Kong',
	'russia': ':flag_ru: Russia',
	'southafrica': ':flag_za:  South Africa',
	'india': ':flag_in: India'
};

export default class ServerInfoCommand extends Command {

	public constructor() {
		super('serverinfo', {
			aliases: ['serverinfo', 'server'],
			category: 'moderation',
			channel: 'guild',
			clientPermissions: ['EMBED_LINKS']
		});
	}

	public async exec(message: Message) {
		const hehe = await this.client.users.fetch(message.guild!.ownerID);
		const embed = this.client.util.embed()
			.setThumbnail(message.guild!.iconURL({ dynamic: true })!)
			.setAuthor(message.guild!.name, message.guild!.iconURL({ dynamic: true })!)
			.addField('Owner', `${hehe?.tag} (${message.guild?.ownerID})`)
			.addField(`ID`, `${message.guild!.id}`)
			.addField('Members', `Total: ${message.guild!.memberCount}\nHumans: ${message.guild?.members.cache.filter(m => !m.user.bot).size}\nBots: ${message.guild!.members.cache.filter(m => m.user.bot).size}`)
			.addField('Created', `${moment.utc(message.guild!.createdAt).format('MMMM D, YYYY, kk:mm:ss')}`)
			.addField('Roles', `${message.guild?.roles.cache.size}`)
			.addField(`Emojis`, `${message.guild?.emojis.cache.size}`)
			.addField('Channels', `<:MitoText:786531726356381706> ${message.guild!.channels.cache.filter(ch => ch.type === 'text').size}\n<:MitoVoice:786531777644724224> ${message.guild!.channels.cache.filter(ch => ch.type === 'voice').size}`)
			.addField('Boosts', `${message.guild!.premiumSubscriptionCount}/30`)
			.addField('AFK', message.guild!.afkChannelID ? `<#${message.guild!.afkChannelID}> after ${message.guild!.afkTimeout / 60} min` : 'None')
			.addField('Region', REGION[message.guild!.region])
			.addField('Verification Level', HUMAN_LEVELS[message.guild!.verificationLevel])
			.setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp()
			.setColor('#ffa053');
		return message.util!.send({ embed });
	}

}
