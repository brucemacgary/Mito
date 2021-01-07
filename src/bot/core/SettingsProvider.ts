import { Provider } from 'discord-akairo';
import { Guild } from 'discord.js';
import { Db, BSONType, Collection as MongoDBCollection } from 'mongodb';

interface Settings {
	id: string;
	settings: BSONType;
}

export default class MongoDBProvider extends Provider {

	protected database: MongoDBCollection<Settings>;

	public constructor(database: Db) {
		super();
		this.database = database.collection('settings');
	}

	public async init() {
		const settings = await this.database.find().toArray();
		for (const data of settings) {
			this.items.set(data.id, data);
		}
	}

	public get<T>(guild: string | Guild, key: string, defaultValue?: any): T {
		const id = this.getGuildId(guild);
		const data = this.items.get(id);
		return (data && data[key]) ? data[key] : defaultValue;
	}


	public set(guild: string | Guild, key: string, value: any) {
		const id = this.getGuildId(guild);
		const data = this.items.get(id) || {};
		data[key] = value;
		this.items.set(id, data);

		return this.database.updateOne(
			{ id },
			{ $set: { [key]: value } },
			{ upsert: true }
		);
	}

	public delete(guild: string | Guild, key: string) {
		const id = this.getGuildId(guild);
		const data = this.items.get(id) || {};
		delete data[key];

		return this.database.updateOne({ id }, {
			$unset: { [key]: '' }
		}, { upsert: true });
	}

	public clear(guild: string | Guild) {
		const id = this.getGuildId(guild);
		this.items.delete(id);
		return this.database.deleteOne({ id });
	}

	protected getGuildId(guild: string | Guild): string {
		if (guild instanceof Guild) return guild.id;
		if (guild === 'global' || guild === null) return '0';
		if (typeof guild === 'string' && /^\d+$/.test(guild)) return guild;
		throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.');
	}

}
