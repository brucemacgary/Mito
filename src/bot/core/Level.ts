/* eslint-disable no-mixed-operators */
import Client from '../client/Client';
import { Collection } from 'mongodb';
import { Guild, Message } from 'discord.js';

export interface Data {
	user: string;
	guild: string;
	exp: number;
}

export default class LevelHandlder {

	protected client: Client;
	protected database: Collection<Data>;
	protected cached: Set<string>;
	public constructor(client: Client) {
		this.client = client;
		this.database = this.client.mongo.db('mito').collection('levels');
		this.cached = new Set();
	}

	public getLevelExp(level: number): number {
		return 5 * Math.pow(level, 2) + 50 * level + 100;
	}

	public getLevelFromExp(exp: number): number {
		let level = 0;

		while (exp >= this.getLevelExp(level)) {
			exp -= this.getLevelExp(level);
			level++;
		}

		return level;
	}

	public getLevelProgress(exp: number): number {
		let level = 0;

		while (exp >= this.getLevelExp(level)) {
			exp -= this.getLevelExp(level);
			level++;
		}

		return exp;
	}

	public async getLeaderboard(guild: string): Promise<Array<Data>> {
		const members = await this.database.find({ guild }).toArray();
		return members.sort((a, b) => b.exp - a.exp);
	}

	public async resetGuild(guild: string) {
		const reset = await this.database.deleteMany({ guild });
		return reset;
	}

	public async resetUser(user: string, guild: string) {
		const reset = await this.database.deleteOne({ user, guild });
		return reset;
	}

	public async getGuildMemberExp(user: string, guild: string): Promise<number> {
		const data = await this.database.findOne({ user, guild });
		return data ? data.exp : 0;
	}

	public async setGuildMemberExp({ user, guild, exp }: Data) {
		const data = await this.database.updateOne({ user, guild }, {
			$set: { exp }
		}, { upsert: true });

		return data;
	}

	public async giveGuildUserExp(user: string, message: Message) {
		if (this.cached.has(`${user}#${message.guild?.id}`)) return;

		this.cached.add(`${user}#${message.guild?.id}`);
		const oldExp = await this.getGuildMemberExp(user, (message.guild as Guild).id);
		const oldLvl = this.getLevelFromExp(oldExp);
		const newExp = oldExp + LevelHandlder.randomInt(15, 25);
		const newLvl = this.getLevelFromExp(newExp);

		await this.setGuildMemberExp({
			user,
			guild: (message.guild as Guild).id,
			exp: newExp
		});
		if (oldLvl !== newLvl) {
			await message.util?.send({
				embed: { color: '#ffa053', description: `Congratulations ${message.author.toString()}, you're now level \`${newLvl}\`!` }
			});
		}
		setTimeout(() => {
			this.cached.delete(`${user}#${message.guild?.id}`);
		}, 45000);
	}

	private static randomInt(low: number, high: number): number {
		return Math.floor(Math.random() * (high - low + 1) + low);
	}

}
