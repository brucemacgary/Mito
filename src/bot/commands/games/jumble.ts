/* eslint-disable @typescript-eslint/no-use-before-define */

import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import fetch from 'node-fetch';

export default class extends Command {

	public constructor() {
		super('jumble', {
			aliases: ['jumble'],
			category: 'games',
			description: {
				content: 'Jumbled words game.',
				usage: '<question>',
				example: ['']
			}
		});
	}

	public async exec(message: Message) {
		const data = await this.fetchWords();
		const jumble = new JumbleWords(data);

		const word = jumble.generate();
		await message.channel.send(`Your word is **${word[0].jumble}**!`);

		message.channel.awaitMessages((m: Message) => m.author.id === message.author.id, {
			max: 1,
			errors: ['time'],
			time: 15000
		})
			.then(collected => {
				const msg = collected.first();
				if (msg?.content.toLowerCase() !== word[0].word.toLowerCase()) return message.channel.send(`<:MItoCross:769434647234347009> | Invalid word! Correct word was **${word[0].word}**!`);
				return message.channel.send(`<:MitoTick:769434647590731786> | Correct guess! The word was **${word[0].word}**.`);
			})
			.catch(() => message.channel.send(`<:MItoCross:769434647234347009> | You did not answer in time. The correct word was **${word[0].word}**!`));

	}

	private async fetchWords(): Promise<string[]> {
		const res = await fetch('https://raw.githubusercontent.com/DevSnowflake/jumble-words/master/words.json');
		const data = await res.json();

		return data;
	}

}


class JumbleWords {

	public data: Array<string>;

	public constructor(data: Array<string>) {
		this.data = data;
	}

	/**
	 * Add custom words to data
	 * @param {string|string[]} WordOrArray Word or array of words
	 */
	public addWords(WordOrArray: string|string[]) {
		if (typeof WordOrArray === 'string') this.data.push(WordOrArray);
		if (Array.isArray(WordOrArray)) this.data = this.data.concat(WordOrArray);
	}

	/**
	 * Overwrites existing data and uses provided data
	 * @param {string[]} words Words array
	 */
	public setWords(words: string[]) {
		if (!Array.isArray(words)) throw new Error('Words must be array.');
		this.data = words;
	}


	public generate(limit = 1) {
		if (!limit || typeof limit !== 'number') limit = 1;
		let arr = [];

		for (let i = 0; i < limit; i++) {
			let w = this.random();
			let s = this.randomize(w[0], true);

			arr.push({
				word: w[0],
				jumble: s === w ? this.randomize(w[0], true) : s
			});
		}

		return arr;
	}

	public random(length = 1, arr: string[] | null = null): string[] {
		if (!length || typeof length !== 'number') length = 1;
		const random = Array.isArray(arr) ? this.shuffle(arr) : this.shuffle(this.data);
		return random.slice(0, length);
	}

	public randomize(word: string, force = false): Array<string> {
		if (!word || typeof word !== 'string') throw new Error('Word must be a string!');
		return this.shuffle((word.split('') as string[]), force);
	}

	public shuffle(array: Array<string>, force = false): Array<string> {
		let swap = null;
		let i = null;
		if (!Array.isArray(array)) throw new Error('Invalid array!');

		if (Boolean(force)) {
			let len = array.length;

			while (len > 0) {
				i = Math.floor(Math.random() * len);
				len--;
				swap = array[len];
				array[len] = array[i];
				array[i] = swap;
			}
			return array;
		}
		return array.sort(() => 0.5 - Math.random());

	}

	/**
	 * Words size
	 */
	public get size() {
		return this.data.length;
	}

}
