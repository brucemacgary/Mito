import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

class PokedexCommand extends Command {

	public constructor() {
		super('pokemon', {
			aliases: ['pokedex', 'pokemon'],
			category: 'info',
			description: {
				content: 'Pokemon',
				usage: '<pokemon>',
				example: ['magikarp']
			}
		});
	}

	public *args() {
		const pokemon = yield {
			type: 'lowercase',
			match: 'content',
			prompt: {
				start: 'Which pokemon you wanna look for?'
			}
		};

		return { pokemon };
	}

	public async exec(message: Message, { pokemon }: { pokemon: string }) {
		const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`);
		const data = await res?.json();
		const ayushrandi = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`).then(res => res.json()).then(d => d.types.map((m: { slot: any; type: { name: any } }) => `${m.slot}. ${m.type.name}`));
		const ima = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(pokemon)}`).then(res => res.json()).then(d => d.sprites.front_default);

		if (res.status !== 200) return message.util?.send('Invalid pokemon dude!');

		const embed = this.client.util.embed()
			.setColor('#ffa053')
			.setAuthor(`${data.name}`, 'https://images-ext-2.discordapp.net/external/tqmeVg9xEWxDkURYe5So-KVG-4kCoIxyhDUcuRxBh9k/http/pngimg.com/uploads/pokemon_logo/pokemon_logo_PNG12.png')
			.addField('Height', `${data.height}`, true)
			.addField('Weight', `${data.weight}`, true)
			.addField('Type', `${ayushrandi}`, true)
			.setThumbnail(`${ima}`);

		return message.util?.send({ embed });
	}

}

export default PokedexCommand;
