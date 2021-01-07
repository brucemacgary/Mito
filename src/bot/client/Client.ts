import { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } from 'discord-akairo';
import { MongoDB } from '../core/Database';
import SettingsProvider from '../core/SettingsProvider';
import Logger from '../util/logger';
import Music from '../core/Queue';
import Level from '../core/Level';
import { Message } from 'discord.js';

import path from 'path';

declare module 'discord-akairo' {
	interface AkairoClient {
		mongo: MongoDB;
		settings: SettingsProvider;
		logger: Logger;
		music: Music;
		levels: Level;
		snipe: Map<string, Snipe>;
		commandHandler: CommandHandler;
	}
}

export default class Client extends AkairoClient {

	public mongo: MongoDB = new MongoDB({
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	public levels!: Level;
	public settings!: SettingsProvider;
	public logger: Logger = new Logger();
	public snipe!: Map<string, Snipe>;

	public music: Music = new Music({
		userID: process.env.ID!,
		password: 'youshallnotpass',
		hosts: {
			rest: process.env.LAVALINK_REST!,
			ws: process.env.LAVALINK_WS!
		},
		send: async (guild, packet): Promise<void> => {
			const shardGuild = this.guilds.cache.get(guild);
			if (shardGuild) return shardGuild.shard.send(packet);
			return Promise.resolve();
		},
		advanceBy: queue => {
			if (queue.looping()) return 0;
			return 1;
		}
	});

	public commandHandler: CommandHandler = new CommandHandler(this, {
		directory: path.join(__dirname, '..', 'commands'),
		prefix: (message: Message) => this.settings.get<string>(message.guild!, 'prefix', 'm!'),
		aliasReplacement: /-/g,
		allowMention: true,
		fetchMembers: true,
		commandUtil: true,
		commandUtilLifetime: 3e5,
		commandUtilSweepInterval: 9e5,
		handleEdits: true,
		defaultCooldown: 3000
	});

	public listenerHandler = new ListenerHandler(this, {
		directory: path.join(__dirname, '..', 'listeners')
	});

	public inhibitorHandler = new InhibitorHandler(this, {
		directory: path.join(__dirname, '..', 'inhibitors')
	});

	public constructor() {
		super({ ownerID: process.env.OWNER!.split(',') });
	}

	public async init() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			inhibitorHandler: this.inhibitorHandler
		});

		this.commandHandler.loadAll();
		this.listenerHandler.loadAll();
		this.inhibitorHandler.loadAll();

		this.on('raw', async packet => {
			switch (packet.t) {
				case 'VOICE_STATE_UPDATE':
					if (packet.d.user_id !== process.env.ID) return;
					await this.music.voiceStateUpdate(packet.d);
					break;
				case 'VOICE_SERVER_UPDATE':
					await this.music.voiceServerUpdate(packet.d);
					break;
				default: break;
			}
		});

		await this.mongo.connect();

		this.settings = new SettingsProvider(this.mongo.db('mito'));
		await this.settings.init();

		this.levels = new Level(this);
		this.snipe = new Map();
	}

	public async start(token: string) {
		await this.init();
		return this.login(token);
	}

}

interface Snipe {
	msg: string;
	user: string;
}
