import { Node, Player, NodeOptions, ConnectionOptions } from 'lavalink';
import events from 'events';
type Client = QueueNode;

interface lavalinkPlayerUpdate {
	op: string;
	state: {
		position: number;
		time: string;
	};
	guildId: string;
}

class Queue extends events.EventEmitter {

	public readonly keys: { next: string; pos: string; prev: string; loop: string };
	private guild: string;
	public constructor(public readonly store: QueueStore, guild: string) {
		super();
		this.store = store;
		this.guild = guild;
		this.keys = {
			next: `${this.guild}.next`,
			pos: `${this.guild}.pos`,
			prev: `${this.guild}.prev`,
			loop: `${this.guild}.loop`
		};

		this.on('event', async d => {
			if (!['TrackEndEvent', 'TrackStartEvent', 'WebSocketClosedEvent'].includes(d.type) || (d.type === 'TrackEndEvent' && !['REPLACED', 'STOPPED'].includes(d.reason!))) {
				let count = d.type === 'TrackEndEvent' ? undefined : 1;
				try {
					await this._next({ count, previous: d });
				} catch (e) {
					this.store.client.emit('error', e);
				}
			}
		});

		this.on('playerUpdate', (d: lavalinkPlayerUpdate) => {
			try {
				this._store.set(this.keys.pos, d.state.position);
			} catch (e) {
				this.store.client.emit('error', e);
			}
		});
	}

	public get player(): Player {
		return this.store.client.players.get(this.guild);
	}

	public async start(): Promise<boolean> {
		const np = this.current();
		if (!np) return this._next();
		await this.player.play(np.track, { start: np.position });
		return true;
	}

	public add(...tracks: Array<string>) {
		if (!tracks.length) return Promise.resolve(0);
		const oldTracks = this._store.get(this.keys.next) || [];
		oldTracks.push(...tracks);
		return this._store.set(this.keys.next, oldTracks);
	}

	public unshift(...tracks: Array<string>) {
		if (!tracks.length) return Promise.resolve(0);
		const oldTracks = this._store.get(this.keys.next) || [];
		oldTracks.unshift(...tracks);
		return this._store.set(this.keys.next, oldTracks);
	}

	public remove(track: string) {
		const tracks = this._store.get(this.keys.next) || [];
		if (tracks.includes(track)) {
			const index = tracks.indexOf(track);
			tracks.splice(index, 1);
			this._store.set(this.keys.next, tracks);

			return true;
		}
		return false;
	}

	public next(count = 1) {
		return this._next({ count });
	}

	public length() {
		const tracks = this._store.get(this.keys.next);
		return tracks ? tracks.length : 0;
	}

	public async sort(predicate?: (a: string, b: string) => number) {
		const tracks = await this.tracks();
		tracks.sort(predicate);
		return this._store.set(this.keys.next, [...tracks]);
	}

	public move(from: number, to: number) {
		const tracks = this._store.get(this.keys.next) || [];
		from = from >= 1 ? from - 1 : tracks.length - (~from + 1);
		to = to >= 1 ? to - 1 : tracks.length - (~to + 1);

		const element = tracks[from];
		tracks.splice(from, 1);
		tracks.splice(to, 0, element);

		this._store.set(this.keys.next, tracks);
		return tracks;
	}

	public shuffle() {
		const tracks = this._store.get(this.keys.next) || [];
		const shuffled = tracks.map((track: string) => ({ sort: Math.random(), track }))
			.sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort)
			.map((a: { track: number }) => a.track);
		return this._store.set(this.keys.next, shuffled);
	}

	public looping(boolean?: boolean) {
		if (boolean === undefined) return this._store.get(this.keys.loop);
		this._store.set(this.keys.loop, boolean);
		return this._store.get(this.keys.loop);
	}

	public splice(start: number, deleteCount?: number, ...arr: Array<string>) {
		const tracks = this._store.get(this.keys.next) || [];
		tracks.splice(start, deleteCount, ...arr);
		return this._store.set(this.keys.next, tracks);
	}

	public trim(start: number, end: number) {
		const tracks = this._store.get(this.keys.next) || [];
		const trimmed = tracks.slice(start, end);
		return this._store.set(this.keys.next, trimmed);
	}

	public async stop() {
		await this.player.stop();
	}

	public clear() {
		this._store.delete(this.keys.pos);
		this._store.delete(this.keys.prev);
		this._store.delete(this.keys.next);
		this._store.delete(this.keys.loop);
		return true;
	}

	public current() {
		const [track, position] = [this._store.get(this.keys.prev), this._store.get(this.keys.pos)];
		if (track) {
			return {
				track,
				position: Math.floor(position) || 0
			};
		}
		return null;
	}

	public tracks() {
		const tracks = this._store.get(this.keys.next);
		return tracks || [];
	}

	private _next({ count, previous }: { count?: number; previous?: { position: number; track: string } | null } = {}) {
		this._store.set(this.keys.pos, 0);
		if (!previous) previous = this.current();
		if (count === undefined && previous) {
			const length = this.length();
			count = this.store.client.advanceBy(this, { previous: previous.track, remaining: length });
		}
		if (count === 0) return this.start();
		const skipped = this._replace(count);
		if (skipped.length) return this.start();
		this.clear();
		return false;
	}

	private _replace(count = 1) {
		const tracks = this._store.get(this.keys.next) || [];
		if (count > tracks.length || count < -tracks.length) return [];
		count = count >= 1 ? count - 1 : tracks.length - (~count + 1);
		this._store.set(this.keys.prev, tracks[count]);
		const skipped = tracks.slice(count + 1, tracks.length);
		this._store.set(this.keys.next, skipped);
		return { length: (skipped.length as number) + 1 };
	}

	private get _store() {
		return this.store.cached;
	}

}

class QueueStore extends Map<string, Queue> {

	public cached: Map<string, any>;
	public constructor(public readonly client: Client) {
		super();
		this.client = client;
		this.cached = new Map();
	}

	public get(key: string) {
		let queue = super.get(key);
		if (!queue) {
			queue = new Queue(this, key);
			this.set(key, queue);
		}
		return queue;
	}

}

class QueueNode extends Node {

	public readonly queues: QueueStore;
	public advanceBy: (queue: Queue, info: { previous: string; remaining: number }) => number;

	public constructor(options: Options) {
		if (!options.hosts) throw new Error('cannot make a queue without a lavalink connection');
		super(options);
		this.queues = new QueueStore(this);
		this.advanceBy = options.advanceBy || (() => 1);
		for (const name of ['event', 'playerUpdate']) {
			this.on(name, d => {
				this.queues.get(d.guildId).emit(name, d);
			});
		}
	}

}

export default QueueNode;

interface Options extends NodeOptions {
	hosts?: {
		ws?: string | { url: string; options: ConnectionOptions };
		rest?: string;
	};
	advanceBy?: (queue: Queue, info: { previous: string; remaining: number }) => number;
}
