import { Util, Message } from 'discord.js';
import Client from '../client/Client';
import { Collection } from 'mongodb';

export interface Tag {
	name: string;
	aliases: string[];
	user: string;
	guild: string;
	hoisted: boolean;
	uses: number;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	lastModified: string;
}

class TagHandler {

	protected database: Collection<Tag>;

	public constructor(private readonly client: Client) {
		this.client = client;
		this.database = this.client.mongo.db('musico').collection('tags');
	}

	public async add(tag: Tag) {
		await this.database.insertOne({
			name: tag.name,
			aliases: [tag.name],
			user: tag.user,
			guild: tag.guild,
			hoisted: tag.hoisted,
			uses: tag.uses,
			content: tag.content,
			createdAt: tag.createdAt,
			updatedAt: tag.updatedAt,
			lastModified: tag.lastModified
		});
	}

	public aliasesadd(message: Message, name: string, aliases: string) {
		return this.database
			.updateOne({ name }, {
				$push: { aliases },
				$set: { last_modified: message.author.id }
			},
			{ upsert: true });
	}

	public aliasesdel(message: Message, name: string, aliases: string) {
		return this.database
			.updateOne({ name }, {
				$pull: { aliases },
				$set: { last_modified: message.author.id }
			},
			{ upsert: true });
	}

	public delete(name: string) {
		return this.database.findOneAndDelete({ name });
	}

	public edit(message: Message, tag: Tag, info: string, hoist?: boolean, unhoist?: boolean) {
		return this.database
			.updateOne({
				name: tag.name
			},
			{
				$set: {
					hoisted: hoist ? true : tag.hoisted || unhoist ? false : tag.hoisted,
					content: info ? Util.cleanContent(info, message) : tag.content,
					last_modified: message.author.id,
					updatedAt: new Date()
				}
			},
			{ upsert: true });
	}

	public uses(name: string, uses: number) {
		return this.database
			.updateOne({
				name
			},
			{ $set: { uses } },
			{ upsert: true });
	}

}

export default TagHandler;
